"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multerImagen_1 = __importDefault(require("../../services/multerImagen"));
const ocasion_data_acces_1 = require("../../controller/ocasion.data.acces");
const router = express_1.Router();
router.route('/admin77/newOcasion')
    .post(multerImagen_1.default.single("imagen"), ocasion_data_acces_1.newOcasionWhitImagen);
router.route('/admin77/getOcasion')
    .get(ocasion_data_acces_1.getOcasions);
router.route('/admin77/putOcasion')
    .post(ocasion_data_acces_1.putOcasion);
router.route('/admin77/putOcasionWhitImagen')
    .post(multerImagen_1.default.single("imagen"), ocasion_data_acces_1.putOcasionWhitImagen);
router.route('/admin77/deleteOcasion')
    .post(ocasion_data_acces_1.deleteOcasion);
exports.default = router;
