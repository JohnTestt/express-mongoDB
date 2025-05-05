import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import pacienteRoutes from "./src/routes/index.js";


dotenv.config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use("/api", pacienteRoutes);

//mongoDB connection
const mongoURI = process.env.MONGO_URI; //  URI arquivo env
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error ao conectar com o MongoDB: ", err));

 

app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



