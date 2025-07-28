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
import { addWeeks, isAfter, format } from "date-fns";

dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URL = process.env.MONGO_URL || "";

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: { message: err.message } });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} | Env: ${NODE_ENV}`);
});

//http://localhost:4001/scan/
app.post("/scan/", async (req: Request, res: Response) => {
  const { area, barcode } = req.body;
  if (!area || !barcode) {
    return res
      .status(404)
      .json({ error: "Invalid request made, please check URL" });
  }

  try {
    const product = await Product.findOne({ ProductID: Number(barcode) });
    if (product) {
      //Get Area
      const areaData: IAreaSeeds | null = await AreaSeeds.findOne({
        Name: `${area}`,
      });
      if (!areaData) {
        return res.status(400).json({
          error: `No bin information isn't available for ${area}, please try again later`,
        });
      } else {
        getBinScanResult(product, areaData, res);
      }
    } else {
      checkProduct(`${barcode}`, res);
    }
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
}

function getLatestDate(startDate: string, intervalWeeks: number) {
  let currentDate = new Date(startDate);
  const now = new Date();

  while (!isAfter(currentDate, now)) {
    currentDate = addWeeks(currentDate, intervalWeeks);
  }

  return format(currentDate, "dd-MM-yyyy");
}

async function checkProduct(barcode: string, res: Response) {
  try {
    const openFoodAPICheck = await axios.get(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
    );

    if (openFoodAPICheck.status == 200) {
      const responseData = openFoodAPICheck.data as IProductDetails;
      await Product.create({
        ProductID: Number(barcode),
        ProductName: responseData.product.product_name,
        Material: responseData.product.packaging,
      });
      return res.status(205).json({
        error:
          "Product may not be available, please try again or scan another product",
      });
    } else {
      const openBeautyAPICheck = await axios.get(
        `https://world.openbeautyfacts.org/api/v2/product/${barcode}.json`
      );
      if (openBeautyAPICheck.status == 200) {
        const responseData = openBeautyAPICheck.data as IProductDetails;
        await Product.create({
          ProductID: Number(barcode),
          ProductName: responseData.product.product_name,
          Material: responseData.product.packaging,
        });
        return res.status(205).json({
          error:
            "Product may not be available, please try again or scan another product",
        });
      }
    }
  } catch (error: any) {
    return res.status(404).json({
      error: "Product isn't available, please scan a different one",
    });
  }
}

export default app;
