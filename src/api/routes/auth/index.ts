import { FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../../../types/fastify";
import custom_logger from "../../../extra/custom_logger";

const router: ROUTER = async (fastify, option) => {
    fastify.get("/current-user", (req: FastifyRequest, reply: FastifyReply) => {
        const headers = req.headers;
        const token = headers.token;

        custom_logger("token", token);
    });

    fastify.post("/create-account", (req: FastifyRequest, reply: FastifyReply) => {
        const headers = req.headers;
        const token = headers.token;

        custom_logger("token", token);
    });

    fastify.post("/login", (req: FastifyRequest, reply: FastifyReply) => {
        const headers = req.headers;
        const token = headers.token;

        custom_logger("token", token);
    });
}

export default router;
