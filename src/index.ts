import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import axios from "axios";
import { IProductDetails } from "./interfaces/IProductDetails";
import Product, { IProduct } from "./Models/Product";
import AreaSeeds, { IAreaSeeds } from "./Models/AreaSeeds";
import { IScanResults } from "./interfaces/IScanResults";
import { addWeeks, isAfter } from "date-fns";
import { parse, format } from "date-fns";

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URL = process.env.MONGO_URL || "";
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} | Env: ${NODE_ENV}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: { message: err.message } });
});

//http://localhost:4001/scan/
app.post("/scan/", async (req: Request, res: Response) => {
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
    const product = await Product.findOne({ ProductID: Number(barcode) });
    const areaData: IAreaSeeds | null = await AreaSeeds.findOne({
      Name: `${area}`,
    });
    if (!product) return checkProduct(barcode, res);
    if (!areaData)
      return res.status(400).json({
        error: `No bin information isn't available for ${area}, please try again later`,
      });
    getBinScanResult(product, areaData, res);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});

function getBinScanResult(product: IProduct, area: IAreaSeeds, res: Response) {
  for (const bin of area.Bins) {
    if (bin.BinContents.indexOf(product.Material) > -1) {
      const result: IScanResults = {
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

function getLatestDate(startDate: string, intervalWeeks: number) {
  let currentDate = new Date(startDate);
  const now = new Date();

  while (!isAfter(currentDate, now)) {
    currentDate = addWeeks(currentDate, intervalWeeks);
  }
  const initialDate = format(currentDate, "dd-MM-yyyy");
  const parsedDate = parse(initialDate, "dd-MM-yyyy", new Date());

  return format(parsedDate, "EEEE do MMMM yyyy");
}

async function checkProduct(barcode: string, res: Response) {
  const urls = [
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
    `https://world.openbeautyfacts.org/api/v2/product/${barcode}.json`,
  ];

  for (const url of urls) {
    try {
      const { data, status } = await axios.get(url);
      const response = data as IProductDetails;
      if (status === 200 && response.product) {
        await Product.create({
          ProductID: Number(barcode),
          ProductName: response.product.product_name,
          Material: response.product.packaging,
        });

        return res.status(205).json({
          error:
            "Product may not be available, please try again or scan another product",
        });
      }
    } catch (_) {
      return res.status(403).json({
        error:
          "Theres been an issue with this Product, please scan a different one",
      });
    }
  }
  return res.status(404).json({
    error: "Product isn't available, please scan a different one",
  });
}

export default app;
