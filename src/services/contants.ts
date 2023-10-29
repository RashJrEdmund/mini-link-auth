require("dotenv").config();

const HOST = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const PORT = process.env.PORT as unknown as number || 5000; // 😎

console.log({ HOST, PORT });

export {
    PORT,
    HOST,
}
