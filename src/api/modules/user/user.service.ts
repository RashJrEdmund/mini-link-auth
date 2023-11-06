import USER_REPO from "./user.repo";
import { USER } from "../../../types/entries";
import { OptionalId } from "mongodb";
import { createObjectId } from "../../../services/fxns";

export default class USER_SERVICE {
    static getAllUsers = async () => {
        return USER_REPO.getAll();
    }

    static getById = async (_id: string) => {
        return USER_REPO.getById(_id).then((res: any) => res._doc);
    }

    static getByEmail = async (email: string) => {
        return USER_REPO.getByEmail(email).then((res: any) => {
            return res?._doc || res; // res._doc appears when loging in and only res comes shows up when signingup.
        });
    }

    static createUser = async (user: OptionalId<USER>) => {
        return USER_REPO.createUser(user);
    }

    static updateUser = async (user_id: string, updates: any) => {
        await USER_REPO.updateUser(user_id, updates);

        return this.getById(user_id);
    }

    static delete = (_id: string) => {
        return USER_REPO.delete(createObjectId(_id));
    }
}
