import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
};

export { generateToken }