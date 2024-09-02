import { VERIFICATION_EMAIL_TEMPLATES } from "./emailTemplates.js";
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
