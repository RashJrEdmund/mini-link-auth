require("dotenv").config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY || "";

const SALT_ROUNDS = process.env.SALT_ROUNDS || "";

const TOKEN_EXPIRERY_TIME = process.env.TOKEN_EXPIRERY_TIME || "1 hr";

const API_BASE_URL = process.env.API_BASE_URL || "";

const MINI_LINK_EMAIL = process.env.MINI_LINK_EMAIL || "";

export {
    JWT_PRIVATE_KEY,
    SALT_ROUNDS,
    TOKEN_EXPIRERY_TIME,
    API_BASE_URL,
    MINI_LINK_EMAIL,
}
