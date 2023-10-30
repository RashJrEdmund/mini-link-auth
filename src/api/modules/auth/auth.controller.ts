import REQ_NOT_FOUND_ERROS from "../../../extra/REQ_ERROR";
import { createFromBody } from "../../../extra/functions";
import USER_SERVICE from "../user/user.service";
import AUTH_SERVICE from "./auth.service";
import { RouteHandlerMethod } from "fastify";

const ERR_MESSAGE = new REQ_NOT_FOUND_ERROS("USER");

export class AUTH_CONTROLLER {
    static CREATE_USER_ACCOUNT: RouteHandlerMethod = async (req, reply) => {
        return reply.code(200).send("creating user accout");
        const body = req.body;

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: ERR_MESSAGE.NOT_FOUND(),
        });

        try {
            const { status, new_user } = createFromBody(body, { _type: "USER", _strict: true }); // strict mode is recomended for creation

            if (status !== 200 || !new_user) return reply.code(404).send({
                status: 404,
                data: null,
                message: ERR_MESSAGE.MISSING_DETAILS()
            });

            const user = await USER_SERVICE.createUser(new_user);

            if (!user) return reply.code(404).send({
                status: 404,
                data: null,
                message: ERR_MESSAGE.NOT_FOUND(),
            });


            const user_and_token = AUTH_SERVICE.signUserToken(user);

            return reply.code(404).send({
                status: 200,
                data: { ...user_and_token },
                message: 'SUCCESS',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: er?.body?.message ?? ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }

    static LOGIN: RouteHandlerMethod = async (req, reply) => {
        const body = req.body;
        return reply.code(200).send("login into user accout");

        const accumulator: any = {};
        accumulator.body = body;

        if (!body) return reply.code(404).send({
            status: 404,
            data: null,
            message: ERR_MESSAGE.NOT_FOUND(),
        });

        try {
            const { status, new_user: user } = createFromBody(body, { _type: "USER", _strict: false }); // strict mode is recomended for creation
            accumulator.createFromBody = { status, new_user: user };

            if (status !== 200 || !user?.email || !user?.password) return reply.code(404).send({
                status: 404,
                data: null,
                message: ERR_MESSAGE.MISSING_DETAILS()
            });

            const user_and_token = await AUTH_SERVICE.loginWithEmailPassword(user.email, user.password);

            if (!user_and_token) return reply.code(401).send({
                status: 401,
                data: REQ_NOT_FOUND_ERROS.INCORRECT_EMAIL_OR_PASSWORD(),
                message: 'SUCCESS',
            });

            accumulator.user_and_token;

            return reply.code(404).send({
                status: 200,
                data: { ...user_and_token, accumulator },
                message: 'SUCCESS',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: er?.body?.message ?? ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }

    static CURRENT_USER: RouteHandlerMethod = async (req, reply) => {
        const headers = req.headers;
        const authoraztion = headers["Authorization"] as string;
        return reply.code(200).send({ message: "getting user accout", authoraztion });

        const token = authoraztion?.split(" ").pop();

        console.log("headaers", headers);

        try {
            if (!token) return reply.code(401).send({
                status: 401,
                data: null,
                message: REQ_NOT_FOUND_ERROS.MISSING_TOKEN(),
            });

            const bearer = await AUTH_SERVICE.verifyUserToken(token);

            if (!bearer) return reply.code(401).send({
                status: 401,
                data: null,
                message: REQ_NOT_FOUND_ERROS.BEAER_NOT_FOUND(),
            });

            return reply.code(404).send({
                status: 200,
                data: { user: bearer },
                message: 'SUCCESS',
            });
        } catch (er: any) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: er?.body?.message ?? ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }
}
