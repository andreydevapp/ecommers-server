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
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const enviroment_pro_1 = require("../environment/enviroment.pro");
const product_model_1 = __importDefault(require("../models/product.model"));
const categorias_model_1 = __importDefault(require("../models/categorias.model"));
const sizesProducts_model_1 = __importDefault(require("../models/sizesProducts.model"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const ocasion_model_1 = __importDefault(require("../models/ocasion.model"));
aws_sdk_1.default.config.update({
    secretAccessKey: enviroment_pro_1.amazonWs3.ws3SecretAccessKey,
    accessKeyId: enviroment_pro_1.amazonWs3.ws3AccessKeyId,
    region: "us-west-1"
});
const s3 = new aws_sdk_1.default.S3();
function saveTypeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        let payload = req.body.payload;
        if (payload.subCategorySelected.nameCategory === "") {
            // se aumenta a categorias.
            const category = yield categorias_model_1.default.findById(payload.categorySelected.idCategory);
            yield categorias_model_1.default.findByIdAndUpdate(payload.categorySelected.idCategory, { quantityProducts: category.quantityProducts + 1 });
        }
        else {
            // se aumenta a sub categorias
            const category = yield categorias_model_1.default.findById(payload.subCategorySelected.idCategory);
            yield categorias_model_1.default.findByIdAndUpdate(payload.subCategorySelected.idCategory, { quantityProducts: category.quantityProducts + 1 });
        }
        payload.createAt = new Date();
        const newTypeProduct = new product_model_1.default(payload);
        yield newTypeProduct.save();
        res.json({ res: newTypeProduct });
    });
}
exports.saveTypeProduct = saveTypeProduct;
function putTypeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        yield product_model_1.default.findByIdAndUpdate(req.body._id, req.body.payload);
        res.json({ res: "saved" });
    });
}
exports.putTypeProduct = putTypeProduct;
function deleteTypeProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const product = yield product_model_1.default.findById(req.body._id);
        //aumentar cate
        if (product.subCategorySelected.nameCategory === "") {
            // se aumenta a categorias.
            const category = yield categorias_model_1.default.findById(product.categorySelected.idCategory);
            yield categorias_model_1.default.findByIdAndUpdate(product.categorySelected.idCategory, { quantityProducts: category.quantityProducts - 1 });
        }
        else {
            // se aumenta a sub categorias
            const category = yield categorias_model_1.default.findById(product.subCategorySelected.idCategory);
            yield categorias_model_1.default.findByIdAndUpdate(product.subCategorySelected.idCategory, { quantityProducts: category.quantityProducts - 1 });
        }
        for (let detail of product.products) {
            deleteImagen(detail.images.mainImagen.keyImagenS3);
            for (let item of detail.images.secundaryImages) {
                deleteImagen(item.keyImagenS3);
            }
        }
        yield product_model_1.default.findByIdAndDelete(req.body._id);
        const products = yield product_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: products });
        function deleteImagen(imagenKeyDb) {
            var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct, Key: imagenKeyDb };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    console.log(err, err.stack); // error
                else
                    console.log(data); // deleted
            });
        }
    });
}
exports.deleteTypeProduct = deleteTypeProduct;
function newProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("body", req.body);
        const imagenes = req.files;
        console.log("imagenes", imagenes);
        const mainImagen = imagenes.imagen[0];
        const imagesSecundary = imagenes.images;
        console.log("imagen principal", mainImagen);
        console.log("cantidad de imagenes", imagesSecundary);
        let payload = JSON.parse(req.body.payload);
        payload.createAt = new Date();
        let contImagen = 0;
        //subir main imagen}
        const fileContent = yield fs_1.default.readFileSync(mainImagen.path);
        const params = {
            Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct,
            Key: mainImagen.filename,
            Body: fileContent,
            ACL: 'public-read'
        };
        s3.upload(params, function (err, data) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log("me cai subiendo la imagen");
                    throw err;
                }
                else {
                    payload.images.mainImagen.imagenUrl = data.Location;
                    payload.images.mainImagen.keyImagenS3 = mainImagen.filename;
                    uploadImages();
                }
            });
        });
        function uploadImages() {
            return __awaiter(this, void 0, void 0, function* () {
                if (imagesSecundary.length) {
                    for (const imagen of imagesSecundary) {
                        const fileContent = yield fs_1.default.readFileSync(imagen.path);
                        const params = {
                            Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct,
                            Key: imagen.filename,
                            Body: fileContent,
                            ACL: 'public-read'
                        };
                        s3.upload(params, function (err, data) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (err) {
                                    console.log("me cai subiendo la imagen");
                                    throw err;
                                }
                                else {
                                    console.log("archivo subido");
                                    payload.images.secundaryImages.push({ imagenUrl: data.Location, keyImagenS3: imagen.filename });
                                    contImagen++;
                                    if (contImagen === imagesSecundary.length) {
                                        final();
                                    }
                                }
                            });
                        });
                    }
                }
                else {
                    final();
                }
            });
        }
        function final() {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("cantidad de archivos subidos: ", contImagen);
                console.log("payload", payload);
                console.log("id", req.body._id);
                yield product_model_1.default.findByIdAndUpdate(req.body._id, {
                    $push: {
                        products: {
                            $each: [payload]
                        }
                    }
                });
                const product = yield product_model_1.default.aggregate([
                    { $match: { nameProduct: req.body.nameProduct } },
                    { $unwind: '$products' },
                    { $sort: { 'products.createAt': -1 } },
                    { $group: { _id: '$_id', products: { $push: '$products' } } }
                ]);
                res.json({ res: product[0].products });
                yield fs_1.default.unlinkSync(mainImagen.path);
                for (let imagen of imagesSecundary) {
                    yield fs_1.default.unlinkSync(imagen.path);
                }
            });
        }
    });
}
exports.newProduct = newProduct;
function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        const products = yield product_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: products });
    });
}
exports.getProducts = getProducts;
function getProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("obtener producto", req.body._id);
        const product = yield product_model_1.default.findById(req.body._id);
        res.json({ res: product });
    });
}
exports.getProduct = getProduct;
function getProductsStoreCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("url", req.body);
        const products = yield product_model_1.default.find({ "categorySelected.idCategory": req.body._id }).sort({ price: req.body.filterPrice });
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        const ocacions = yield ocasion_model_1.default.find().sort({ createAt: -1 });
        const categories = yield categorias_model_1.default.find({ categoryFather: "" }).sort({ createAt: -1 });
        res.json({ res: { products, brands, sizes, ocacions, categories } });
    });
}
exports.getProductsStoreCategory = getProductsStoreCategory;
function getProductsStoreSubCategory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("url", req.body);
        const find = "brand.brandIs:5ebcab5561878e35e0fda12e";
        const prueba = yield product_model_1.default.find({ find });
        console.log("prueba", prueba);
        const products = yield product_model_1.default.find({ url: req.body.url }).sort({ createAt: -1 });
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        const ocacions = yield ocasion_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: { products, brands, sizes, ocacions } });
    });
}
exports.getProductsStoreSubCategory = getProductsStoreSubCategory;
function filterProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("url", req.body);
        let products;
        if (req.body.priceMin !== undefined || req.body.priceMax !== undefined) {
            products = yield product_model_1.default.find({
                "price": { $gte: parseInt(req.body.priceMin), $lte: parseInt(req.body.priceMax) },
                "brand.idBrand": req.body.filterBrand,
                "typeOcasion.idType": req.body.filterOcasion,
                "products": {
                    $elemMatch: {
                        "size.sizes": {
                            $elemMatch: { "size": { "$in": req.body.filterSizes } }
                        },
                        "color": { "$in": req.body.filterColor }
                    }
                }
            });
            //.sort({price: req.body.filterPrice});
        }
        else {
            products = yield product_model_1.default.find({
                "brand.idBrand": req.body.filterBrand,
                "typeOcasion.idType": req.body.filterOcasion,
                "products": {
                    $elemMatch: {
                        "size.sizes": {
                            $elemMatch: { "size": { "$in": req.body.filterSizes } }
                        },
                        "color": { "$in": req.body.filterColor }
                    }
                }
            })
                .sort({ price: req.body.filterPrice });
        }
        console.log("apply filter", products);
        const brands = yield brand_model_1.default.find().sort({ createAt: -1 });
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        const ocacions = yield ocasion_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: { products, brands, sizes, ocacions } });
    });
}
exports.filterProduct = filterProduct;
function getProductUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("url", req.body);
        const products = yield product_model_1.default.find({ url: req.body.url }).sort({ createAt: -1 });
        res.json({ res: products });
    });
}
exports.getProductUrl = getProductUrl;
function putProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log(req.body);
        let payload = req.body.payload;
        if (payload.description === '') {
            payload.description = "Este producto no cuenta con una descripción";
        }
        yield product_model_1.default.findByIdAndUpdate(req.body._id, payload);
        const products = yield product_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: products });
    });
}
exports.putProduct = putProduct;
function putProductWhitImagen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        let payload = JSON.parse(req.body.payload);
        payload.keyImagenS3 = req.file.filename;
        if (payload.description === '') {
            payload.description = "Este producto no cuenta con una descripción";
        }
        //subir imagen
        uploadImg(req, res);
        function uploadImg(req, res) {
            const fileContent = fs_1.default.readFileSync(req.file.path);
            // Setting up S3 upload parameters
            const params = {
                Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct,
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
                        payload.imagenUrl = data.Location;
                        console.log(payload);
                        saveProduct(req, res);
                    }
                });
            });
        }
        function saveProduct(req, res) {
            return __awaiter(this, void 0, void 0, function* () {
                const category = yield product_model_1.default.findById(req.body._id);
                const imagenKeyDb = category.keyImagenS3;
                yield product_model_1.default.findByIdAndUpdate(req.body._id, payload);
                const products = yield product_model_1.default.find().sort({ createAt: -1 });
                res.json({ res: products });
                yield fs_1.default.unlinkSync(req.file.path);
                if (imagenKeyDb !== "") {
                    console.log("Eliminar imagen");
                    deleteImagen(imagenKeyDb);
                }
            });
        }
        //uploadImg(req,res);
        function deleteImagen(imagenKeyDb) {
            var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct, Key: imagenKeyDb };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    console.log(err, err.stack); // error
                else
                    console.log(data); // deleted
            });
        }
    });
}
exports.putProductWhitImagen = putProductWhitImagen;
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log(req.body);
        const product = yield product_model_1.default.findById(req.body._id);
        //elimino las fotos
        for (let detail of product.products) {
            console.log("product", detail);
            console.log("id product", detail._id);
            if (detail.id === req.body.idDetail) {
                console.log("lo encontre");
                deleteImagen(detail.images.mainImagen.keyImagenS3);
                for (let item of detail.images.secundaryImages) {
                    deleteImagen(item.keyImagenS3);
                }
                break;
            }
        }
        // elimino el detalle del producto
        yield product_model_1.default.findByIdAndUpdate(req.body._id, { $pull: { "products": { _id: req.body.idDetail } } });
        if (product.products.length === 1) {
            res.json({ res: [] });
        }
        else {
            //devuelvo los detalles del producto
            const products = yield product_model_1.default.aggregate([
                { $match: { nameProduct: req.body.nameProduct } },
                { $unwind: '$products' },
                { $sort: { 'products.createAt': -1 } },
                { $group: { _id: '$_id', products: { $push: '$products' } } }
            ]);
            res.json({ res: products[0].products });
        }
        function deleteImagen(imagenKeyDb) {
            var params = { Bucket: enviroment_pro_1.amazonWs3.bucketImgProduct, Key: imagenKeyDb };
            s3.deleteObject(params, function (err, data) {
                if (err)
                    console.log(err, err.stack); // error
                else
                    console.log(data); // deleted
            });
        }
    });
}
exports.deleteProduct = deleteProduct;
function prueba(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("obtener producto", req.body._id);
        const product = yield product_model_1.default.aggregate([
            { $unwind: '$products' },
            { $sort: { 'products.createAt': -1 } },
            { $group: { _id: '$nameProduct', brand: { $push: "$brand" }, typeOcasion: { $push: "$typeOcasion" }, products: { $push: '$products' } } }
        ]);
        res.json({ product });
    });
}
exports.prueba = prueba;
