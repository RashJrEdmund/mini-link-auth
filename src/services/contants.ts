require("dotenv").config();

const PORT = process.env.PORT as unknown as number || 5000; // 😎

export {
    PORT,
}
