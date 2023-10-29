import { FastifyInstance } from "fastify";

type ROUTER = (fastify: FastifyInstance, options: {}) => Promise<void>;

export type {
    ROUTER
}
