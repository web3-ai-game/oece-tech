import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('错误详情:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // 默认500错误
  let error = { ...err };
  let message = '服务器内部错误';

  // Mongoose错误处理
  if (err.name === 'CastError') {
    message = '资源未找到';
    res.status(404);
  } else if (err.name === 'ValidationError') {
    message = '验证失败';
    res.status(400);
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    message = '重复的字段值';
    res.status(400);
  } else {
    res.status(500);
  }

  res.json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};