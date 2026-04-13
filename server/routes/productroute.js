import express from "express";
import { upload } from "../configs/multer.js";
import authseller from "../middleware/authseller.js";
import {
  addProduct,
  changeStock,
  ProductById,
  ProductList,
} from "../controllers/productcontroller.js";

const productRouter = express.Router();

productRouter.post("/add", authseller, upload.array("images", 4), addProduct);
productRouter.get("/list", ProductList);
productRouter.get("/id/:id", ProductById);
productRouter.post("/stock", authseller, changeStock);

export default productRouter;








