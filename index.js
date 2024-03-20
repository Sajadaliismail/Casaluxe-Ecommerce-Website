const express = require("express");
const connectDB = require("./server/connection/connection");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require('cookie-parser');


dotenv.config({ path: "config.env" });


const app = express();
const Port = process.env.PORT || 7001;

app.set("view engine", "ejs");

app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan("tiny"));

app.use("/", require("./server/routes/userRoute"));
app.use("/admin",require("./server/routes/adminRoute"));

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/imgs", express.static(path.resolve(__dirname, "assets/imgs")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/fonts", express.static(path.resolve(__dirname, "assets/fonts")));

connectDB();


app.listen(Port, () => {
  console.log(`Server running on http://localhost:${Port}`);
});
