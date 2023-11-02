import { ObjectId } from "mongodb";
import REQ_NOT_FOUND_ERROS from "../extra/REQ_ERROR";

type STRINGIFY = (obj: any, options?: {
    _spacing?: number,
    status?: number,
}) => string;

type ValidateEmailType = (email: string) => boolean;

export const validateEmail: ValidateEmailType = (email) => {
    const regex = /^([A-Za-z\d.-]+)@([A-Za-z\d-]+).([A-Za-z]{2,6})(\.[A-Za-z]{2,6}) ?$/;
    return regex.test(email);
}

export const stringifyData: STRINGIFY = (obj: any, options = { _spacing: 4, status: 200 }) => {
    return JSON.stringify({ data: obj, status: options.status }, null, options._spacing);
}

export const createObjectId = (_id?: string) => {
    if (!_id) return new ObjectId(); // for creating commpletely new ObjectIds// only for users and not urls

    return new ObjectId(_id); // this is a mongodb thing, generates a unique id base on the environment and is only for server side processes
}

export const removeObjectKeys = (object: any, arrKeys: string[]) => {
    const newObject = { ...object };

    for (const key of arrKeys) {
        delete newObject[key];
    }

    return newObject;
}
