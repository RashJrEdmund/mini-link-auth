import custom_logger from "../extra/custom_logger";

require("dotenv").config();

const HOST = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const PORT = process.env.PORT as unknown as number || 5000; // 😎

const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL;

custom_logger("HOST AND PORT", { HOST, PORT });

export {
    PORT,
    HOST,
    MONGO_CONNECT_URL,
}
