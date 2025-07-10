import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface VoiceInterfaceProps {
  onSpeakingChange?: (speaking: boolean) => void;
  onTranscriptChange?: (transcript: string) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ 
  onSpeakingChange, 
  onTranscriptChange 
}) => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [sessionReady, setSessionReady] = useState(false);

  const connectToSora = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      // Connect to our Edge Function WebSocket
      const wsUrl = `wss://ceaugajhabwnbuqqqcno.supabase.co/functions/v1/realtime-chat`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('Connected to SORA');
        setIsConnected(true);
        toast({
          title: "Connected to SORA",
          description: "Your 24/7 mental health assistant is ready",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received message:', data.type);

          switch (data.type) {
            case 'session.created':
              console.log('Session created, ready to chat');
              setSessionReady(true);
              break;
              
            case 'session.updated':
              console.log('Session updated');
              setSessionReady(true);
              break;
              
            case 'response.audio.delta':
              if (data.delta && audioContextRef.current) {
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await playAudioData(audioContextRef.current, bytes);
                setIsSpeaking(true);
                onSpeakingChange?.(true);
              }
              break;
              
            case 'response.audio.done':
              setIsSpeaking(false);
              onSpeakingChange?.(false);
              break;
              
            case 'response.audio_transcript.delta':
              if (data.delta) {
                setTranscript(prev => prev + data.delta);
                onTranscriptChange?.(transcript + data.delta);
              }
              break;
              
            case 'response.audio_transcript.done':
              console.log('Full transcript:', transcript);
              break;
              
            case 'input_audio_buffer.speech_started':
              console.log('User started speaking');
              break;
              
            case 'input_audio_buffer.speech_stopped':
              console.log('User stopped speaking');
              break;
              
            case 'error':
              console.error('SORA error:', data.message);
              toast({
                title: "Connection Error",
                description: data.message,
                variant: "destructive",
              });
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to SORA",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = () => {
        console.log('Disconnected from SORA');
        setIsConnected(false);
        setSessionReady(false);
        setIsRecording(false);
        setIsSpeaking(false);
        stopRecording();
      };

    } catch (error) {
      console.error('Error connecting to SORA:', error);
      toast({
        title: "Connection Failed",
        description: "Could not establish connection to SORA",
        variant: "destructive",
      });
    }
  };

  const startRecording = async () => {
    if (!sessionReady) {
      toast({
        title: "Not Ready",
        description: "Please wait for SORA to initialize",
        variant: "destructive",
      });
      return;
    }

    try {
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });
      
      await recorderRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Listening",
        description: "SORA is now listening to you",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    setIsRecording(false);
  };

  const disconnect = () => {
    stopRecording();
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsConnected(false);
    setSessionReady(false);
    setIsSpeaking(false);
    setTranscript('');
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
      <div className="bg-card border rounded-lg p-6 shadow-lg max-w-sm">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg">SORA Voice Assistant</h3>
          <p className="text-sm text-muted-foreground">
            {!isConnected 
              ? "24/7 mental health support" 
              : sessionReady 
                ? "Ready to listen"
                : "Initializing..."
            }
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {!isConnected ? (
            <Button 
              onClick={connectToSora}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Connect to SORA
            </Button>
          ) : (
            <>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center gap-2"
                disabled={!sessionReady}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    Talk
                  </>
                )}
              </Button>
              
              <Button 
                onClick={disconnect}
                variant="outline"
                className="flex items-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                Disconnect
              </Button>
            </>
          )}
        </div>

        {isConnected && (
          <div className="mt-4 text-center">
            <div className="flex justify-center gap-2 text-xs text-muted-foreground">
              <span className={`flex items-center gap-1 ${isRecording ? 'text-red-500' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                {isRecording ? 'Recording' : 'Not recording'}
              </span>
              <span className={`flex items-center gap-1 ${isSpeaking ? 'text-blue-500' : ''}`}>
                <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`} />
                {isSpeaking ? 'SORA speaking' : 'Silent'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInterface;