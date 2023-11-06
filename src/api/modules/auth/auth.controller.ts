import REQ_NOT_FOUND_ERROS from "../../../extra/REQ_ERROR";
import { createFromBody } from "../../../extra/functions";
import USER_SERVICE from "../user/user.service";
import AUTH_SERVICE from "./auth.service";
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";

const ERR_MESSAGE = new REQ_NOT_FOUND_ERROS("USER");

export class AUTH_CONTROLLER {
    static CREATE_USER_ACCOUNT: RouteHandlerMethod = async (req, reply) => {
        const body = req.body;

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: ERR_MESSAGE.NOT_FOUND(),
        });

        try {
            const {
                status: _status, // giving aliases to avoid naming conflicts below
                new_user,
                message: _message
            } = createFromBody(body, { _type: "USER", _strict: true }); // strict mode is recomended for creation

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

            const user_and_token = AUTH_SERVICE.signUserToken(user);

            return reply.code(200).send({
                status: 200,
                data: { ...user_and_token },
                message: 'SUCCESS',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }

    static LOGIN: RouteHandlerMethod = async (req, reply) => {
        const body: any = req.body;

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: ERR_MESSAGE.NOT_FOUND(),
        });

        try {
            const email = body.email;
            const password = body.password;

            if (!email || !password)return reply.code(404).send({
                status: 404,
                data: null,
                message: ERR_MESSAGE.MISSING_DETAILS()
            });

            const user_and_token = await AUTH_SERVICE.loginWithEmailPassword(email, password);

            if (!user_and_token) return reply.code(401).send({
                status: 401,
                data: null,
                message: REQ_NOT_FOUND_ERROS.INCORRECT_EMAIL_OR_PASSWORD(),
            });

            return reply.code(404).send({
                status: 200,
                data: { ...user_and_token },
                message: 'USER LOGGED IN',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }

    static CURRENT_USER: RouteHandlerMethod = async (req, reply) => {
        const headers = req.headers;
        const authoraztion = headers.authorization as string;
        // return reply.code(200).send({ message: "getting user accout", authoraztion });

        const token = authoraztion?.split(" ").pop() || "";

        try {
            if (!token) return reply.code(401).send({
                status: 401,
                data: null,
                message: REQ_NOT_FOUND_ERROS.MISSING_TOKEN(),
            });

            const current_user = await AUTH_SERVICE.getCurrentUser(token);

            if (!current_user) return reply.code(401).send({
                status: 401,
                data: null,
                message: REQ_NOT_FOUND_ERROS.BEAER_NOT_FOUND(),
            });

            return reply.code(200).send({
                status: 200,
                data: { user: current_user },
                message: 'SUCCESS',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }

    static FORGOT_PASSWORD: RouteHandlerMethod = async (req: FastifyRequest, reply: FastifyReply)  => {
        return reply.code(200).send("retrieving account"); // continue reading https://blog.logrocket.com/implementing-secure-password-reset-node-js/
    }
}
