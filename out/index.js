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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const Product_1 = __importDefault(require("./Models/Product"));
const AreaSeeds_1 = __importDefault(require("./Models/AreaSeeds"));
const date_fns_1 = require("date-fns");
const date_fns_2 = require("date-fns");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URL = process.env.MONGO_URL || "";
app.use(express_1.default.json());
mongoose_1.default
    .connect(MONGO_URL)
    .then(() => {
    console.log("✅ Connected to MongoDB");
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("tiny"));
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} | Env: ${NODE_ENV}`);
    });
})
    .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: { message: err.message } });
});
app.post("/scan/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body) {
        return res
            .status(400)
            .json({ error: "Something is wrong with the request, please try again" });
    }
    const { area, barcode } = req.body;
    if (!area || !barcode) {
        return res
            .status(404)
            .json({ error: "Invalid request made, please check URL" });
    }
    try {
        const product = yield Product_1.default.findOne({ ProductID: Number(barcode) });
        const areaData = yield AreaSeeds_1.default.findOne({
            Name: `${area}`,
        });
        if (!product)
            return checkProduct(barcode, res);
        if (!areaData)
            return res.status(400).json({
                error: `No bin information isn't available for ${area}, please try again later`,
            });
        getBinScanResult(product, areaData, res);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
}));
function getBinScanResult(product, area, res) {
    for (const bin of area.Bins) {
        if (bin.BinContents.indexOf(product.Material) > -1) {
            const result = {
                Area: area.Name,
                ProductName: product.ProductName,
                BinName: bin.BinName,
                BinDate: getLatestDate(bin.BinNextDate, bin.BinOccurrence),
                Occurrence: bin.BinOccurrence,
            };
            return res.status(200).json(result);
        }
    }
    return res.status(204).json({
        error: `Unable to find a bin for ${product.ProductName} in ${area.Name}`,
    });
}
function getLatestDate(startDate, intervalWeeks) {
    let currentDate = new Date(startDate);
    const now = new Date();
    while (!(0, date_fns_1.isAfter)(currentDate, now)) {
        currentDate = (0, date_fns_1.addWeeks)(currentDate, intervalWeeks);
    }
    const initialDate = (0, date_fns_2.format)(currentDate, "dd-MM-yyyy");
    const parsedDate = (0, date_fns_2.parse)(initialDate, "dd-MM-yyyy", new Date());
    return (0, date_fns_2.format)(parsedDate, "EEEE do MMMM yyyy");
}
function checkProduct(barcode, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const urls = [
            `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
            `https://world.openbeautyfacts.org/api/v2/product/${barcode}.json`,
        ];
        for (const url of urls) {
            try {
                const { data, status } = yield axios_1.default.get(url);
                const response = data;
                if (status === 200 && response.product) {
                    yield Product_1.default.create({
                        ProductID: Number(barcode),
                        ProductName: response.product.product_name,
                        Material: response.product.packaging,
                    });
                    return res.status(205).json({
                        error: "Product may not be available, please try again or scan another product",
                    });
                }
            }
            catch (_) {
                return res.status(403).json({
                    error: "Theres been an issue with this Product, please scan a different one",
                });
            }
        }
        return res.status(404).json({
            error: "Product isn't available, please scan a different one",
        });
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map