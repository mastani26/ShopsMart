import { v2 as cloudinary } from "cloudinary";
import product from "../models/product.js";

// Add product
export const addProduct = async (req, res) => {
  try {
    console.log("Files:", req.files);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
      });
    }

    const productData = JSON.parse(req.body.productdata);

    const imagesUrl = [];

    // ✅ SIMPLE UPLOAD METHOD (WORKS 100%)
    for (let file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "products"
        }
      );

      imagesUrl.push(result.secure_url);
    }

    await product.create({
      ...productData,
      image: imagesUrl,
    });

    res.json({
      success: true,
      message: "Product Added",
    });

  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Product List
export const ProductList = async (req, res) => {
  try {
    const products = await product.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ProductById = async (req, res) => {
  try {
    const productData = await product.findById(req.params.id);
    if (!productData) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product: productData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;

    const updatedProduct = await product.findByIdAndUpdate(
      id,
      { inStock },
      { new: true }
    );

    res.json({
      success: true,
      message: "Stock Updated Successfully",  // ✅ ADD THIS
      product: updatedProduct
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

