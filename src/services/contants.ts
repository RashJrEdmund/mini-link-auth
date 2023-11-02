import custom_logger from "../extra/custom_logger";

require("dotenv").config();

const HOST = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const PORT = process.env.PORT as unknown as number || 5000; // 😎

const MONGO_CONNECT_URL = process.env.MONGO_CONNECT_URL || "";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "";

const SALT_ROUNDS = process.env.SALT_ROUNDS || "";

const TOKEN_EXPIRERY_TIME = process.env.TOKEN_EXPIRERY_TIME || "1 hr";

custom_logger("HOST AND PORT", { HOST, PORT });

export {
    PORT,
    HOST,
    MONGO_CONNECT_URL,

    JWT_PRIVATE_KEY,
    SALT_ROUNDS,
    TOKEN_EXPIRERY_TIME
}
