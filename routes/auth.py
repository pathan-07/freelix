from flask import Blueprint, render_template, request, redirect, session, url_for, flash, current_app
import random
import logging
from flask_mail import Message
from models.user import db, User
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/auth.html")
def auth_html():
    return render_template("auth.html")

@auth_bp.route("/auth")
def auth_page():
    return render_template("auth.html")

@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        try:
            mail = current_app.extensions['mail']
            
            email = request.form["email"]
            password = request.form["password"]
            full_name = request.form["full_name"]
            account_type = request.form["account_type"]

            # Check if user already exists in the database
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                flash("Email already registered!")
                return redirect(url_for("auth.auth_page"))

            # Store user data in session temporarily
            session["temp_user"] = {
                "email": email,
                "password": generate_password_hash(password),
                "full_name": full_name,
                "account_type": account_type
            }
            
            # Generate OTP
            otp = str(random.randint(100000, 999999))
            session["otp"] = otp
            
            # Create email message
            msg = Message(
                "Your OTP Code for FreeLix",
                recipients=[email]
            )
            msg.body = f"Hello {full_name},\n\nYour OTP code for FreeLix account verification is: {otp}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nThe FreeLix Team"
            
            # Send the email
            mail.send(msg)
            
            return redirect(url_for("auth.verify_otp"))
        except Exception as e:
            flash(f"Error during signup: {str(e)}. Please try again.")
            return redirect(url_for("auth.auth_page"))
            
    return render_template("auth.html")

@auth_bp.route("/verify-otp", methods=["GET", "POST"])
def verify_otp():
    if request.method == "POST":
        entered_otp = ""
        for i in range(1, 7):
            entered_otp += request.form.get(f"otp{i}", "")
        
        stored_otp = session.get("otp")
        
        print(f"Entered OTP: {entered_otp}")
        print(f"Stored OTP: {stored_otp}")
        
        if entered_otp == stored_otp:
            user_data = session.pop("temp_user", None)
            if user_data:
                # Create and save user to database
                new_user = User(
                    email=user_data["email"],
                    password=user_data["password"],
                    full_name=user_data["full_name"],
                    account_type=user_data["account_type"],
                    is_verified=True
                )
                
                try:
                    db.session.add(new_user)
                    db.session.commit()
                    flash("Registration successful! Please login.")
                except Exception as e:
                    db.session.rollback()
                    flash(f"Error during registration: {str(e)}. Please try again.")
                
                return redirect(url_for("auth.auth_page"))
            else:
                flash("Session expired. Please try again.")
                return redirect(url_for("auth.auth_page"))
        else:
            flash("Invalid OTP. Please try again.")
            return redirect(url_for("auth.verify_otp"))

    return render_template("otp.html")

@auth_bp.route("/resend-otp", methods=["GET"])
def resend_otp():
    user = session.get("temp_user")
    if user:
        try:
            mail = current_app.extensions['mail']
            
            email = user["email"]
            full_name = user["full_name"]
            
            # Generate new OTP
            otp = str(random.randint(100000, 999999))
            session["otp"] = otp
            
            # Create email message
            msg = Message(
                "Your New OTP Code for FreeLix",
                recipients=[email]
            )
            msg.body = f"Hello {full_name},\n\nYour new OTP code for FreeLix account verification is: {otp}\n\nThis code will expire in 10 minutes.\n\nBest regards,\nThe FreeLix Team"
            
            # Send the email
            mail.send(msg)
            flash("New OTP sent to your email. Please check your inbox.")
        except Exception as e:
            flash(f"Error sending OTP: {str(e)}. Please try again.")
            
    return redirect(url_for("auth.verify_otp"))

@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    password = request.form["password"]
    
    # Fetch user from the database
    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password, password):
        session["user_id"] = user.id
        session["user_email"] = user.email
        session["user_name"] = user.full_name
        session["account_type"] = user.account_type
        flash("Login successful!")
        return redirect(url_for("home"))
    else:
        flash("Invalid email or password!")
        return redirect(url_for("auth.auth_page"))
