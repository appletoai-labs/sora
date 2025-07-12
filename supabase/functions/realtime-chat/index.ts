import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; connect-src 'self' wss:; script-src 'self'",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Handle WebSocket upgrade
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    const { socket, response } = Deno.upgradeWebSocket(req);
    let openaiWs: WebSocket | null = null;

    socket.onopen = async () => {
      console.log("Client WebSocket connected");
      
      // Connect to OpenAI Realtime API
      try {
        // Use proper authentication via headers instead of exposing API key in protocol
        openaiWs = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17");
        
        // Add authentication header after connection is established
        const authHeader = `Bearer ${OPENAI_API_KEY}`;
        
        // Note: WebSocket headers must be set during connection establishment
        // For OpenAI Realtime API, we'll use the Authorization header method
        openaiWs = new WebSocket(
          "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
          {
            headers: {
              "Authorization": authHeader,
              "OpenAI-Beta": "realtime=v1"
            }
          } as any
        );

        openaiWs.onopen = () => {
          console.log("Connected to OpenAI Realtime API");
          // Send session configuration after connection
          const sessionConfig = {
            type: "session.update",
            session: {
              modalities: ["text", "audio"],
              instructions: "You are SORA, a compassionate and intelligent mental health assistant. You provide 24/7 emotional support, active listening, and gentle guidance. Always be empathetic, non-judgmental, and supportive. Help users process their emotions and thoughts in a safe space.",
              voice: "alloy",
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: {
                model: "whisper-1"
              },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              temperature: 0.8,
              max_response_output_tokens: "inf"
            }
          };
          openaiWs?.send(JSON.stringify(sessionConfig));
        };

        openaiWs.onmessage = (event) => {
          console.log("Received from OpenAI:", event.data);
          // Forward OpenAI messages to client
          socket.send(event.data);
        };

        openaiWs.onerror = (error) => {
          console.error("OpenAI WebSocket error:", error);
          socket.send(JSON.stringify({
            type: "error",
            message: "Connection to AI assistant failed"
          }));
        };

        openaiWs.onclose = () => {
          console.log("OpenAI WebSocket closed");
          socket.close();
        };

      } catch (error) {
        console.error("Failed to connect to OpenAI:", error);
        socket.send(JSON.stringify({
          type: "error",
          message: "Failed to connect to AI assistant"
        }));
      }
    };

    socket.onmessage = (event) => {
      console.log("Received from client:", event.data);
      // Forward client messages to OpenAI
      if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(event.data);
      }
    };

    socket.onclose = () => {
      console.log("Client WebSocket disconnected");
      if (openaiWs) {
        openaiWs.close();
      }
    };

    socket.onerror = (error) => {
      console.error("Client WebSocket error:", error);
      if (openaiWs) {
        openaiWs.close();
      }
    };

    return response;

  } catch (error) {
    console.error("Error in realtime-chat function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});