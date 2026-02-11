/**
 * Global augmentation of the Express Request interface.
 * After the check-auth middleware runs, `req.userData` will be populated
 * with the decoded JWT payload fields.
 */

export interface UserData {
  email: string;
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      userData?: UserData;
    }
  }
}
