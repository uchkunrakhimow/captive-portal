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
const express_winston_1 = require("express-winston");
const winston_1 = __importDefault(require("winston"));
//@ts-ignore
const node_unifi_1 = __importDefault(require("node-unifi"));
const node_path_1 = require("node:path");
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("mongoose");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const MONGO_URL = process.env.MONGO_URL;
const clientDistDir = (0, node_path_1.join)(__dirname, '..', 'client', 'dist');
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
app.set('trust proxy', true);
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use((0, express_winston_1.logger)({
    transports: [new winston_1.default.transports.File({ filename: './logs/logs.log' })],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json(), winston_1.default.format.prettyPrint()),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
    colorize: false,
}));
app.use((0, express_1.static)(clientDistDir));
app.use('/auth', (req, res, next) => {
    req.unifi = controller;
    next();
}, auth_route_1.default);
app.use('/', (req, res) => {
    res.sendFile((0, node_path_1.join)(__dirname, '..', 'client', 'dist', 'index.html'));
});
// Start server
const startServer = async () => {
    try {
        await (0, mongoose_1.connect)(MONGO_URL);
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
    }
    catch (error) {
        console.error('Failed to start server:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};
startServer();
