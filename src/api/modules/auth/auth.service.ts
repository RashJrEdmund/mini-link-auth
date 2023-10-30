import { BCRYPT, TOKEN_SERVICE } from "../../../extra/validation";
import type { WithId } from "mongodb";
import USER_SERVICE from "../user/user.service";
import { createObjectId, removeObjectKeys } from "../../../services/utils";
import AUTH_REPO from "./auth.repo";
import { USER } from "../../../types";
import REQ_NOT_FOUND_ERROS from "../../../extra/REQ_ERROR";

const ERR_MESSAGE = new REQ_NOT_FOUND_ERROS("USER");

export default class AUTH_SERVICE {
    static getById = (_id: string) => {
        return AUTH_REPO.getById(createObjectId(_id));
    }

    static getByEmail = (email: string) => {
        return AUTH_REPO.getByEmail(email);
    }

    static signUserToken = (user: WithId<Document>) => {
        const token = TOKEN_SERVICE.sign(user);

        return { token, user };
    }

    static verifyUserToken = async (token: string) => {
        return TOKEN_SERVICE.verify(token); // returns the token bearer;
    }

    static loginWithEmailPassword = async (email: string, password: string) => {
        let prev_user = await USER_SERVICE.getByEmail(email);

        if (!prev_user) return null; // will handle as REQ_NOT_FOUND_ERROS.INCORRECT_EMAIL_OR_PASSWORD();

        const match = await BCRYPT.compare(password, prev_user.password);

        if (!match) return null // will also handle as line 22;

        prev_user = removeObjectKeys(prev_user, ["password"]) // removing the password field;
        // const token =  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTBkYmE3ZGVhMjc4YWNkMjg1NWQwOGQiLCJ1c2VybmFtZSI6InBvc3QgbWFuIDEiLCJlbWFpbCI6InBvc3QgbWFuIDFAZ21haWwuY29tIiwicHJvZmlsZV9waWMiOiIiLCJpc19wcmVtaXVtX3VzZXIiOmZhbHNlLCJjcmVhdGVkQXQiOiJXZWQgU2VwIDEzIDIwMjMiLCJiZWFyZXJfaWQiOiI2NTBkYmE3ZGVhMjc4YWNkMjg1NWQwOGQiLCJpYXQiOjE2OTU0ODg0OTcsImV4cCI6MTY5NTQ5MjA5N30.wx3MTz8e1CPUzHNlKkyodD5tfrQQFJEWu7iwOJe-MWI"
        // return {token, user: prev_user}

        return this.signUserToken(prev_user);
    }

    static createUser = async (user: USER) => {
        try {
            const { email } = user;

            const prev_user = await this.getByEmail(email);

            if (prev_user) return {
                status: 401,
                data: null,
                message: ERR_MESSAGE.FIELD_ALREADY_EXITS("email"),
            };

            const password_hash = await BCRYPT.hash(user.password); // returns the password hash

            const _id = createObjectId();

            await AUTH_REPO.createUser({
                ...user,
                _id,
                password: password_hash,
            });

            return this.getById(_id.toString());
        } catch (er: any) {
            throw er;
        }
    }

    static editUser = async (_id: string, user: USER) => {
        await AUTH_REPO.editUser(createObjectId(_id), user);

        return this.getById(_id);
    }

    static delete = (_id: string) => {
        return AUTH_REPO.delete(createObjectId(_id));
    }
}
