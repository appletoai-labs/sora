from datetime import datetime

chat_sessions = {}

def get_user_session(user_id):
    if user_id not in chat_sessions:
        chat_sessions[user_id] = {'messages': []}
    return chat_sessions[user_id]

def save_user_message_to_session(user_id, content, sender):
    print("there")
    # session = get_user_session(user_id)
    # session['messages'].append({
    #     'sender': sender,
    #     'content': content,
    #     'timestamp': datetime.utcnow().isoformat()  # Add timestamp for each message
    # })

def get_user_chat_history(user_id):
    return get_user_session(user_id)['messages']
