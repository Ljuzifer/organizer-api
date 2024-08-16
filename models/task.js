const { Schema, model } = require("mongoose");
const { MongooseError } = require("../helpers");
const LocaleDate = require("../helpers/LocaleDate");

const taskSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
            default: () => LocaleDate(),
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

taskSchema.post("save", MongooseError);

const Task = model("task", taskSchema);

module.exports = Task;
