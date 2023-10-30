import { MongoClient } from "mongodb";
import { MONGO_URL } from "../../src/services/contants";

const client = new MongoClient(MONGO_URL as string);

export function start_mongo(): Promise<MongoClient> {
    console.log("\n starting mongo DB... \n");

    return client.connect();
}

export default client.db();
