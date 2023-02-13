const express = require("express");
const path = require("path");

const app = express();
/*
app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});
*/

app.use("/src", express.static(path.resolve(__dirname, "src")));
app.use("/frontend", express.static(path.resolve(__dirname, "frontend")));
app.use("/frontend/static", express.static(path.resolve(__dirname, "frontend", "static")));
app.use("/frontend/static/js/views", express.static(path.resolve(__dirname, "frontend", "static", "js", "views")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "login.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));