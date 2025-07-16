from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from utils import get_user_session, save_user_message_to_session, get_user_chat_history
from openai_utils import get_sora_response
from gamification import add_xp
from gtts import gTTS
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def api_chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400

        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'demo_user')
        account_type = data.get('account_type', 'individual')
        speak = data.get('speak', False)  # <-- NEW flag for speech

        if not message:
            return jsonify({'success': False, 'error': 'Message is required'}), 400

        save_user_message_to_session(user_id, message, 'user')
        user_session = get_user_session(user_id)
        recent_messages = user_session['messages'][-10:]

        conversation_history = []
        for msg in recent_messages:
            if msg['sender'] == 'user':
                conversation_history.append(f"User: {msg['content']}")
            else:
                conversation_history.append(f"SORA: {msg['content']}")

        sora_mode = 'companion' if account_type == 'individual' else 'coaching'
        response_result = get_sora_response(message=message, user_id=user_id, sora_mode=sora_mode)

        if isinstance(response_result, tuple):
            response = response_result[0]
        else:
            response = response_result

        save_user_message_to_session(user_id, response, 'sora')
        add_xp(user_id, 8, "Chat interaction with SORA")

        response_payload = {
            'success': True,
            'response': response,
            'message_id': f"{datetime.now().timestamp()}"
        }

        # If frontend requests speech audio, generate TTS and include base64 audio
        if speak:
            tts = gTTS(text=response, lang='en')
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            b64_audio = base64.b64encode(audio_buffer.read()).decode('utf-8')
            response_payload['audio'] = f"data:audio/mp3;base64,{b64_audio}"

        return jsonify(response_payload)

    except Exception as e:
        print("Chat API error:", str(e))
        return jsonify({'success': False, 'error': 'Failed to process message'}), 500


@app.route('/api/chat-history', methods=['GET'])
def api_chat_history():
    try:
        user_id = request.args.get('user_id', 'demo_user')
        chat_history = get_user_chat_history(user_id) or []

        messages = []
        for entry in chat_history:
            messages.append({
                'id': f"db_{entry.get('id', len(messages))}",
                'content': entry.get('message', ''),
                'sender': entry.get('sender', 'user'),
                'timestamp': entry.get('timestamp', datetime.now().isoformat())
            })

        return jsonify({'success': True, 'messages': messages})
    except Exception as e:
        print("Chat history API error:", str(e))
        return jsonify({'success': False, 'error': 'Failed to load chat history'}), 500


if __name__ == "__main__":
    app.run(debug=True)
