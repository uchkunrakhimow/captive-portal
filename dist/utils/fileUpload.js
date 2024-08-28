"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathFile = void 0;
const node_path_1 = require("node:path");
const uuid_1 = require("uuid");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: 'src/storage/upload',
    filename: (req, file, cb) => {
        const newFileName = (0, uuid_1.v4)() + (0, node_path_1.extname)(file.originalname);
        cb(null, newFileName);
    },
});
exports.pathFile = (0, multer_1.default)({ storage });
