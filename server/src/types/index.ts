/**
 * Type definitions barrel file
 *
 * This file re-exports all type definitions from the various type files,
 * allowing consumers to import all types from a single location.
 *
 */

import { Request } from "express";
import { User } from "./User.types";

// Re-export all types from User.types.ts
export { User, ActivityLog } from "./User.types";

// Re-export all types from Academic.types.ts
export { Student, MajorType, Major, StudentMajor } from "./Academic.types";

// Re-export all types from Financial.types.ts
export { Tax, MajorTax, Payment, Receipt } from "./Financial.types";

// Re-export all types from Company.types.ts
export { Company } from "./Company.types";

export interface RequestWithUser extends Request {
  user?: User;
}
