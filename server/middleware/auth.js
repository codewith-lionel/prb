import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = await User.findById(decoded.id).select('-password -refreshToken');
    
    if (!req.user) {
      throw new ApiError(401, 'User not found');
    }

    if (req.user.status === 'suspended') {
      throw new ApiError(403, 'Your account has been suspended');
    }

    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized to access this route');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user.role}' is not authorized to access this route`);
    }
    next();
  };
};

export const requireApproval = (req, res, next) => {
  if (req.user.role === 'investor' && !req.user.isApproved) {
    throw new ApiError(403, 'Your investor account is pending approval');
  }
  
  if (req.user.role === 'employer' && !req.user.isVerified) {
    throw new ApiError(403, 'Your employer account is pending verification');
  }
  
  next();
};
