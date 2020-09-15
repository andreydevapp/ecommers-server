"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productsSchema = new mongoose_1.Schema({
    //información personal
    nameProduct: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    discount: { type: Number, required: true, default: 0 },
    code: { type: String, required: true },
    taxes: { type: String, required: true, default: 0.13 },
    url: { type: String, required: true },
    categorySelected: { type: {
            nameCategory: { type: String, required: false, default: "" },
            idCategory: { type: String, required: false, default: "" }
        }, required: true },
    subCategorySelected: { type: {
            nameCategory: { type: String, required: false, default: "" },
            idCategory: { type: String, required: false, default: "" }
        }, required: false },
    brand: { type: {
            idBrand: { type: String, required: true },
            brand: { type: String, required: true }
        } },
    typeOcasion: {
        idType: { type: String, required: false, default: "null" },
        type: { type: String, required: false, default: "null" },
    },
    products: { type: [{
                images: { type: {
                        mainImagen: {
                            imagenUrl: { type: String, required: true },
                            keyImagenS3: { type: String, required: true }
                        },
                        secundaryImages: [{
                                imagenUrl: { type: String, required: true },
                                keyImagenS3: { type: String, required: true }
                            }]
                    } },
                size: { type: {
                        idTypeProduct: { type: String, required: true },
                        typeProduct: { type: String, required: true },
                        sizes: { type: [
                                {
                                    size: { type: String, required: true },
                                    description: { type: String, required: true }
                                }
                            ] }
                    } },
                quantityInStock: { type: Number, required: true, default: 0 },
                color: { type: String, required: true },
                createAt: { type: Date, required: true }
            }], required: false },
    createAt: { type: Date, required: true }
});
exports.default = mongoose_1.model('PRODUCTS', productsSchema);
