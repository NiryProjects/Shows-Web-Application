/**
 * Extend the Express Request interface to include decoded JWT payload data.
 * This allows `req.userData` to be used in route handlers after auth middleware.
 */
declare namespace Express {
  interface Request {
    userData?: {
      email: string;
      userId: string;
    };
  }
}
