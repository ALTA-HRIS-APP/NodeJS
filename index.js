const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const dotenv = require("dotenv");
const db = require("./models");
const cors = require("cors");

const port = 3000;
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors({ credentials: true }));

// Synchronize model-model dengan database
(async () => {
  try {
    await db.Sequelize.sync();
    console.log("Models synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
  }
})();

const userRoute = require("./router/user");
const devisiRoute = require("./router/devisi");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Selamat datang di Express!");
});
app.use("/", userRoute);
app.use("/", devisiRoute);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
