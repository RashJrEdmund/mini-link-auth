import { ObjectId } from "mongodb";

export type LINK_OBJ = {
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

export type USER = {
    _id?: ObjectId, // there's sposed to be a password field
    username: string,
    email: string,
    password: string,
    profile_pic: string,
    is_premium_user: boolean,
    createdAt?: string,
    updatedAt?: string,
}

export type VISITOR_OBJ = {
    _id?: string, // normal _id from mongodb
    links?: LINK_OBJ[], // this is going to 
    visitor_id: string, // from fingerprintjs
    chances?: number,
    user_id?: string | null, // just incase.
    createdAt: string,
    updatedAt?: string,
}
