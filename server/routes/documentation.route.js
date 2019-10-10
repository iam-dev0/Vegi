import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../utils/swagger.json";

const router = express.Router();

router.use("/", swaggerUi.serve);

router.get("/", swaggerUi.setup(swaggerDocument));

module.exports = router;
