import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Método no permitido' });
  }
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email no encontrado' });

    const code = generateCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // Expira en 15 minutos

    await prisma.user.update({
      where: { email },
      data: {
        resetCode: code,
        resetCodeExpires: expires,
      },
    });

    await transporter.sendMail({
      from: '"Whoami Labs" <no-reply@whoamilabs.com>',
      to: email,
      subject: 'Código para recuperación de contraseña',
      text: `Tu código es: ${code}. Expira en 15 minutos.`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
