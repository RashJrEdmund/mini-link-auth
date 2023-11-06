import { ObjectId } from "mongodb";
import { customAlphabet } from 'nanoid';

type STRINGIFY = (obj: any, options?: {
    _spacing?: number,
    status?: number,
}) => string;

const stringifyData: STRINGIFY = (obj: any, options = { _spacing: 4, status: 200 }) => {
    return JSON.stringify({ data: obj, status: options.status }, null, options._spacing);
}

const createObjectId = (_id?: string) => {
    if (!_id) return new ObjectId(); // for creating commpletely new ObjectIds

    return new ObjectId(_id);
}

const removeObjectKeys = (object: any, arrKeys: string[]) => { // removes properties from an object
    const newObject = { ...object };

    for (const key of arrKeys) {
        delete newObject[key];
    }

    return newObject;
}

const getAlphabets = () =>
    Array(26)
        .fill(null)
        .map((_, i) => String.fromCharCode(i + 65))
        .join(""); // generates CAPITAL [A - Z]. will use it with nanoid to get random

const generateConfirmationCode = () => {
    const nanoid = customAlphabet(getAlphabets(), 6); // nanoid docs https://github.com/ai/nanoid#readme
    return nanoid()
};

const generateToken = (size?: number) => {
    const customSet = getAlphabets() + getAlphabets().toLocaleLowerCase() + "1234567890_-" //return [A-Z,a-z,0-9-_]
    const nanoid = customAlphabet(customSet);

    return nanoid(size ?? 65);
};

export {
    stringifyData,
    createObjectId,
    removeObjectKeys,
    generateConfirmationCode,
    generateToken
}
