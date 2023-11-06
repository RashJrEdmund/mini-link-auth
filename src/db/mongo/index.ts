import mongoose from "mongoose";
import { config } from "../../config/config";

mongoose
    .connect(config.mongodb.url)
    .then(() => console.log("mongoose connected \n"))
    .catch((error) => console.log("\nerror:", error.message));

export default mongoose;
