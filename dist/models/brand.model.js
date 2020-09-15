"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const brandsSchema = new mongoose_1.Schema({
    nameBrand: { type: String, required: true },
    description: { type: String, required: false },
    imagenUrl: { type: String, required: false, default: "" },
    keyImagenS3: { type: String, required: false, default: "" },
    createAt: { type: Date, required: true }
});
exports.default = mongoose_1.model('BRANDS', brandsSchema);
