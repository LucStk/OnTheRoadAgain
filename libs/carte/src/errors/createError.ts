// utils/errors/createError.ts
import { AppError } from './AppError';
import type { ErrorCode } from './errorCodes';

export function createError(
  message: string,
  code: ErrorCode = 'UNKNOWN_ERROR',
  context?: unknown
): AppError {
  const source = getCallingLocation();

  return new AppError({
    message,
    code,
    context,
    source,
  });
}

// Essaie de lire la stack pour trouver l'origine de l'appel (facultatif)
function getCallingLocation(): string | undefined {
  const err = new Error();
  const stack = err.stack?.split('\n');
  const callerLine = stack?.[3]; // Ligne après createError()

  if (callerLine) {
    // Extrait une forme lisible : fichier:ligne:colonne
    const match = callerLine.match(/at\s+(.*)/);
    return match?.[1]?.trim();
  }

  return undefined;
}
