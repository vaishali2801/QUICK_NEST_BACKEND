import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import connectDB from "./config/db.js";

import HttpError from "./middleware/HttpError.js";

import router from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import providerRouter from "./routes/providerRoutes.js";
import helmet from "helmet";
import hpp from "hpp";
import {rateLimit} from "express-rate-limit";

const app = express();

//convert json data
app.use(express.json());

app.use(rateLimit());

app.use(helmet());

app.use(hpp());
//routes
app.use("/user", router);
app.use("/admin", adminRoutes);
app.use("/booking", bookingRouter);
app.use("/provider", providerRouter);
//server
app.get("/", (req, res) => {
    res.json("hello form server");
});
//undefined route handling
app.use((req, res, next) => {
    next(new HttpError("requested route not found", 404));
})
//centralized error handling
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.statusCode || 500).json({ message: error.message || "internal server error" });

})
//port
const port = process.env.port || 5001;
//start server
async function startServer() {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        })
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
//call
startServer();
// import services from "./model/Services.js";
// import Category from "./model/Category.js";
// async function check() {
//     try {
//         // const service = await services.findById("69d63c62c1e3174df31ef14c");
//         // console.log(service);
//         // const AllServices = await Category.findById("69d63a7ac1e3174df31ef124");
//         // console.log(AllServices);

//         //manually
//         // const service = await services.findById("69d63c62c1e3174df31ef14c").populate("category");
//         // console.log(service);
        
//         //virtual
//         const category = await Category
//             .findById("69d63b03c1e3174df31ef12c")
//             .populate("services");

//         console.log(category.services);
//     } catch (error) {
//         console.error(error);
//     }
// }
// check();