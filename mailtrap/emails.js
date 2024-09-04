import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATES,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient } from "./mailtrap.config.js";
import { sender } from "./mailtrap.config.js";
export const sendVerificationEmail = async (email , verificationToken) => {
    const recipient = [{email}]
    try {
        const response =  await mailtrapClient.send({
            from : sender,
            to: recipient,
            subject: "Account Verification",
            html: VERIFICATION_EMAIL_TEMPLATES.replace("{verificationCode}",verificationToken),
            category:"EMAIL VERIFICATION"
        });
        console.log("Email sent successfully");
    } catch(error) {
        console.error(`errro sending verification`,error);
        throw new Error(`ERROR SENDING EMAIL: ${error}`);
    }
};

export const sendWelcomeEmail = async (email,name) => {
    const recipient = [{email}]
    try {
        const response =  await mailtrapClient.send({
            from : sender,
            to: recipient,
        template_uuid:"95b6f1a1-380e-4f0b-842e-e20302001b6e",
        
        });
        console.log("Welcome email sent successfully",response);
    } catch(error) {
        console.error(`errro sending welcome email`,error);
        throw new Error(`ERROR SENDING  WELCOME EMAIL: ${error}`);
    }
}

export const sendPasswordResetEmail = async(email,resetURL)=>{
    const recipient = [{email}];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",

            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURl",resetURL),
            category:"PASSWORD RESET ",
        })
    } catch (error) {

        console.error(`error sending password reset email`,error);
        throw new Error(`ERROR SENDING PASSWORD RESET EMAIL:${error}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};