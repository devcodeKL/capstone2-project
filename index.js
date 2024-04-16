// [IMPORT MODULES]
const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

// [IMPORT ROUTE HANDLERS]
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");

const port = 4000;

const app = express();

// [MIDDLEWARE SET-UP]
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cors());

// [MONGODB ATLAS CONNECTION]
mongoose.connect("mongodb+srv://admin:admin123@b337.dgg14eh.mongodb.net/csp2?retryWrites=true&w=majority",
        {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }
);

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

// [ROUTE HANDLERS SET-UP]
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);

// [START SERVER]
if(require.main === module){

    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${ process.env.PORT || port }`)
    })

}

// [EXPORT DEPENDENCIES/MODULES FOR TESTING]
module.exports = {  app, 
                    mongoose };