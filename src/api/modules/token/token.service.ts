import { createObjectId, generateConfirmationCode, generateToken } from "../../../services/fxns";
import TOKEN_REPO from "./token.repo";
import { ObjectId } from "mongodb";
import { ITOKEN } from "../../../types/entries";

export default class USER_TOKEN_SERVICE {
    static getAll = async () => {
        return TOKEN_REPO.getAllTokens();
    }

    static getById = async (_id: string) => {
        return TOKEN_REPO.getById(createObjectId(_id));
    }

    static getTokenByUserId = async (user_id: ObjectId) => {
        return TOKEN_REPO.getByUserId(user_id); // will return an array of all the reset tokens generated for a particular user.
    }

    static getPrevToken = async (user_id: string, token: string) => {
        return TOKEN_REPO.getPrevToken(user_id, token);
    }

    static getTokenByUserIdAndConfrimationCode = async (user_id: ObjectId, confirmation_code: string) => {
        return TOKEN_REPO.getByUserIDAndConfirmation(user_id, confirmation_code);
    }

    static createUserToken = async (user_id: ObjectId) => {
        const prev_token = await this.getTokenByUserId(user_id);

        if (prev_token) return prev_token;

        const newToken: ITOKEN = {
            user_id,
            token: generateToken(),
        }

        await TOKEN_REPO.createToken(newToken);

        return this.getTokenByUserId(user_id);
    }

    static createForgotPassToken = async (user_id: ObjectId, password: string) => { // takes password as bear sting.
        const prev_token = await this.getTokenByUserId(user_id);

        if (prev_token) return prev_token;

        const newToken: ITOKEN = {
            user_id,
            token: generateToken(),
            new_user_password: password,
            confirmation_code: generateConfirmationCode(), // to generate a 6 digit confirmation code. all caps [A-Z]{6}
        }

        await TOKEN_REPO.createToken(newToken);

        return this.getTokenByUserId(user_id);
    }

    static deleteToken = async (token_id: ObjectId) => {
        return TOKEN_REPO.deleteToken(token_id);
    }

    static deleteByToken = async (token: string) => {
        return TOKEN_REPO.deleteByToken(token);
    }
};
