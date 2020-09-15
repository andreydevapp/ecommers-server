"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const brand_model_1 = __importDefault(require("../models/brand.model"));
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const enviroment_pro_1 = require("../environment/enviroment.pro");
aws_sdk_1.default.config.update({
    secretAccessKey: enviroment_pro_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: enviroment_pro_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
function newBrand(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("new brand", req.body);
        const newBrand = new brand_model_1.default({ nameBrand: req.body.nameBrand, description: req.body.description, createAt: new Date() });
        yield newBrand.save();
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: brands });
    });
}
exports.newBrand = newBrand;
function newBrandWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("new brand");
        console.log("new brand", req.body);
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgBrands,
                Key: req.file.filename,
                Body: fileContent,
                ACL: 'public-read'
            };
            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("me cai subiendo la imagen");
                        throw err;
                    }
                    else {
                        console.log("archivo subido");
                        imagenUrl = data.Location;
                        yield fs_1.default.unlinkSync(req.file.path);
                        saveBrand(req, res);
                    }
                });
            });
        }
        function saveBrand(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const newBrand = new brand_model_1.default({ nameBrand: req.body.nameBrand, description: req.body.description, imagenUrl, keyImagenS3: imagenKey, createAt: new Date() });
                yield newBrand.save();
                const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
                res.json({ res: brands });
            });
        }
    });
}
exports.newBrandWhitImagen = newBrandWhitImagen;
function getListBrand(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: brands });
    });
}
exports.getListBrand = getListBrand;
function putBrand(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        yield brand_model_1.default.findByIdAndUpdate(req.body._id, { nameBrand: req.body.nameBrand, description: req.body.description });
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: brands });
    });
}
exports.putBrand = putBrand;
function putBrandWithImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgBrands,
                Key: req.file.filename,
                Body: fileContent,
                ACL: 'public-read'
            };
            // Uploading files to the bucket
            s3.upload(params, function (err, data) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("me cai subiendo la imagen");
                        throw err;
                    }
                    else {
                        console.log("archivo subido");
                        imagenUrl = data.Location;
                        yield fs_1.default.unlinkSync(req.file.path);
                        updateBrand(req, res);
                    }
                });
            });
        }
        function updateBrand(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const brand = yield brand_model_1.default.findById(req.body._id);
                const imagenKeyDb = brand.keyImagenS3;
                yield brand_model_1.default.findByIdAndUpdate(req.body._id, { nameBrand: req.body.nameBrand, description: req.body.description, imagenUrl, keyImagenS3: imagenKey });
                const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
                res.json({ res: brands });
                if (imagenKeyDb !== "") {
                    console.log("Eliminar imagen");
                    deleteImagenCategory(imagenKeyDb);
                }
            });
        }
    });
}
exports.putBrandWithImagen = putBrandWithImagen;
function deleteBrand(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        let category = yield brand_model_1.default.findById(req.body._id);
        const imagenKeyDb = category.keyImagenS3;
        yield brand_model_1.default.findByIdAndRemove(req.body._id);
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: brands });
        if (imagenKeyDb !== "") {
            console.log("Eliminar imagen");
            deleteImagenCategory(imagenKeyDb);
        }
    });
}
exports.deleteBrand = deleteBrand;
function deleteImagenCategory(imagenKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgBrands, Key: imagenKey };
        s3.deleteObject(params, function (err, data) {
            if (err)
                console.log(err, err.stack); // error
            else
                console.log(data); // deleted
        });
    });
}
