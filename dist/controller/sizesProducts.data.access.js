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
const sizesProducts_model_1 = __importDefault(require("../models/sizesProducts.model"));
//nameProduct, opc
function newSize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("crear una nueva talla", req.body);
        const payloadSizes = [];
        for (let s of req.body.sizes) {
            const payload = {
                size: s.size,
                createAt: new Date()
            };
            payloadSizes.push(payload);
        }
        console.log(payloadSizes);
        const newSize = new sizesProducts_model_1.default({ typeProduct: req.body.typeProduct, description: req.body.description, sizes: payloadSizes, createAt: new Date() });
        yield newSize.save();
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: sizes });
        if (req.body.opc === "newType") {
        }
        else {
            console.log(req.body);
            const size = yield sizesProducts_model_1.default.findById(req.body._id);
            yield sizesProducts_model_1.default.findByIdAndUpdate(req.body._id, { quatitySizes: size.quatitySizes + 1, $push: { sizes: { size: req.body.size, description: req.body.description, createAt: new Date() } } });
            const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
            res.json({ res: sizes });
        }
    });
}
exports.newSize = newSize;
function getSizes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("crear una nueva categoria");
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: sizes });
    });
}
exports.getSizes = getSizes;
function getSize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("editar las categoria");
        const sizes = yield sizesProducts_model_1.default.findById(req.body._id).sort({ createAt: -1 });
        res.json({ res: sizes });
    });
}
exports.getSize = getSize;
function putSize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("editar categoria", req.body);
        console.log("sizes", req.body.sizes);
        const payloadSizes = [];
        for (let s of req.body.sizes) {
            const payload = {
                size: s.size,
                createAt: new Date()
            };
            payloadSizes.push(payload);
        }
        console.log(payloadSizes);
        yield sizesProducts_model_1.default.findByIdAndUpdate(req.body._id, { typeProduct: req.body.typeProduct, description: req.body.description, sizes: payloadSizes });
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: sizes });
    });
}
exports.putSize = putSize;
function deleteSize(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        //category or subcategory
        console.log("crear una nueva categoria");
        yield sizesProducts_model_1.default.findOneAndDelete(req.body._id);
        const sizes = yield sizesProducts_model_1.default.find().sort({ createAt: -1 });
        res.json({ res: sizes });
    });
}
exports.deleteSize = deleteSize;
