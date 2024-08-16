const nodemailer = require("nodemailer");
require("dotenv").config();

const { META_PASS, META_MAIL, BASE_LOCAL_URL } = process.env;

const mailerConfig = {
    pool: true,
    host: "smtp.meta.ua",
    // host: "smtp.mail.yahoo.com",
    port: 465,
    secure: true,
    // requireTLS: true,
    auth: {
        user: META_MAIL,
        pass: META_PASS,
    },
    // tls: {
    //     // do not fail on invalid certs
    //     rejectUnauthorized: false,
    // },
};

const transport = nodemailer.createTransport(mailerConfig);

// async function EmailSender(mail, code) {
//     const email = {
//         to: mail,
//         from: META_MAIL,
//         subject: "Verify your email please!",
//         html: `<a target="_blank" href="${BASE_LOCAL_URL}/users/verify/${code}">Click to verify your email</a>`,
//     };

//     await transport.sendMail(email);

//     return true;
// }

async function EmailSender(mail, code) {
    try {
        const email = {
            from: `"Dmytro" <${META_MAIL}>`,
            to: mail,
            subject: "Verify your email please!",
            html: `<a target="_blank" href="${BASE_LOCAL_URL}/users/verify/${code}">Click to verify your email</a>`,
            headers: {
                "X-Mailer": "nodemailer",
                "X-Accept-Language": "en",
            },
        };

        await transport.sendMail(email);
        return true;
    } catch (error) {
        console.error("Помилка при відправці електронного листа:", error);
        // Можливо, варто додати логіку повторної спроби або повідомлення користувачу
        return false;
    }
}

module.exports = EmailSender;
