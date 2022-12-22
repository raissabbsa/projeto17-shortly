import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import urlRoutes from "./routes/urlRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(authRoutes);
app.use(urlRoutes);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });