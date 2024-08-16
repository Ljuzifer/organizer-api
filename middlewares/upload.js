const multer = require("multer");
const path = require("path");
// const { HttpError } = require("../helpers");

const tempPath = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
    destination: tempPath,
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    // fileFilter: (req, file, cb) => {
    //     console.log(file);
    //     if (file.fieldname !== "avatar") {
    //         throw HttpError(400, `Fieldname must be named 'avatar'`);
    //     }
    // },
    storage: multerConfig,
});

module.exports = upload;
