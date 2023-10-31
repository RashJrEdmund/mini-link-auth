import USER_REPO from "./user.repo";
import { createObjectId, validateEmail } from "../../../services/utils";
import { USER } from "../../../types";
import { OptionalId } from "mongodb";

export default class USER_SERVICE {
    static getAllUsers = async () => {
        return USER_REPO.getAll();
    }

    static getById = (_id: any) => {
        return USER_REPO.getById(_id).then((res: any) => res._doc);
    }

    static getByEmail = (email: string) => {
        return USER_REPO.getByEmail(email);
    }

    static createUser = (user: OptionalId<USER>) => {
        return USER_REPO.createUser(user);
    }

    static editUser = async (_id: string, user: USER) => {
        await USER_REPO.editUser(createObjectId(_id), user);

        return this.getById(_id);
    }

    static delete = (_id: string) => {
        return USER_REPO.delete(createObjectId(_id));
    }
}
