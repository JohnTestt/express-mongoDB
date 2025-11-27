import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Gera token JWT
const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { 
expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// Helper para setar cookie httpOnly
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true em prod (https)
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
  });
};

// Registrar usuário

export const register = async (req, res) => {
try {
const { name, email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email e senha obrigatórios' });
const exists = await User.findOne({ email });
if (exists) return res.status(400).json({ message: 'Usuário já existe' });

const hashed = await bcrypt.hash(password, 10);
const user = await User.create({ name, email, password: hashed });

  // Gera token e seta cookie

const token = createToken(user._id);
setTokenCookie(res, token);

res.json({
message: "Login realizado com sucesso",
user: {
id: user._id,
name: user.name,
email: user.email,
avatar: user.avatar,
},
});
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Login usuário

export const login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });

const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(400).json({ message: 'Credenciais inválidas' });

// Gera token e seta cookie
const token = createToken(user._id);
setTokenCookie(res, token);

res.json({
message: "Login realizado com sucesso",
user: {
id: user._id,
name: user.name,
email: user.email,
avatar: user.avatar,
},
});
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Usuário autenticado (me)

export const me = async (req, res) => {
// req.user deve estar setado pelo middleware protect/protectCookie
const user = req.user;  // já vem do middleware de autenticação
 if (!user) return res.status(401).json({ message: "Não autenticado" });
res.json({ id: user._id, name: user.name, email: user.email, avatar: user.avatar });
};

// Upload avatar (Cloudinary)

// Upload avatar: usamos multer memoryStorage and upload_stream do Cloudinary
export const uploadAvatar = async (req, res) => {
try {
if (!req.file) return res.status(400).json({ message: 'No file' });

const streamUpload = (buffer) => {
return new Promise((resolve, reject) => {
const stream = cloudinary.uploader.upload_stream({ folder: 'avatars' }, (error, result) => {
if (result) resolve(result);
else reject(error);
});
streamifier.createReadStream(buffer).pipe(stream);
});
};

const result = await streamUpload(req.file.buffer);
// salva URL no user
req.user.avatar = result.secure_url;
await req.user.save();
res.json({ avatar: result.secure_url });
} catch (err) {
res.status(500).json({ message: err.message });
}
};

// Logout usuário

export const logout = (req, res) => {
res.clearCookie('token', { httpOnly: true, sameSite: 'none', secure: process.env.NODE_ENV === 'production' });
res.json({ message: 'Logged out' });
};



