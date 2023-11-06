import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { WithId } from "mongodb";

import {
    JWT_PRIVATE_KEY,
    SALT_ROUNDS,
    TOKEN_EXPIRERY_TIME
} from "./constants/constants";

type ValidateEmailType = (email: string) => boolean;

const validateEmail: ValidateEmailType = (email) => {
    const regex = /^([A-Za-z\d.-]+)@([A-Za-z\d-]+).([A-Za-z]{2,6})(\.[A-Za-z]{2,6}) ?$/;
    return regex.test(email);
}

class BCRYPT {
    static hash = async (password: string) => {
        return bcrypt.hash(`${password}`, +SALT_ROUNDS); // throws an error if password is not a string, and Salt_rounds is not a number;
    }

    static compare = async (_plain_password: string, prev_hash: string) => {
        return bcrypt.compare(`${_plain_password}`, prev_hash);
    }
}

class TOKEN_SERVICE {
    static sign = (_user: WithId<Document>) => {
        return jwt.sign(
            { ..._user, bearer_id: _user._id },
            JWT_PRIVATE_KEY,
            { expiresIn: TOKEN_EXPIRERY_TIME }
        );
    }

    static verify = (token: string) => {
        return jwt.verify(token, JWT_PRIVATE_KEY);
    }
}

export {
    validateEmail,
    BCRYPT,
    TOKEN_SERVICE,
}
