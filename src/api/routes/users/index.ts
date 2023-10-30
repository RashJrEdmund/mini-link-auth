import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../../../types/fastify";

const router: ROUTER = async (fastify: FastifyInstance, options) => {
    fastify.get("/", (_, reply: FastifyReply) => {
        reply.send("getting all users");
    });

    fastify.get("/:_d", (req: FastifyRequest, reply: FastifyReply) => {
        const { _d } = req.params as { _d: string };

        if (!_d) return reply.code(401).send({ message: "UNAUTHORIZED ACTION" });

        return reply.send(`get user: ${_d}`);
    });
};

export default router;
