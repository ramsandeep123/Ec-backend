import express from 'express';
import cors from 'cors';
import { connect } from './db/connector.js';
import { config as configDotenv } from 'dotenv';
import Product from './model/productModel.js';

// Initialize Express app
const app = express();
configDotenv();

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON bodies
const PORT = process.env.PORT || 5000;

// Connect to the database
connect();

// Endpoint to add a new product
app.post('/add-products', async (req, res) => {
    try {
        const data = req.body;

        const newProduct = new Product({

            title: data.title,
            price: data.price,
            description: data.description,
            category: data.category,
            image: data.image,
            rating: data.rating,
        });

        // Save the product to the database
        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {

        res.status(500).json({ message: 'Failed to add product', error });
    }
});

app.get("/get-products", async (req, res) => {

    try {

        const products = await Product.find()

        res.status(200).send(products)

    } catch (error) {
        res.status(400).send(error)
    }

})

app.post("/get-selected-products", async (req, res) => {

    const { id } = req.body;


    if (!id) {
        return res.status(404).send("id not found")

    }

    const data = await Product.findById({ _id: id })

    res.status(200).send(data)

})
app.post("/get-category-products", async (req, res) => {
    let original
    const { category } = req.body;

    if (category === "cosemetics") {
        original = "cosmetics"
    }
    else if (category === "clothing") {
        original = "women's clothing"
    }
    else if (category === "accessories") {
        original = "electronics"
    }


    if (!category) {
        return res.status(404).send("category not found")
    }
    const data = await Product.find({ category: original })

    res.status(200).send(data)
})

app.post("/search-products", async (req, res) => {
    const searchText = req.body?.searchText; // Use query parameters for search text
    console.log("search", searchText)
    // Construct the match object for the title field
    if (!searchText) {
        return res.status(404).send("search text not found")
    }


    let match = {
        title: { $regex: searchText, $options: "i" } // "i" for case-insensitive search
    };

    try {
        const products = await Product.find(match);

        // Send the matching products as response
        console.log("searc", products)
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});


// Define Port and Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
