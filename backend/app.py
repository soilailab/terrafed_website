import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello from Flask!'})


@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json(silent=True) or {}

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    organization = (data.get('organization') or '').strip()
    role = (data.get('role') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email or not message:
        return jsonify({'status': 'error', 'message': 'Name, email, and message are required.'}), 400

    try:
        sender_email = os.getenv('SENDER_EMAIL')
        sender_password = os.getenv('SENDER_PASSWORD')
        recipient_email = os.getenv('CONTACT_RECIPIENT_EMAIL', 'info@soilslab.ai')

        if not sender_email or not sender_password:
            return jsonify({'status': 'error', 'message': 'Email service unavailable via form.'}), 503

        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = 'TERRAFED FORM SUBMISSION'
        msg['Reply-To'] = email

        body = f"""
New Contact Form Submission:

Name: {name}
Email: {email}
Organization: {organization or 'N/A'}
Role: {role or 'N/A'}
Message:
{message}
"""
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        try:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        finally:
            server.quit()

        return jsonify({'status': 'success', 'message': 'Your message has been sent successfully!'})
    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred while sending your message. Please try again later.'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)