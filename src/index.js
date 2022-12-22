import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(authRoutes);

app.listen(4000, () => {
    console.log('Server is listening on port 4000.');
  });