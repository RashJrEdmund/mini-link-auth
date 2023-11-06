import { validateEmail } from "../../../services/validation";
import createReqFromBody from "../../../extra/createFromReqBody/createFromReqBody";
import AUTH_SERVICE from "./auth.service";
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";

export default class AUTH_CONTROLLER {
    static CREATE_USER_ACCOUNT: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: POST
        const body = req.body;

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: "NOT FOUND",
        });

        try {
            const {
                status: _status, // giving aliases to avoid naming conflicts below
                new_user,
                message: _message
            } = createReqFromBody(body, { _type: "USER", _strict: true }); // strict mode is recomended for creation

            if (_status !== 200 || !new_user) return reply.code(_status).send({
                status: _status,
                message: _message,
                data: null,
            });

            const { data: user, message, status } = await AUTH_SERVICE.signUp(new_user);

            if (!user || status !== 200) return reply.code(status).send({
                status,
                message,
                data: null,
            });

            const user_and_token = AUTH_SERVICE.signUserToken(user); // an object containing the user and his token

            return reply.code(200).send({
                status: 200,
                data: { ...user_and_token },
                message: 'ACCOUNT CREATED, VERIFICATION LINK SENT TO EMAIL',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static LOGIN: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: POST
        const body = req.body as { email: string, password: string };

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: "NOT FOUND",
        });

        try {
            const email = body.email;
            const password = body.password; // the front end ensures passwords do match 😇

            if (!email || !password) return reply.code(400).send({
                status: 400,
                message: "MISSING DETAILS",
                data: null,
            });

            const user_and_token = await AUTH_SERVICE.loginWithEmailPassword(email, password);

            if (!user_and_token || !user_and_token.user) return reply.code(404).send({
                status: 404,
                message: "WRONG EMAIL OR PASSWORD",
                data: null,
            });

            return reply.code(200).send({
                status: 200,
                data: { ...user_and_token },
                message: 'USER LOGGED IN',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static GET_CURRENT_LOGGEDIN_USER = async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            const authoraztion = req.headers.authorization as any as string;
            // return reply.code(200).send({ message: "getting user accout", authoraztion });

            const token = authoraztion?.split(" ").pop() || "";// to give the auth token passed to Authorization: "Beare <token_string>";

            if (!token) return reply.code(400).send({
                status: 400,
                data: null,
                message: "MISSING TOKEN",
            });

            const current_user = await AUTH_SERVICE.getCurrentUser(token);

            if (!current_user) return reply.code(401).send({
                status: 401,
                data: null,
                message: "USER IS UNAUTHORIZED",
            });

            return reply.code(200).send({
                status: 200,
                data: { user: { ...(current_user as any) } },
                message: 'USER RETRIEVED SUCCESFULLY',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static VERIFY_ACCOUNT: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: GET
        try {
            const { params, query } = req as {
                params: {
                    user_id: string,
                }, query: {
                    token: string,
                }
            }
            const user_id = params.user_id;
            const token = query.token;

            if (!user_id || !token) return reply.code(400).send({
                status: 400,
                data: null,
                message: "INVALID REQUEST URL",
            });

            const { status, message } = await AUTH_SERVICE.verifyUserAccount(user_id, token);

            if (status !== 200) return reply.code(status).send({
                status: status,
                data: null,
                message: message,
            });

            return reply.code(200).send({
                status: 200,
                data: null,
                message: "ACCOUNT VERIFIED 🥳",
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static RESEND_VERIFICATION_TOKEN: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: POST   
        try {
            const { user_id, email } = req.body as { user_id: string, email: string };

            if (!user_id || !email || !validateEmail(email)) return reply.code(400).send({
                status: 400,
                data: null,
                message: "MISSING DETAILS",
            });

            await AUTH_SERVICE.createTokenAndSendVerification(user_id, email);

            return reply.code(200).send({
                status: 200,
                data: null,
                message: 'REVERIFICATION URL SENT TO: ' + email,
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static FORGOT_PASSWORD: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: POST
        try {
            const { email, new_password } = req.body as { email: string, new_password: string };

            if (!email || !new_password) return reply.code(401).send({
                status: 401,
                data: null,
                message: "MISSING FIELDS",
            });

            const { status, message } = await AUTH_SERVICE.forgotPassword(email, new_password);

            if (status !== 200) return reply.code(status).send({
                status: status,
                data: null,
                message: message,
            });

            return reply.code(200).send({
                status: 200,
                data: null,
                message: "PASSWORD RESET CODE SENT TO: " + email,
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }

    static RESET_PASSWORD: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply) => { // method: POST
        try {
            const { email, confirmation_code } = req.body as { email: string, confirmation_code: string };

            if (!email || !confirmation_code) return reply.code(401).send({
                status: 401,
                data: null,
                message: "MISSING FIELDS",
            });

            const { status, message } = await AUTH_SERVICE.resetPassword(email, confirmation_code);

            if (status !== 200) return reply.code(status).send({
                status: status,
                data: null,
                message: message,
            });

            return reply.code(200).send({
                status: 200,
                data: null,
                message: "PASSWORD RESETED 🙂",
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: "AN ERROR OCCURED",
            });
        }
    }
}
