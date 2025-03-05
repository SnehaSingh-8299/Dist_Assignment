const csvParser = require('csv-parser');
const { format } = require('@fast-csv/format');
const fs = require('fs');
const Product = require('../models/Product');

exports.uploadCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const products = [];
        const stream = fs.createReadStream(req.file.path).pipe(csvParser());

        stream.on("data", (row) => {
            // Validate required fields exist
            if (!row.product_name || !row.category || !row.price || !row.stock) {
                console.error("Row missing required fields, skipping:", row);
                return;
            }
            const price = parseFloat(row.price);
            const stock = parseInt(row.stock, 10);
            if (isNaN(price) || isNaN(stock)) {
                console.error("Row has invalid numeric values, skipping:", row);
                return;
            }
            // Sanitize and normalize data
            const sanitizedRow = {
                product_name: String(row.product_name).trim(),
                category: String(row.category).trim(),
                price: price,
                stock: stock,
                user: req.user._id
            };

            products.push(sanitizedRow);
        });

        stream.on("end", async () => {
            try {
                if (products.length === 0) {
                    return res.status(400).json({ message: "CSV file is empty or no valid rows found" });
                }

                // Insert the validated products into DB
                await Product.insertMany(products);
                fs.unlinkSync(req.file.path);

                res.json({ message: "CSV Uploaded Successfully", importedCount: products.length });
            } catch (error) {
                res.status(500).json({ message: "Error uploading CSV", error: error.message });
            }
        });

        stream.on("error", (error) => {
            res.status(500).json({ message: "Error reading CSV file", error: error.message });
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.downloadCSV = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id }).lean();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found to export" });
        }
        // Set headers to prompt a file download
        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        res.setHeader("Content-Type", "text/csv");
        // Create a CSV stream using fast-csv format
        const csvStream = format({ headers: true });
        csvStream.pipe(res);
        // Write each product to the CSV stream
        products.forEach((product) => {
            csvStream.write(product);
        });

        csvStream.end();
    } catch (error) {
        res.status(500).json({ message: "Error exporting CSV", error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product({ ...req.body, user: req.user._id });
        await product.save();
        res.json({ message: 'Product Created Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (category) {
            filter.category = { $regex: new RegExp(category, "i") };
        }
        if (minPrice || maxPrice) {
            filter.price = { $gte: minPrice || 0, $lte: maxPrice || Infinity };
        }

        const totalCount = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            totalCount,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(totalCount / limit),
            products,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.json({ message: 'Product Updated Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product || product.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};
