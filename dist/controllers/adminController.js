"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipList = exports.fileUpload = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const STORAGE_DIRECTORY = node_path_1.default.join(__dirname, '../storage');
const fileUpload = (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        res.status(200).send(req.file.filename);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.fileUpload = fileUpload;
const ipList = async (req, res) => {
    try {
        const files = await promises_1.default.readdir(STORAGE_DIRECTORY);
        const csvFiles = files
            .filter(file => file.endsWith('.csv'))
            .map(file => ({
            name: file,
            url: `/files/${file}`,
        }));
        if (csvFiles.length === 0) {
            res.status(200).send('No CSV files found');
        }
        else {
            res.json(csvFiles);
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.ipList = ipList;
