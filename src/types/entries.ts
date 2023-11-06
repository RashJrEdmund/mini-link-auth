import { ObjectId } from "mongodb";

type LINK_OBJ = {
    _id?: string;
    user_id: string; // null for not logged in users
    visitor_id?: string,
    short_link?: string;
    original: string;
    clicks: string | number;
    status?: "Active" | "Inactive";
    alias?: string;
    createdAt?: string | number;
};

type USER = {
    _id?: ObjectId, // there's sposed to be a password field
    username: string,
    email: string,
    password: string,
    profile_pic: string,
    is_premium_user: boolean,
    createdAt?: string,
    updatedAt?: string,
}

type VISITOR_OBJ = {
    _id?: string, // normal _id from mongodb
    links?: LINK_OBJ[], // this is going to 
    visitor_id: string, // from fingerprintjs
    chances?: number,
    user_id?: string | null, // just incase.
    createdAt: string,
    updatedAt?: string,
}

interface ITOKEN {
    user_id: ObjectId,
    token: string,
    new_user_password?: string, // will only use this in case of a forgot password call
    confirmation_code?: string, // will also only use this for a forgot password request
}

export type {
    LINK_OBJ,
    USER,
    VISITOR_OBJ,
    ITOKEN,
}
