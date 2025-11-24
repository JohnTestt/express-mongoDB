import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectCookie = async (req, res, next) => {
  try {
    // Busca o token no cookie
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Não autorizado, token não encontrado" });
    }

    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca o usuário pelo ID do token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // Salva os dados do usuário no req para usar em rotas protegidas
    req.user = user;

    next(); // segue para o controller
  } catch (error) {
    res.status(401).json({ message: "Não autorizado, token inválido" });
  }
};