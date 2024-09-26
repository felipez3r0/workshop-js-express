import * as jose from 'jose'

export default async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') // Pega o token do header
  if (!token) { // Verifica se o token foi informado
    return res.status(401).json({ message: 'Token não informado' })
  }

  const encoder = new TextEncoder();
  const secretKey = encoder.encode(process.env.JWT_SECRET); // O método verify espera um Uint8Array, então vamos converter a string para Uint8Array

  try {
    const payload = await jose.jwtVerify(token, secretKey) // Verifica se o token é válido
    req.user = payload
    next() // Continua a execução
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' })
  }
}