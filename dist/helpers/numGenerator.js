"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateNum = void 0;
const generateNum = (length) => {
    const digits = '0123456789';
    let randoms = '';
    for (let i = 0; i < length; i++) {
        randoms += digits[Math.floor(Math.random() * 10)];
    }
    return randoms;
};
exports.generateNum = generateNum;
