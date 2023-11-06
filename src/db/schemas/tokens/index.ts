import db from "../../mongo";

const Schema = db.Schema;

const _tokenSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        token: {
            type: String,
            required: true,
        },
        new_user_password: { // will only use these for a forgot-password request.
            type: String,
            default: "", 
        },
        confirmation_code: {
            type: String,
            default: "",
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            expires: 1200,// this is the expiry time in seconds. set to 20 mins
        },
    });

const TokenSchema = db.model("tokens", _tokenSchema);

export default TokenSchema;
