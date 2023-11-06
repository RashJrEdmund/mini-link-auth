import { BCRYPT, TOKEN_SERVICE, validateEmail } from "../../../services/validation";
import USER_SERVICE from "../user/user.service";
import { USER } from "../../../types/entries";
import USER_TOKEN_SERVICE from "../token/token.service";
import { API_BASE_URL } from "../../../services/constants/constants";
import sendEmail from "../../../services/sendEmail";
import { createObjectId } from "../../../services/fxns";

interface IAUTH_SIGNTOKEN {
    (user: any): { token: string, user: USER }
}

export default class AUTH_SERVICE {
    static signUserToken: IAUTH_SIGNTOKEN = (user) => {
        const token = TOKEN_SERVICE.sign({ ...user });

        return { token, user: user as any as USER }; // 😁
    }

    static verifyUserToken = async (token: string) => {
        return TOKEN_SERVICE.verify(token); // returns the token bearer will be needed to get the currently logged in user
    }

    static createTokenAndSendVerification = async (user_id: string, email: string) => {
        return USER_TOKEN_SERVICE
            .createUserToken(createObjectId(user_id))
            .then(new_token => {
                sendEmail.verifyEmail({
                    url: `${API_BASE_URL}/auth/verify/${user_id.toString()}/?token=${new_token?.token}`,
                    to: [email]
                });
            });
    }

    static getCurrentUser = async (token: string) => {
        const bearer = await AUTH_SERVICE.verifyUserToken(token);

        return bearer;
    }

    static verifyUserAccount = async (user_id: string, token: string) => {
        try {
            const prev_token = await USER_TOKEN_SERVICE.getPrevToken(user_id, token);

            if (!prev_token) return {
                status: 404,
                data: null,
                message: "INVALID LINK OR TOKEN EXPIRED"
            };

            await USER_SERVICE.updateUser(user_id, { verified: true });

            await USER_SERVICE.getById(user_id);

            USER_TOKEN_SERVICE.deleteByToken(token); // removing token from database

            return {
                status: 200,
                data: null,
                message: "ACCOUNT VERIFIED 🥳"
            }
        } catch (error) {
            return {
                status: 500,
                data: null,
                message: "AN ERROR OCCURED"
            };
        }
    }

    static forgotPassword = async (email: string, new_password: string) => {
        if (!email || !validateEmail(email) || !new_password) return {
            status: 400,
            data: null,
            message: "MISSING DETAILS"
        };

        const user = await USER_SERVICE.getByEmail(email);

        if (!user) return {
            status: 404,
            data: null,
            message: "USER ACCOUNT NOT FOUND"
        };

        await USER_TOKEN_SERVICE
            .createForgotPassToken(user._id, new_password)
            .then(reset_token => {
                sendEmail.resetPassword({
                    to: [email],
                    confirmation_code: reset_token?.confirmation_code || "", // sending confirmation code to user
                });
            });

        return {
            status: 200,
            data: null,
            message: "PASSWORD RESET CODE SENT TO EMAIL"
        };
    }

    static resetPassword = async (email: string, confirmation_code: string) => {
        if (!email || !validateEmail(email) || !confirmation_code) return {
            status: 400,
            data: null,
            message: "MISSING DETAILS"
        };

        const user = await USER_SERVICE.getByEmail(email);

        if (!user) return {
            status: 404,
            data: null,
            message: "USER ACCOUNT NOT FOUND"
        };

        const token = await USER_TOKEN_SERVICE.getTokenByUserIdAndConfrimationCode(user._id, confirmation_code);

        if (!token) return {
            status: 404,
            data: null,
            message: "INVALID CONFIRMATION OR TOKEN EXPIRED"
        };

        // reseting user password and storing the hash;

        const password_hash = await BCRYPT.hash(token.new_user_password);

        const update = await USER_SERVICE.updateUser(user._id.toString(), { password: password_hash });

        USER_TOKEN_SERVICE.deleteToken(token._id); // clearing token from database

        return {
            status: 200,
            data: { update, token }, // not being sent by the controller
            message: "PASSWORD RESETED"
        };
    }

    static loginWithEmailPassword = async (email: string, password: string) => {
        const prev_user = await USER_SERVICE.getByEmail(email);

        if (!prev_user) return null; // will handle as REQ_NOT_FOUND_ERROS.INCORRECT_EMAIL_OR_PASSWORD();

        const match = await BCRYPT.compare(password, prev_user.password as string);

        if (!match) return null // will also handle as line 22;

        return this.signUserToken(prev_user as USER);
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
                status: 409,
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

            this.createTokenAndSendVerification(_id.toString(), email);

            return {
                status: 200,
                data: { ...new_user },
                message: "SUCESS",
            }
        } catch (er: any) {
            throw er
        }
    }
};
