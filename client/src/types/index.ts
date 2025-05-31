/**
 * Type definitions barrel file
 *
 * This file re-exports all type definitions from the various type files,
 * allowing consumers to import all types from a single location.
 *
 */

// Re-export all types from User.types.ts
export type { User, Activity } from "./User.types";

// Re-export all types from Academic.types.ts
export type { Student, MajorType, Major, StudentMajor } from "./Academic.types";

// Re-export all types from Financial.types.ts
export type { Tax, MajorTax, Payment, PaymentWithTaxes, Receipt } from "./Financial.types";

// Re-export all types from Company.types.ts
export type { Company } from "./Company.types";
