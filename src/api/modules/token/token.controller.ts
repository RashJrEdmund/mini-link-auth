import USER_TOKEN_SERVICE from "./token.service";
import { FastifyReply, RouteHandlerMethod } from "fastify";

export default class TOKEN_CONTROLLER {
    static GET_ALL_TOKENS: RouteHandlerMethod = async (_, reply: FastifyReply) => {
        try {
            const all_tokens = await USER_TOKEN_SERVICE.getAll();

            return reply.code(200).send({
                status: 200,
                data: [...all_tokens],
                message: 'TOKEN LIST',
            });

        } catch (error) {
            return reply.code(500).send({
                status: 500,
                data: null,
                message: 'ERROR : ' + error,
            });
        }
    }
}
