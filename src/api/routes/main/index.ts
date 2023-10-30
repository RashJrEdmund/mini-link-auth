import { FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../../../types/fastify";

const router: ROUTER = async (fastify, options) => {
    fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
        return reply.send("Mini - Link : AUTH_API 🔐");
    });
};

export default router;
