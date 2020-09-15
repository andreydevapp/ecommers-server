"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../controller/authentication");
const router = express_1.Router();
router.route('/storage/user/authentication')
    .post(authentication_1.registerStoreUser);
exports.default = router;
