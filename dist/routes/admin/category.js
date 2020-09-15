"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_dataAccess_1 = require("../../controller/category.dataAccess");
const multerImagen_1 = __importDefault(require("../../services/multerImagen"));
const router = express_1.Router();
router.route('/admin77/newCategory')
    .post(category_dataAccess_1.newCategory);
router.route('/admin77/newCategoryWhitImagen')
    .post(multerImagen_1.default.single("imagen"), category_dataAccess_1.newCategoryWhitImagen);
router.route('/admin77/getListCategories')
    .get(category_dataAccess_1.getListCategories);
router.route('/admin77/getListSubCategories')
    .post(category_dataAccess_1.getListSubCategories);
router.route('/admin77/getListAllSubCategories')
    .post(category_dataAccess_1.getListAllSubCategories);
router.route('/admin77/putCategory')
    .post(category_dataAccess_1.putCategory);
router.route('/admin77/putCategoryWhitImagen')
    .post(multerImagen_1.default.single("imagen"), category_dataAccess_1.putCategoryWhitImagen);
router.route('/admin77/deleteCategory')
    .post(category_dataAccess_1.deleteCategory);
exports.default = router;
