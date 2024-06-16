import AsyncHandler from 'express-async-handler'
import nodemailer from 'nodemailer'

export const SendEmail = AsyncHandler(async (data) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.Email,
            pass: process.env.Mp,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"Konichiva 👻" <abc@example.com>',
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
});