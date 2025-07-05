// utils/errors/AppError.ts
import type { ErrorCode } from './errorCodes';

export class AppError extends Error {
  public code: ErrorCode;
  public context?: unknown;
  public source?: string;

  constructor({ message, code = 'UNKNOWN_ERROR',context,source}: {
    message: string;
    code?: ErrorCode;
    context?: unknown;
    source?: string;
  }) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.source = source;
  }
}
