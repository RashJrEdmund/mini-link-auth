import REQ_NOT_FOUND_ERROS from "../../../extra/REQ_ERROR";
import USER_SERVICE from "./user.service";
import { FastifyReply, RouteHandlerMethod } from "fastify";

const ERR_MESSAGE = new REQ_NOT_FOUND_ERROS("USER");

export default class USER_CONTROLLER {
    static GET_ALL_USERS: RouteHandlerMethod = async (_, reply: FastifyReply) => {
        try {
            const all_users = await USER_SERVICE.getAllUsers();

            return reply.code(200).send({
                status: 200,
                data: [...all_users],
                total: all_users.length,
                message: 'USER LIST',
            });
        } catch (error) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: ERR_MESSAGE.AN_ERROR_OCCURED(),
            });
        }
    }
};
