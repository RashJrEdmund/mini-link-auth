import fastify from "fastify";
import { HOST, PORT } from "./services/contants"
import custom_logger from "./services/extra/custom_logger";
import { index_router } from "./routes";

try {
    const server = fastify();

    server.register(index_router, { prefix: "/" });

    // server.get("/", (req, reply) => {
    //     return "hello fastify ts"
    // });

    server.listen({ host: HOST, port: PORT }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }

        custom_logger("ADDRESS", address);
    });
} catch (error) {
    custom_logger("ERROR", error);
}