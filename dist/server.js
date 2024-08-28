"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const express_winston_1 = __importDefault(require("express-winston"));
const winston_1 = __importDefault(require("winston"));
//@ts-ignore
const node_unifi_1 = __importDefault(require("node-unifi"));
const node_path_1 = require("node:path");
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("./routes/api"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const storageDir = (0, node_path_1.join)(__dirname, 'storage');
const distDir = (0, node_path_1.join)(__dirname, '..', 'client', 'dist');
const uploadsDir = (0, node_path_1.join)(__dirname, 'storage', 'upload');
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [new winston_1.default.transports.Console()],
});
const controller = new node_unifi_1.default.Controller({
    host: process.env.UNIFI_HOST,
    port: process.env.UNIFI_PORT,
    username: process.env.UNIFI_USERNAME,
    password: process.env.UNIFI_PASSWD,
    sslverify: false,
});
// Connect to the UniFi controller
controller
    .login()
    .then(() => {
    console.log('Unifi connected successfully!');
})
    .catch((error) => {
    console.error('Error:', error);
});
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use(express_winston_1.default.logger({
    transports: [new winston_1.default.transports.Console()],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json(), winston_1.default.format.prettyPrint()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
        return false;
    },
}));
app.use('/storage', express_1.default.static(storageDir));
app.use('/uploads', express_1.default.static(uploadsDir));
app.use(express_1.default.static(distDir));
app.use('/api', api_1.default);
app.use('/auth', (req, res, next) => {
    //@ts-ignore
    req.unifi = controller;
    next();
}, auth_1.default);
app.use('/admin', admin_1.default);
app.use('/', (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, '..', 'client', 'dist', 'index.html'));
});
app.use(express_winston_1.default.errorLogger({ winstonInstance: logger }));
app.listen(PORT, () => {
    console.clear();
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
