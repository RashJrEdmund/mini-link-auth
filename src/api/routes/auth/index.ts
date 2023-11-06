import { FastifyReply, FastifyRequest } from "fastify";
import { ROUTER } from "../../../types/fastify";
import custom_logger from "../../../extra/custom_logger";
import { AUTH_CONTROLLER } from "../../modules/auth/auth.controller";

const router: ROUTER = async (fastify, option) => {
    fastify.get("/", (req: FastifyRequest, reply: FastifyReply) => {
        return reply.send("Mini - Link : AUTH_API 🔐");
        const headers = req.headers;
        const token = headers.token;

        custom_logger("token", token);
    });

    fastify.get("/current-user", AUTH_CONTROLLER.CURRENT_USER);

    // fastify.get("/verify/:user_id", AUTH_CONTROLLER.VERIFY_ACCOUNT);

    // post requests
    fastify.post("/create-account", AUTH_CONTROLLER.CREATE_USER_ACCOUNT);

    fastify.post("/login", AUTH_CONTROLLER.LOGIN);

    fastify.post("/forgot-password", AUTH_CONTROLLER.FORGOT_PASSWORD);

    // fastify.post("/resend-verification", AUTH_CONTROLLER.RESEND_VERIFICATION_TOKEN);

    // fastify.post("/reset-password", AUTH_CONTROLLER.RESET_PASSWORD);
}

export default router;
