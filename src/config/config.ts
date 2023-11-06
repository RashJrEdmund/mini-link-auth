import dotenv from "dotenv";
import nodemailer from "nodemailer";
import custom_logger from "../extra/custom_logger";

dotenv.config();

// render configs
const HOST = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const PORT = process.env.PORT as unknown as number || 5000; // 😎

// mongo config;
const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL || "";

// nodemailer configs for email

const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 465;

const EMAIL_HOST = process.env.MAILTRAP_EMAIL_HOST || "smtp.gmail.com";

const EMAIL_TRANSPORT_USERNAME = process.env.MAILTRAP_EMAIL_TRANSPORT_USERNAME || "";

const EMAIL_TRANSPORT_PASSWORD = process.env.MAILTRAP_EMAIL_TRANSPORT_PASSWORD || "";

const emailTransmiter = nodemailer.createTransport({
	host: EMAIL_HOST, // hostname or IP address to connect to (defaults to ‘localhost’)
	port: EMAIL_PORT, // port to connect to (defaults to 587 if is secure is false or 465 if true)
	secure: false,
	auth: {
		// TODO: replace `user` and `pass` values from <https://forwardemail.net>
		user: EMAIL_TRANSPORT_USERNAME, // 'REPLACE-WITH-YOUR-ALIAS@YOURDOMAIN.COM'
		pass: EMAIL_TRANSPORT_PASSWORD, // 'REPLACE-WITH-YOUR-GENERATED-PASSWORD'
	},
	tls: {
        ciphers:'SSLv3'
    }
});

custom_logger("HOST AND PORT", { HOST, PORT });

export const config = {
	mongodb: {
		url: MONGO_CONNECT_URL,
	},
    deploy: {
        host: HOST,
        port: PORT,
    },
	emailTransmiter,
};
