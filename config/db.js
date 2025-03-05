const mongoose = require("mongoose");

module.exports.mongodb = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('MongoDB Connected'))
        .catch(err => console.error(err));
};