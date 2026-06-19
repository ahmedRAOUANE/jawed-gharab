import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { errorResponse } from "./api-response";

/**
 * Centralized error handler for API routes.
 * Maps known error types to appropriate HTTP status codes.
 */
export function handleApiError(error: unknown): ReturnType<typeof errorResponse> {
  console.error("API Error:", error);

  // Zod validation errors
  if (error instanceof ZodError) {
    const message = error.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ");
    return errorResponse(`Validation failed: ${message}`, 400);
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": // Unique constraint
        const target = error.meta?.target as string[];
        return errorResponse(
          `The ${target?.join(", ")} already exists.`,
          409
        );
      case "P2025": // Record not found
        return errorResponse("Resource not found.", 404);
      case "P2003": // Foreign key constraint
        return errorResponse(
          "Cannot perform operation because related records exist.",
          409
        );
      default:
        return errorResponse("Database error occurred.", 500);
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return errorResponse("Invalid data provided.", 400);
  }

  // Generic fallback
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("An unexpected error occurred.", 500);
}