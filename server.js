const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const convertRoutes = require("./routes/convert");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", convertRoutes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});