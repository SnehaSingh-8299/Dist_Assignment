const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});
module.exports = mongoose.model('Product', productSchema);
