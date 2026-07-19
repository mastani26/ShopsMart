import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Product from "./models/product.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect Database
await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ MongoDB Connected");

// Folder containing images
const imageFolder = path.join(__dirname, "seed-images");

// Delete all previous products
await Product.deleteMany({});
console.log("🗑️ Deleted old products");



// Upload helper
async function uploadImage(fileName) {
  const imagePath = path.join(imageFolder, fileName);

  if (!fs.existsSync(imagePath)) {
    console.log(`❌ Missing image: ${fileName}`);
    return "";
  }

  const result = await cloudinary.uploader.upload(imagePath, {
    folder: "grocery-products",
  });

  console.log(`✅ Uploaded ${fileName}`);
  return result.secure_url;
}

const products = [
    {
  name: "Potato 500g",
  category: "Vegetables",
  price: 25,
  offerprice: 20,
  image: [await uploadImage("potato_image_1.png")],
  description: [
    "Fresh and organic",
    "Rich in carbohydrates",
    "Ideal for curries and fries",
  ],
  inStock: true,
},
{
  name: "Tomato 1 kg",
  category: "Vegetables",
  price: 40,
  offerprice: 35,
  image: [await uploadImage("tomato_image.png")],
  description: [
    "Juicy and ripe",
    "Rich in Vitamin C",
    "Perfect for salads and sauces",
  ],
  inStock: true,
},
{
  name: "Carrot 500g",
  category: "Vegetables",
  price: 30,
  offerprice: 28,
  image: [await uploadImage("carrot_image.png")],
  description: [
    "Sweet and crunchy",
    "Good for eyesight",
    "Ideal for juices",
  ],
  inStock: true,
},
{
  name: "Spinach 500g",
  category: "Vegetables",
  price: 18,
  offerprice: 15,
  image: [await uploadImage("spinach_image_1.png")],
  description: [
    "Rich in iron",
    "Healthy leafy vegetable",
  ],
  inStock: true,
},
{
  name: "Onion 500g",
  category: "Vegetables",
  price: 22,
  offerprice: 19,
  image: [await uploadImage("onion_image_1.png")],
  description: [
    "Fresh onions",
    "Perfect for cooking",
  ],
  inStock: true,
},

// Fruits

{
  name: "Apple 1 kg",
  category: "Fruits",
  price: 120,
  offerprice: 110,
  image: [await uploadImage("apple_image.png")],
  description: [
    "Fresh apples",
    "Rich in fiber",
    "Farm fresh",
  ],
  inStock: true,
},
{
  name: "Orange 1 kg",
  category: "Fruits",
  price: 80,
  offerprice: 75,
  image: [await uploadImage("orange_image.png")],
  description: [
    "Juicy oranges",
    "Vitamin C rich",
  ],
  inStock: true,
},
{
  name: "Banana 1 kg",
  category: "Fruits",
  price: 50,
  offerprice: 45,
  image: [await uploadImage("banana_image_1.png")],
  description: [
    "Fresh bananas",
    "Energy rich",
  ],
  inStock: true,
},
{
  name: "Mango 1 kg",
  category: "Fruits",
  price: 150,
  offerprice: 140,
  image: [await uploadImage("mango_image_1.png")],
  description: [
    "Sweet mangoes",
    "Seasonal fruit",
  ],
  inStock: true,
},
{
  name: "Grapes 500g",
  category: "Fruits",
  price: 70,
  offerprice: 65,
  image: [await uploadImage("grapes_image_1.png")],
  description: [
    "Fresh grapes",
    "Rich in antioxidants",
  ],
  inStock: true,
},
// Dairy

{
  name: "Amul Milk 1L",
  category: "Dairy",
  price: 60,
  offerprice: 55,
  image: [await uploadImage("amul_milk_image.png")],
  description: [
    "Pure and fresh",
    "Rich in calcium",
    "Trusted brand",
  ],
  inStock: true,
},
{
  name: "Paneer 200g",
  category: "Dairy",
  price: 90,
  offerprice: 85,
  image: [await uploadImage("paneer_image.png")],
  description: [
    "Fresh paneer",
    "Rich in protein",
  ],
  inStock: true,
},
{
  name: "Eggs 12 pcs",
  category: "Dairy",
  price: 90,
  offerprice: 85,
  image: [await uploadImage("eggs_image.png")],
  description: [
    "Farm fresh eggs",
    "High protein",
  ],
  inStock: true,
},
{
  name: "Paneer Premium 200g",
  category: "Dairy",
  price: 95,
  offerprice: 90,
  image: [await uploadImage("paneer_image_2.png")],
  description: [
    "Premium quality paneer",
    "Soft and fresh",
  ],
  inStock: true,
},
{
  name: "Cheese 200g",
  category: "Dairy",
  price: 140,
  offerprice: 130,
  image: [await uploadImage("cheese_image.png")],
  description: [
    "Creamy cheese",
    "Perfect for sandwiches",
  ],
  inStock: true,
},

// Drinks

{
  name: "Coca Cola 1.5L",
  category: "Drinks",
  price: 80,
  offerprice: 75,
  image: [await uploadImage("coca_cola_image.png")],
  description: [
    "Refreshing drink",
    "Best served chilled",
  ],
  inStock: true,
},
{
  name: "Pepsi 1.5L",
  category: "Drinks",
  price: 78,
  offerprice: 73,
  image: [await uploadImage("pepsi_image.png")],
  description: [
    "Refreshing cola",
    "Serve chilled",
  ],
  inStock: true,
},
{
  name: "Sprite 1.5L",
  category: "Drinks",
  price: 79,
  offerprice: 74,
  image: [await uploadImage("sprite_image_1.png")],
  description: [
    "Lemon flavored drink",
    "Refreshing",
  ],
  inStock: true,
},
{
  name: "Fanta 1.5L",
  category: "Drinks",
  price: 77,
  offerprice: 72,
  image: [await uploadImage("fanta_image_1.png")],
  description: [
    "Orange flavored drink",
    "Best served cold",
  ],
  inStock: true,
},
{
  name: "7 Up 1.5L",
  category: "Drinks",
  price: 76,
  offerprice: 71,
  image: [await uploadImage("seven_up_image_1.png")],
  description: [
    "Lemon lime drink",
    "Refreshing taste",
  ],
  inStock: true,
},

// Grains

{
  name: "Basmati Rice 5kg",
  category: "Grains",
  price: 550,
  offerprice: 520,
  image: [await uploadImage("basmati_rice_image.png")],
  description: [
    "Premium basmati rice",
    "Long grain",
  ],
  inStock: true,
},
{
  name: "Wheat Flour 5kg",
  category: "Grains",
  price: 250,
  offerprice: 230,
  image: [await uploadImage("wheat_flour_image.png")],
  description: [
    "Whole wheat flour",
    "Healthy choice",
  ],
  inStock: true,
},
{
  name: "Organic Quinoa 500g",
  category: "Grains",
  price: 450,
  offerprice: 420,
  image: [await uploadImage("quinoa_image.png")],
  description: [
    "Protein rich",
    "Organic quinoa",
  ],
  inStock: true,
},
{
  name: "Brown Rice 1kg",
  category: "Grains",
  price: 120,
  offerprice: 110,
  image: [await uploadImage("brown_rice_image.png")],
  description: [
    "Healthy brown rice",
    "High fiber",
  ],
  inStock: true,
},
{
  name: "Barley 1kg",
  category: "Grains",
  price: 150,
  offerprice: 140,
  image: [await uploadImage("barley_image.png")],
  description: [
    "Nutritious barley",
    "Rich in fiber",
  ],
  inStock: true,
},

// Bakery

{
  name: "Brown Bread 400g",
  category: "Bakery",
  price: 40,
  offerprice: 35,
  image: [await uploadImage("brown_bread_image.png")],
  description: [
    "Soft whole wheat bread",
    "Perfect for breakfast",
  ],
  inStock: true,
},
{
  name: "Butter Croissant",
  category: "Bakery",
  price: 50,
  offerprice: 45,
  image: [await uploadImage("butter_croissant_image.png")],
  description: [
    "Fresh baked croissant",
    "Soft and buttery",
  ],
  inStock: true,
},
{
  name: "Chocolate Cake",
  category: "Bakery",
  price: 350,
  offerprice: 325,
  image: [await uploadImage("chocolate_cake_image.png")],
  description: [
    "Rich chocolate cake",
    "Perfect for celebrations",
  ],
  inStock: true,
},
{
  name: "Whole Wheat Bread",
  category: "Bakery",
  price: 45,
  offerprice: 40,
  image: [await uploadImage("whole_wheat_bread_image.png")],
  description: [
    "Healthy whole wheat bread",
    "High in fiber",
  ],
  inStock: true,
},
{
  name: "Vanilla Muffins",
  category: "Bakery",
  price: 100,
  offerprice: 90,
  image: [await uploadImage("vanilla_muffins_image.png")],
  description: [
    "Soft vanilla muffins",
    "Perfect snack",
  ],
  inStock: true,
},

// Instant Food

{
  name: "Maggi Noodles",
  category: "Instant",
  price: 55,
  offerprice: 50,
  image: [await uploadImage("maggi_image.png")],
  description: [
    "2 minute noodles",
    "Delicious masala taste",
  ],
  inStock: true,
},
{
  name: "Top Ramen",
  category: "Instant",
  price: 45,
  offerprice: 40,
  image: [await uploadImage("top_ramen_image.png")],
  description: [
    "Instant noodles",
    "Easy to cook",
  ],
  inStock: true,
},
{
  name: "Knorr Cup Soup",
  category: "Instant",
  price: 35,
  offerprice: 30,
  image: [await uploadImage("knorr_soup_image.png")],
  description: [
    "Healthy soup",
    "Ready in minutes",
  ],
  inStock: true,
},
{
  name: "Yippee Noodles",
  category: "Instant",
  price: 50,
  offerprice: 45,
  image: [await uploadImage("yippee_image.png")],
  description: [
    "Long non-sticky noodles",
    "Great taste",
  ],
  inStock: true,
},
{
  name: "Maggi Oats Noodles",
  category: "Instant",
  price: 40,
  offerprice: 35,
  image: [await uploadImage("maggi_oats_image.png")],
  description: [
    "Healthy oats noodles",
    "High in fiber",
  ],
  inStock: true,
}

];

// Insert Products

await Product.insertMany(products);

console.log(`✅ ${products.length} Products Added Successfully`);

await mongoose.connection.close();

console.log("🎉 Seeding Completed Successfully");