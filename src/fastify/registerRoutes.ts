import { FastifyInstance } from "fastify";
import { auth_router, index_router, user_router } from "../api/routes";

const API_PREFIX: string = "/api/v1";

export default (server: FastifyInstance) => {
    server.register(index_router, { prefix: "/" });

    server.register(auth_router, { prefix: `${API_PREFIX}/auth` });

    server.register(user_router, { prefix: `${API_PREFIX}/users` });
}

// server.get("/", (req, reply) => {
//     return "hello fastify ts"
// });
