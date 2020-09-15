"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ocasionSchema = new mongoose_1.Schema({
    //información personal
    type: { type: String, required: true },
    description: { type: String, required: true },
    imagenUrl: { type: String, required: true, default: "" },
    keyImagenS3: { type: String, required: true, default: "" },
    active: { type: Boolean, required: false, default: true },
    createAt: { type: Date, required: true }
});
exports.default = mongoose_1.model('ocasion', ocasionSchema);
