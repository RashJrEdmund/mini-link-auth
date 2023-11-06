import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../../../types/fastify";
import USER_CONTROLLER from "../../modules/user/user.controller";

const router: ROUTER = async (fastify: FastifyInstance, options) => {
    fastify.get("/", USER_CONTROLLER.GET_ALL_USERS);

    fastify.get("/:_d", (req: FastifyRequest, reply: FastifyReply) => {
        const { _d } = req.params as { _d: string };

        if (!_d) return reply.code(401).send({ message: "UNAUTHORIZED ACTION" });

        return reply.send(`get user: ${_d}`);
    });
};

export default router;
