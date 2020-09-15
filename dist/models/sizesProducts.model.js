"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sizesSchema = new mongoose_1.Schema({
    typeProduct: { type: String, required: true },
    description: { type: String, required: true },
    sizes: { type: [{
                size: { type: String, required: true },
                createAt: { type: Date, required: true }
            }] },
    createAt: { type: Date, required: true }
});
exports.default = mongoose_1.model('SIZES_PRODUCTS', sizesSchema);
