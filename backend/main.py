from flask import request, jsonify, send_from_directory
from config import app, db
from models import User
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai

# configure env
def configure():
    load_dotenv()

# Configure the Google Gemini API
genai.configure(api_key=os.getenv('API_KEY'))

# Create the model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# method for signing up
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists"}), 409

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201

# method for logging in
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    user = User.query.filter_by(username=username).first()

    if user is None or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"message": "Login successful"}), 200

# method for generating cover letter
@app.route('/generate-cover-letter', methods=['POST'])
def generate_cover_letter():
    # Get the user input from the request
    user_input = request.json.get('input')

    # Start a new chat session
    chat_session = model.start_chat(history=[])

    # Send the user input to the model
    response = chat_session.send_message(user_input)

    # Return the AI's response as JSON
    return jsonify({'response': response.text})

# method for serving react routes
@app.route('/')
@app.route('/<path:path>')
def serve_react_app(path=None):
    if path is not None and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == "__main__":
    configure()
    with app.app_context():
        db.create_all()

    app.run(debug=True)