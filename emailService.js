// [IMPORT MODULES]
const nodemailer = require("nodemailer");
require("dotenv").config();

// [TRANSPORTER CONFIGURATION]
// Create nodemailer transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD
	}
});

// [FUNCTIONS]
// Sends an email using the configured transporter
const sendMail = async (mailOptions) => {
	try{
		await transporter.sendMail(mailOptions);
	
		console.log("Email has been sent");
	} catch (error) {
		console.error(error);
	}
};

// Sends a registration notification email to the specified user email address
const sendRegistrationNotification = async (userEmail) => {
	const mailOptions = {
		from: {
			name: "csp2-lachica",
			address: process.env.EMAIL_USER
		},
	
	to: userEmail,
	subject: "Registration Successful in csp2-lachica",
	text: "Thank you for registering in csp2-lachica. Your account is now confirmed.",
	html: "<b>Thank you for registering in csp2-lachica. Your account is now confirmed.</b>"
	};

	await sendMail(mailOptions);
};

// Sends an update password notification email to the specified user email address
const sendUpdatePasswordNotification = async (userEmail) => {
	const mailOptions = {
		from: {
			name: "csp2-lachica",
			address: process.env.EMAIL_USER
		},
		to: userEmail,
		subject: "Update Password Successfully",
		text: "Your password has been updated.",
		html: "<b>Thank you for updating your password.</b>"
	};

	await sendMail(mailOptions);
};

// Sends a checkout notification email to the specified user email address
const sendCheckoutNotification = async (userEmail) => {
	const mailOptions = {
		from: {
			name: "csp2-lachica",
			address: process.env.EMAIL_USER
		},
		to: userEmail,
		subject: "Order Confirmation",
		text: "Your order has been successfully placed.",
		html: "<b>Your order has been successfully placed.</b>"
	};

	await sendMail(mailOptions);
};

// Export functions for use in other modules
module.exports = {
	sendRegistrationNotification,
	sendUpdatePasswordNotification,
	sendCheckoutNotification
};