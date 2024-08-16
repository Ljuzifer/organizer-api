const { Schema, model } = require("mongoose");
const { MongooseError } = require("../helpers");
// const path = require("path");

// const defaultAvatar = path.join(__dirname, "../public/default-avatar.jpg");
// const gravatar = require("gravatar");
// const crypto = require("crypto");

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Set name for contact"],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        avatarURL: {
            type: String,
            required: true,
            // default: defaultAvatar,
            // default: function () {
            //     const trimmedName = this.name.trim().toLowerCase();
            //     // const hash = crypto
            //     //     .createHash("sha256")
            //     //     .update(trimmedName)
            //     //     .digest("hex");
            //     return gravatar.url(trimmedName, { s: "100" }, true);
            //     // return `https://www.gravatar.com/avatar/${hash}?s=100&d=identicon`;
            // },
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post("save", MongooseError);

const Contact = model("contact", contactSchema);

module.exports = Contact;
