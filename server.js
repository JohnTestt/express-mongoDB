import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// crud pacientes
import pacienteRoutes from "./src/routes/pacientesRoutes.js";

//rotas de autenticação
import authRoutes from './src/routes/authRoutes.js';

//autenticação e segurança 
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();
const app = express();

//middleware segurança
app.use(helmet());         // cabeçalhos de segurança   
app.use(cookieParser());  // ler cookies (para httpOnly)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5000' , // substitua pela URL do seu frontend
  credentials: true, // habilita o envio de cookies
}));

//observação se helmete não funcionar, use:
// app.use(
//   helmet({
//     crossOriginEmbedderPolicy: false,
//     crossOriginResourcePolicy: { policy: "cross-origin" },
//   })
// );


// rate limit simples
app.use(rateLimit({ windowMs: 60*1000, max: 100, message: { error: "Muitas requisições, tente mais tarde." } }));

app.use(express.json());

//rotas
app.use('/auth', authRoutes); 
app.use("/pacientes", pacienteRoutes);

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

