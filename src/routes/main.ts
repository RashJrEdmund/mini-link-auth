import { FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../types/fastify";

const router: ROUTER = async (fastify, options) => {
    fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
        return reply.send("hello");
    })
};

export default router;
