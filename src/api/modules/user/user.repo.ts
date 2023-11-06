import { USERS } from "../../../db/schemas";
import type { ObjectId, OptionalId } from "mongodb";
import { USER } from "../../../types/entries";

export default class USER_REPO {
    static getAll = () => {
        return USERS.find({});
    }

    static getById = (_id: string) => {
        return USERS.findById(_id); // mongo _id has type ObjectId
    }

    static getByEmail = (email: string) => {
        return USERS.findOne({ email });
    }

    static createUser = (user: OptionalId<USER>) => {
        return USERS.create(user);
    }

    static updateUser = (_id: string, updates: any) => {
        return USERS.findOneAndUpdate({ _id }, { $set: { ...updates } })
    }

    static delete = (_id: ObjectId) => {
        return USERS.findOneAndDelete({ _id });
    }
};
