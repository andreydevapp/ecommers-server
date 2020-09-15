"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const navigation_dataAccess_1 = require("../../controller/navigation.dataAccess");
const router = express_1.Router();
router.route('/admin77/navigation')
    .get(navigation_dataAccess_1.listNavigation);
router.route('/admin77/save_navigation')
    .get(navigation_dataAccess_1.saveNavigation);
exports.default = router;
