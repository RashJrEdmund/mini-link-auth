import { ObjectId, OptionalId } from "mongodb";
import { TOKENS } from "../../../db/schemas";
import { ITOKEN } from "../../../types/entries";

export default class TOKEN_REPO {
    static getAllTokens = async () => {
        return TOKENS.find({});
    }

    static getById = async (_id: ObjectId) => {
        return TOKENS.findById(_id);
    }

    static getPrevToken = async (user_id: string, token: string) => {
        return TOKENS.findOne({ user_id, token });
    }

    static getByUserId = async (user_id: ObjectId) => {
        return TOKENS.findOne({ user_id: user_id.toString() }); // will return an array of all the reset tokens generated for a particular user.
    }

    static getByUserIDAndConfirmation = async (user_id: ObjectId, confirmation_code: string) => {
        return TOKENS.findOne({ user_id, confirmation_code });
    }

    static createToken = (token: OptionalId<ITOKEN>) => {
        return TOKENS.create(token);
    }

    static deleteToken = (token_id: ObjectId) => {
        return TOKENS.findByIdAndDelete(token_id);
    }

    static deleteByToken = (token: string) => {
        return TOKENS.deleteOne({ token });
    }
}
