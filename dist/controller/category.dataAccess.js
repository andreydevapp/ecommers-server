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
const categorias_model_1 = __importDefault(require("../models/categorias.model"));
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const enviroment_pro_1 = require("../environment/enviroment.pro");
const product_model_1 = __importDefault(require("../models/product.model"));
aws_sdk_1.default.config.update({
    secretAccessKey: enviroment_pro_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: enviroment_pro_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
function newCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("crear una nueva categoria");
        if (req.body.opc === "category") {
            const newCategory = new categorias_model_1.default({ nameCategory: req.body.nameCategory, description: req.body.description, categoryFather: "", createAt: new Date() });
            yield newCategory.save();
            const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
            res.json({ res: categories });
        }
        else {
            console.log("save subcategory");
            let category = yield categorias_model_1.default.findById(req.body.idFather);
            const newCategory = new categorias_model_1.default({ nameCategory: req.body.nameCategory, description: req.body.description, categoryFather: req.body.idFather, nameCategoryFather: category.nameCategory, createAt: new Date() });
            yield newCategory.save();
            console.log("id", req.body);
            console.log("id", req.body.idFather);
            yield categorias_model_1.default.findByIdAndUpdate(req.body.idFather, { quantitySubCategory: category.quantitySubCategory + 1 });
            const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
            const subCategories = yield categorias_model_1.default.find({ categoryFather: req.body.idFather }).sort({ createAt: -1 });
            res.json({ res: { categories, subCategories } });
        }
    });
}
exports.newCategory = newCategory;
function newCategoryWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("crear una nueva categoria", req.body);
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgCategories,
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
                        saveCategory(req, res);
                    }
                });
            });
        }
        function saveCategory(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                if (req.body.opc === "category") {
                    const newCategory = new categorias_model_1.default({ nameCategory: req.body.nameCategory, description: req.body.description, categoryFather: "", imagenUrl, keyImagenS3: imagenKey, createAt: new Date() });
                    yield newCategory.save();
                    const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
                    res.json({ res: categories });
                }
                else {
                    console.log("save subcategory", req.body.categoryFather);
                    let category = yield categorias_model_1.default.findById(req.body.categoryFather);
                    const newCategory = new categorias_model_1.default({ nameCategory: req.body.nameCategory, description: req.body.description, categoryFather: req.body.categoryFather, imagenUrl, keyImagenS3: imagenKey, nameCategoryFather: category.nameCategory, createAt: new Date() });
                    yield newCategory.save();
                    console.log("id", req.body);
                    console.log("id", req.body.categoryFather);
                    category = yield categorias_model_1.default.findById(req.body.categoryFather);
                    yield categorias_model_1.default.findByIdAndUpdate(req.body.categoryFather, { quantitySubCategory: category.quantitySubCategory + 1 });
                    const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
                    const subCategories = yield categorias_model_1.default.find({ categoryFather: req.body.categoryFather }).sort({ createAt: -1 });
                    res.json({ res: { categories, subCategories } });
                }
            });
        }
    });
}
exports.newCategoryWhitImagen = newCategoryWhitImagen;
function getListCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("get category");
        const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
        res.json({ res: categories });
    });
}
exports.getListCategories = getListCategories;
function getListSubCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("sub categorias", req.body);
        //category or subcategory
        const subCategories = yield categorias_model_1.default.find({ categoryFather: req.body.idFather }).sort({ createAt: -1 });
        res.json({ res: subCategories });
    });
}
exports.getListSubCategories = getListSubCategories;
function getListAllSubCategories(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("sub categorias");
        //category or subcategory
        const subCategories = yield categorias_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: subCategories });
    });
}
exports.getListAllSubCategories = getListAllSubCategories;
function putCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        yield categorias_model_1.default.findByIdAndUpdate(req.body._id, { nameCategory: req.body.nameCategory, description: req.body.description });
        const subCategory = yield categorias_model_1.default.findById(req.body._id);
        const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
        const subCategories = yield categorias_model_1.default.find({ categoryFather: subCategory.categoryFather }).sort({ createAt: -1 });
        res.json({ res: { categories, subCategories } });
    });
}
exports.putCategory = putCategory;
function putCategoryWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        let imagenUrl = "";
        let imagenKey = req.file.filename;
        console.log(req.body);
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgCategories,
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
                        editCategory(req, res);
                    }
                });
            });
        }
        function editCategory(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                //category or subcategory
                console.log("entre a modificar la imagen");
                const category = yield categorias_model_1.default.findById(req.body._id);
                const imagenKeyDb = category.keyImagenS3;
                yield categorias_model_1.default.findByIdAndUpdate(req.body._id, { nameCategory: req.body.nameCategory, description: req.body.description, imagenUrl, keyImagenS3: imagenKey });
                const subCategory = yield categorias_model_1.default.findById(req.body._id);
                const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
                const subCategories = yield categorias_model_1.default.find({ categoryFather: subCategory.categoryFather }).sort({ createAt: -1 });
                res.json({ res: { categories, subCategories } });
                if (imagenKeyDb !== "") {
                    console.log("Eliminar imagen");
                    deleteImagenCategory(imagenKeyDb);
                }
            });
        }
    });
}
exports.putCategoryWhitImagen = putCategoryWhitImagen;
function deleteCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log(req.body);
        //category or subcategory
        if (req.body.opc === "category") {
            console.log("entre a eliminar categoria");
            //catidades de sub categorias y productos
            const quatitySubCategory = yield categorias_model_1.default.find({ categoryFather: req.body._id }).countDocuments();
            const quatityProducts = yield product_model_1.default.find({ "categorySelected.idCategory": req.body._id }).countDocuments();
            //variables para payload
            let category = yield categorias_model_1.default.findById(req.body._id);
            const imagenKeyDb = category.keyImagenS3;
            if (quatityProducts > 0) {
                let products = yield product_model_1.default.find({ "categorySelected.idCategory": req.body._id });
                for (let product of products) {
                    console.log("elimino la imagen del producto ", product.nameProduct);
                    if (product.keyImagenS3 !== '') {
                        deleteImagenProduct(product.keyImagenS3);
                    }
                    yield product_model_1.default.findByIdAndRemove({ _id: product._id });
                }
                console.log("elimino todos los productos");
            }
            if (quatitySubCategory > 0) {
                const subCategories = yield categorias_model_1.default.find({ categoryFather: req.body._id });
                for (let subCategory of subCategories) {
                    console.log("elimino la sub categoria ", subCategory.nameCategory);
                    if (subCategory.keyImagenS3 !== '') {
                        deleteImagenCategory(subCategory.keyImagenS3);
                        yield categorias_model_1.default.findByIdAndRemove({ _id: subCategory._id });
                    }
                }
            }
            yield categorias_model_1.default.findByIdAndRemove(req.body._id);
            category = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
            res.json({ res: category });
            if (imagenKeyDb !== "") {
                console.log("Eliminar imagen");
                deleteImagenCategory(imagenKeyDb);
            }
        }
        else {
            const subCategory = yield categorias_model_1.default.findById(req.body._id);
            const imagenKeyDb = subCategory.keyImagenS3;
            const quatityProducts = yield product_model_1.default.find({ "subCategorySelected.idCategory": req.body._id }).countDocuments();
            console.log("cantidad de productos", quatityProducts);
            const category = yield categorias_model_1.default.findById(subCategory.categoryFather);
            yield categorias_model_1.default.findByIdAndUpdate(category._id, { quantitySubCategory: category.quantitySubCategory - 1 });
            if (quatityProducts > 0) {
                let products = yield product_model_1.default.find({ "subCategorySelected.idCategory": req.body._id });
                for (let product of products) {
                    console.log("elimino la imagen del producto ", product.nameProduct);
                    if (product.keyImagenS3 !== '') {
                        deleteImagenProduct(product.keyImagenS3);
                    }
                    yield product_model_1.default.findByIdAndRemove({ _id: product._id });
                }
                console.log("elimino todos los productos");
            }
            yield categorias_model_1.default.findByIdAndDelete(req.body._id);
            const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
            const subCategories = yield categorias_model_1.default.find({ categoryFather: subCategory.categoryFather }).sort({ createAt: -1 });
            res.json({ res: { categories, subCategories } });
            if (imagenKeyDb !== "") {
                console.log("Eliminar imagen");
                deleteImagenCategory(imagenKeyDb);
            }
        }
    });
}
exports.deleteCategory = deleteCategory;
function deleteImagenCategory(imagenKey) {
    return __awaiter(this, void 0, void 0, function* () {
        var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgCategories, Key: imagenKey };
        s3.deleteObject(params, function (err, data) {
            if (err)
                console.log(err, err.stack); // error
            else
                console.log(data); // deleted
        });
    });
}
function deleteImagenProduct(imagenKeyDb) {
    var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct, Key: imagenKeyDb };
    s3.deleteObject(params, function (err, data) {
        if (err)
            console.log(err, err.stack); // error
        else
            console.log(data); // deleted
    });
}
