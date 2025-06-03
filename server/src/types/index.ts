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
export * from "./User.types";

// Re-export all types from Academic.types.ts
export * from "./Academic.types";

// Re-export all types from Financial.types.ts
export * from "./Financial.types";

// Re-export all types from Company.types.ts
export * from "./Company.types";

export interface RequestWithUser extends Request {
    user?: User;
}
