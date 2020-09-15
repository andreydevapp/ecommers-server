"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brand_dataAccess_1 = require("../../controller/brand.dataAccess");
const multerImagen_1 = __importDefault(require("../../services/multerImagen"));
const router = express_1.Router();
router.route('/admin77/newBrand')
    .post(brand_dataAccess_1.newBrand);
router.route('/admin77/newBrandWhitImagen')
    .post(multerImagen_1.default.single("imagen"), brand_dataAccess_1.newBrandWhitImagen);
router.route('/admin77/getListBrand')
    .get(brand_dataAccess_1.getListBrand);
router.route('/admin77/putBrand')
    .post(brand_dataAccess_1.putBrand);
router.route('/admin77/putBrandWhithImagen')
    .post(multerImagen_1.default.single("imagen"), brand_dataAccess_1.putBrandWithImagen);
router.route('/admin77/deleteBrand')
    .post(brand_dataAccess_1.deleteBrand);
exports.default = router;
