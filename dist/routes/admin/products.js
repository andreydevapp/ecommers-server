"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_dataAcces_1 = require("./../../controller/products.dataAcces");
const multerImagen_1 = __importDefault(require("../../services/multerImagen"));
const router = express_1.Router();
router.route('/admin77/saveTypeProduct')
    .post(products_dataAcces_1.saveTypeProduct);
router.route('/admin77/putTypeProduct')
    .post(products_dataAcces_1.putTypeProduct);
router.route('/admin77/deleteTypeProduct')
    .post(products_dataAcces_1.deleteTypeProduct);
router.route('/admin77/newProduct')
    .post(multerImagen_1.default.fields([{ name: "imagen" }, { name: "images" }]), products_dataAcces_1.newProduct);
router.route('/admin77/getListProducts')
    .get(products_dataAcces_1.getProducts);
router.route('/admin77/getProduct')
    .post(products_dataAcces_1.getProduct);
router.route('/admin77/getProductsStoreCategory')
    .post(products_dataAcces_1.getProductsStoreCategory);
router.route('/admin77/getUrlProducts')
    .post(products_dataAcces_1.getProductUrl);
router.route('/admin77/filterProducts')
    .post(products_dataAcces_1.filterProduct);
router.route('/admin77/putProductWhitImagen')
    .post(multerImagen_1.default.single("imagen"), products_dataAcces_1.putProductWhitImagen);
router.route('/admin77/putProduct')
    .post(products_dataAcces_1.putProduct);
router.route('/admin77/deleteProduct')
    .post(products_dataAcces_1.deleteProduct);
router.route('/admin77/pruebaProduct')
    .post(products_dataAcces_1.prueba);
exports.default = router;
