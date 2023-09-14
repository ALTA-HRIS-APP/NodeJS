const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const dotenv = require("dotenv");
const db = require("./models");

const port = 3000;

dotenv.config();
app.use(express.json());

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Selamat datang di Express!");
});
app.use("/user", userRoute);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
