"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sizesProducts_data_access_1 = require("../../controller/sizesProducts.data.access");
const router = express_1.Router();
router.route('/admin77/newSize')
    .post(sizesProducts_data_access_1.newSize);
router.route('/admin77/getListSize')
    .get(sizesProducts_data_access_1.getSizes);
router.route('/admin77/getSize')
    .post(sizesProducts_data_access_1.getSize);
router.route('/admin77/putSize')
    .post(sizesProducts_data_access_1.putSize);
router.route('/admin77/deleteSize')
    .post(sizesProducts_data_access_1.deleteSize);
exports.default = router;
