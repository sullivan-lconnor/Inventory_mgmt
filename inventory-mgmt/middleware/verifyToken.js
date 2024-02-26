// {toplevel}/middleware/verifyToken.js
import jwt from 'jsonwebtoken';
const secretKey = 'yourSecretKey'; //TODO LIAM: Make this better

export const verifyToken = (token) => {
  // jwt.verify throws an error if token verification fails
  const decoded = jwt.verify(token, secretKey);
  return { id: decoded.userId };
};
