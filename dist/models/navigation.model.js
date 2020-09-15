"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const navigationSchema = new mongoose_1.Schema({
    //información personal
    urlFather: { type: {
            name: { type: String, required: true },
            url: { type: String, required: true },
            icon: { type: String, required: true },
            active: { type: Boolean, required: true }
        } },
    urls: { type: [
            {
                name: { type: String, required: false },
                url: { type: String, required: false },
                icon: { type: String, required: false },
                active: { type: Boolean, required: false }
            }
        ] }
});
exports.default = mongoose_1.model('navigation', navigationSchema);
