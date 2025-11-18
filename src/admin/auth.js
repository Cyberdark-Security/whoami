const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Configura nodemailer (usando Gmail SMTP como ejemplo)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/forgot-password/request
router.post("/forgot-password/request", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Email no encontrado" });

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.user.update({
      where: { email },
      data: { resetCode: code, resetCodeExpires: expires },
    });

    await transporter.sendMail({
      from: `"Whoami Labs" <no-reply@whoamilabs.com>`,
      to: email,
      subject: "Código para recuperación de contraseña",
      text: `Tu código es: ${code}. Expira en 15 minutos.`,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/forgot-password/verify
router.post("/forgot-password/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Email no encontrado" });

    if (user.resetCode !== code)
      return res.status(400).json({ error: "Código inválido" });

    if (user.resetCodeExpires < new Date())
      return res.status(400).json({ error: "Código expirado" });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// POST /api/forgot-password/reset
router.post("/forgot-password/reset", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).json({ error: "Email no encontrado" });

    if (user.resetCode !== code)
      return res.status(400).json({ error: "Código inválido" });

    if (user.resetCodeExpires < new Date())
      return res.status(400).json({ error: "Código expirado" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpires: null,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
