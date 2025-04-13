from flask import Flask, render_template, session, send_from_directory, request, redirect, url_for, flash
from flask_mail import Mail
import os
import json
from routes.auth import auth_bp
from models.user import db, User
from config import config
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

# Get configuration based on environment
config_name = os.getenv('FLASK_ENV', 'development')
app = Flask(__name__, 
           template_folder="templates",
           static_folder="static")

# Load configuration from config dictionary
app.config.from_object(config[config_name])

# Set secret key for session
app.secret_key = app.config['SECRET_KEY']

# Dummy users (email-password pairs)
dummy_users = {
    'user1@example.com': 'password1',
    'user2@example.com': 'password2',
    'admin@example.com': 'adminpass'
}

# Application model for storing application form data
class Application(db.Model):
    __tablename__ = 'applications'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    linkedin = Column(String(200), nullable=False)
    govt_id = Column(String(50), nullable=False)
    skills = Column(Text, nullable=False)
    certifications = Column(Text, nullable=False) 
    portfolio = Column(String(200))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Application {self.email}>"

# Initialize database
db.init_app(app)

# Initialize mail after all configurations
mail = Mail(app)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

# Register blueprints
app.register_blueprint(auth_bp)

@app.route("/")
def home():
    # Pass the user information from session to the template
    user_email = session.get('user_email')
    return render_template("index.html", user_email=user_email)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        
        # Check if credentials match our dummy users
        if email in dummy_users and dummy_users[email] == password:
            # Store user information in session
            session['user_email'] = email
            return redirect(url_for('home'))
        else:
            error = "Invalid email or password"
            return render_template("auth.html", error=error)
    
    # If GET request, show login page
    return render_template("auth.html")

@app.route("/logout")
def logout():
    # Clear the user's session
    session.pop('user_email', None)
    return redirect(url_for('home'))

@app.route("/apply", methods=["GET", "POST"])
def apply():
    if request.method == "POST":
        try:
            # Get form data
            application_data = {
                "name": request.form.get("name"),
                "email": request.form.get("email"),
                "linkedin": request.form.get("linkedin"),
                "govtId": request.form.get("govtId"),
                "skills": request.form.get("skills"),
                "certifications": request.form.get("certifications"),
                "portfolio": request.form.get("portfolio", "")
            }
            
            # Create a new Application record in the database
            new_application = Application(
                name=application_data["name"],
                email=application_data["email"],
                linkedin=application_data["linkedin"],
                govt_id=application_data["govtId"],
                skills=application_data["skills"],
                certifications=application_data["certifications"],
                portfolio=application_data["portfolio"]
            )
            
            # Save to database
            db.session.add(new_application)
            db.session.commit()
            
            # Store applicant name in session for thank you message
            session['applicant_name'] = application_data['name']
            
            # Flash success message
            flash(f"Thank you, {application_data['name']}! Your application has been submitted successfully.", "success")
            
            # Redirect back to home page
            return redirect(url_for('home'))
            
        except Exception as e:
            flash(f"Error submitting application: {str(e)}", "error")
            return redirect(url_for('apply'))
    
    # If GET request, show application form
    return render_template("apply.html")

@app.route("/thank-you")
def thank_you():
    # Get applicant name from session
    applicant_name = session.get('applicant_name', 'Applicant')
    
    # Clear applicant name from session
    if 'applicant_name' in session:
        session.pop('applicant_name')
        
    return render_template("thankyou.html", applicant_name=applicant_name)

@app.route("/applications")
def view_applications():
    # Simple protection - only for logged in users
    if 'user_email' not in session:
        return redirect(url_for('login'))
        
    # Admin protection - only admin can see all applications
    if session['user_email'] != 'admin@example.com':
        return redirect(url_for('home'))
        
    # Fetch all applications from database
    applications = Application.query.order_by(Application.created_at.desc()).all()
    return render_template("applications.html", applications=applications)

# Serve static files
@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.template_folder, filename)

if __name__ == "__main__":
    app.run(debug=True)
