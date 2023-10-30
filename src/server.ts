import fastify from "fastify";
import { HOST, PORT } from "./services/contants"
import custom_logger from "./extra/custom_logger";
import registerRoutes from "./fastify/registerRoutes";

try {
    const server = fastify();

    registerRoutes(server); // where routes have been registered and prefixed;

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