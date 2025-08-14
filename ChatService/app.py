from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from utils import get_user_session, save_user_message_to_session, get_user_chat_history
from openai_utils import get_sora_response
from gamification import add_xp
from gtts import gTTS
import io
import base64
import os

app = Flask(__name__)
CORS(app, origins=['http://localhost:8080','https://sora-henna-six.vercel.app','https://www.sora-ally.com'])

@app.route('/api/chat', methods=['POST'])
def api_chat():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        message = data.get('message', '').strip()
        user_id = data.get('user_id', 'demo_user')
        previous_response_id = data.get('previous_response_id')
        account_type = data.get('account_type', 'individual')
        speak = data.get('speak', False)

        if not message:
            return jsonify({'error': 'Message is required'}), 400

        save_user_message_to_session(user_id, message, 'user')
        sora_mode = 'companion' if account_type == 'individual' else 'coaching'

        result = get_sora_response(
            message=message,
            previous_response_id=previous_response_id,
            user_id=user_id,
            sora_mode=sora_mode
        )

        save_user_message_to_session(user_id, result['message'], 'sora')
        add_xp(user_id, 8, "Chat interaction with SORA")

        response_payload = {
            'response_id': result['response_id'],
            'message': result['message']
        }

        if speak:
            tts = gTTS(text=result['message'], lang='en')
            audio_buffer = io.BytesIO()
            tts.write_to_fp(audio_buffer)
            audio_buffer.seek(0)
            b64_audio = base64.b64encode(audio_buffer.read()).decode('utf-8')
            response_payload['audio'] = f"data:audio/mp3;base64,{b64_audio}"

        return jsonify(response_payload)

    except Exception as e:
        print("Chat API error:", str(e))
        return jsonify({'error': 'Failed to process message', 'details': str(e)}), 500

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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv("PORT", 5050)))
