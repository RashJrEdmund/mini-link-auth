import { config } from "../config/config";
import custom_logger from "../extra/custom_logger";
import { MINI_LINK_EMAIL } from "./constants/constants";

const { emailTransmiter } = config;

interface ISendEmail {
    ({ }: { url: string, to: string[], subject?: string }): Promise<void>;
};

interface IResetPass {
    ({ }: { to: string[], confirmation_code: string, subject?: string }): Promise<void>;
};

const verifyEmail: ISendEmail = async ({ url, subject, to }) => {
    const html = `
        <body>
            <style>
                .container {
                    border-radius: 10px;
                    width: min(97%, 400px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: start;
                    margin: 4rem auto;
                    font-family: sans-serif;
                }

                p {
                    line-height: 25px;
                }

                .verification_btn {
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: fit-content;
                    height: fit-content;
                    padding: 10px;
                    background-color: #0b101b;
                    color: #fff;
                    text-decoration: none;
                    margin: 1rem auto;
                }
            </style>
            <div class="container">
                <p>Welcome to mini-link</p>
                <p>Your email got signed up to mini-link, if this is not you, ignore this email. Else, verify your account below</p>
                <a class="verification_btn" href="${url}" target="_blank">
                    Verify Email
                </a>
            </div>
        </body>
    `

    return emailTransmiter.sendMail({
        from: MINI_LINK_EMAIL,
        to,
        subject: subject || "Email Verification",
        // text: url,
        html,
    }).then((res: any) => {
        custom_logger("email sent", res);
    }).catch((err: any) => {
        custom_logger("ERROR", err, { type: "error" });
    });
};

const resetPassword: IResetPass = async ({ subject, to, confirmation_code }) => {
    const html = `
        <body>
            <style>
                .container {
                    border-radius: 10px;
                    width: min(97%, 400px);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: start;
                    margin: 4rem auto;
                    font-family: sans-serif;
                }

                #paragraph {
                    line-height: 25px;
                }

                #confirmation_code {
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: fit-content;
                    height: fit-content;
                    padding: 15px 15px;
                    background-color: #0b101b;
                    color: #fff;
                    letter-spacing: 7px;
                    font-weight: 800;
                    margin: 1rem auto;
                }
            </style>
            <div class="container">
                <p id="paragraph">you requested for a password reset. below is your confirmation string. copy and paste in the app</p>
                <span id="confirmation_code">
                    ${confirmation_code}
                </span>
            </div>
        </body>
    `;

    return emailTransmiter.sendMail({
        from: MINI_LINK_EMAIL,
        to,
        subject: subject || "reset password",
        text: confirmation_code,
        html,
    }).then((res: any) => {
        custom_logger("email sent", res);
    }).catch((err: any) => {
        custom_logger("ERROR", err, { type: "error" });
    });
};

const notifyEmail = (to: string, subject: string, text: string) => {
    emailTransmiter.sendMail({
        from: MINI_LINK_EMAIL,
        to,
        subject,
        text,
        html: `<button onclick="alart("email verified")">VERIFY EMAIL</button>`
    }).then((res: any) => {
        custom_logger("email sent", res);
    }).catch((err: any) => {
        custom_logger("ERROR", err, { type: "error" });
    });
};

export default {
    notifyEmail,
    resetPassword,
    verifyEmail
};
