"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExample = void 0;
const getExample = (req, res) => {
    res.status(200).json({ message: 'Hello world!' });
};
exports.getExample = getExample;
