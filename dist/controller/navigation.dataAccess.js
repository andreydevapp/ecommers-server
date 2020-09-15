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
const navigation_model_1 = __importDefault(require("../models/navigation.model"));
function listNavigation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("new brand", req.body);
        const navigation = yield navigation_model_1.default.find();
        res.json({ res: navigation });
    });
}
exports.listNavigation = listNavigation;
function saveNavigation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
        console.log("new brand", req.body);
        const payloadHome = {
            urlFather: {
                name: "Inicio",
                url: "sin url",
                icon: "fas fa-home",
                active: true
            },
            urls: []
        };
        const payloadIventory = {
            urlFather: {
                name: "Inventario",
                url: "sin url",
                icon: "fas fa-boxes",
                active: true
            },
            urls: [
                {
                    name: "Categorias",
                    url: "/admin77/manage_categories",
                    icon: "fas fa-folder",
                    active: true
                },
                {
                    name: "Sub Categorias",
                    url: "/admin77/manage_sub_categories",
                    icon: "fas fa-folder",
                    active: true
                },
                {
                    name: "Productos",
                    url: "/admin77/manage_products",
                    icon: "fas fa-tshirt",
                    active: true
                },
                {
                    name: "Marcas",
                    url: "/admin77/manage_brands",
                    icon: "fas fa-stamp",
                    active: true
                },
                {
                    name: "Tallas",
                    url: "/admin77/manage_sizes",
                    icon: "fas fa-ruler-horizontal",
                    active: true
                },
                {
                    name: "Tipo de ocación",
                    url: "/admin77/manage_type_ocasion",
                    icon: "fas fa-umbrella-beach",
                    active: true
                }
            ]
        };
        const home = new navigation_model_1.default(payloadHome);
        yield home.save();
        const navigation = new navigation_model_1.default(payloadIventory);
        yield navigation.save();
        res.json({ res: "navigation saved" });
    });
}
exports.saveNavigation = saveNavigation;
