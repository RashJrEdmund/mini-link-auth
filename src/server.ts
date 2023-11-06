import fastify from "fastify";
import { config } from "./config/config";
import custom_logger from "./extra/custom_logger";
import registerRoutes from "./fastify/registerRoutes";

try {
    const server = fastify();

    registerRoutes(server); // where routes have been registered and prefixed;

    const { deploy: {
        host,
        port
    } } = config;

    server.listen({ host: host, port: port }, (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }

        custom_logger("ADDRESS", address);
    });
} catch (error) {
    custom_logger("ERROR", error);
}
