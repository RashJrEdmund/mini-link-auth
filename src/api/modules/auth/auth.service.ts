import { BCRYPT, TOKEN_SERVICE } from "../../../extra/validation";
import type { WithId } from "mongodb";
import USER_SERVICE from "../user/user.service";
import { createObjectId, removeObjectKeys, validateEmail } from "../../../services/utils";
import { USER } from "../../../types";

interface IAUTH_SIGNTOKEN {
    (user: any): { token: string, user: USER }
}

export default class AUTH_SERVICE {
    static signUserToken: IAUTH_SIGNTOKEN = (user) => {
        const token = TOKEN_SERVICE.sign(user as WithId<USER>);

        console.log("auth sign token", user)
        return { token, user: user as any as USER }; // 😁
    }

    static verifyUserToken = async (token: string) => {
        return TOKEN_SERVICE.verify(token); // returns the token bearer will be needed to get the currently logged in user
    }

    static getCurrentUser = async (token: string) => {
        const bearer = await AUTH_SERVICE.verifyUserToken(token);

        // space for more

        console.log({ bearer });

        return bearer;
    }

    static loginWithEmailPassword = async (email: string, password: string) => {
        const prev_user = await USER_SERVICE.getByEmail(email);

        if (!prev_user) return null; // will handle as REQ_NOT_FOUND_ERROS.INCORRECT_EMAIL_OR_PASSWORD();

        const match = await BCRYPT.compare(password, prev_user.password as string);

        if (!match) return null // will also handle as line 22;

        return this.signUserToken(prev_user as any);
    }

    static signUp = async (user: USER) => {
        try {
            const { email } = user;

            if (!email || !validateEmail(email)) return {
                status: 401,
                data: null,
                message: "INVALID EMAIL",
            };

            const prev_user = await USER_SERVICE.getByEmail(email);

            if (prev_user) return {
                status: 401,
                data: null,
                message: "USER ALREADY EXITS",
            };

            const password_hash = await BCRYPT.hash(user.password); // "was getting a data must be a string or buffer" password error from BCRYP.has

            const _id = createObjectId(); // a new user_id

            await USER_SERVICE.createUser({
                ...user,
                _id,
                password: password_hash,
            });

            const new_user = await USER_SERVICE.getById(_id.toString());

            return {
                status: 200,
                data: { ...new_user },
                message: "SUCESS",
            }
        } catch (er: any) {
            throw er
        }
    }
}
