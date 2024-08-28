"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fileUpload_1 = require("../utils/fileUpload");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.get('/ip-list', adminController_1.ipList);
router.post('/fileUpload', fileUpload_1.pathFile.single('file'), adminController_1.fileUpload);
exports.default = router;
