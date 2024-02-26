// middleware/authMiddleware.js
import { verifyToken } from './verifyToken.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = authHeader.split(' ')[1];
  
  try {
    const user = verifyToken(token);
    req.user = user; // Attach the user payload to the request object
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token is invalid or expired' });
  }
};
