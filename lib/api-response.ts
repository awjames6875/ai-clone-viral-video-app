import { NextResponse } from "next/server";

interface ApiError {
  error: string;
  code?: string;
}

interface ApiSuccess<T> {
  data: T;
}

/**
 * Return a successful JSON response
 */
export function success<T>(data: T, status: number = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ data }, { status });
}

/**
 * Return an error JSON response
 */
export function error(
  message: string,
  status: number = 400,
  code?: string
): NextResponse<ApiError> {
  return NextResponse.json({ error: message, code }, { status });
}

/**
 * Return a 404 Not Found response
 */
export function notFound(message: string = "Resource not found"): NextResponse<ApiError> {
  return error(message, 404, "NOT_FOUND");
}

/**
 * Return a 400 Bad Request response
 */
export function badRequest(message: string): NextResponse<ApiError> {
  return error(message, 400, "BAD_REQUEST");
}

/**
 * Return a 401 Unauthorized response
 */
export function unauthorized(message: string = "Unauthorized"): NextResponse<ApiError> {
  return error(message, 401, "UNAUTHORIZED");
}

/**
 * Return a 500 Internal Server Error response
 */
export function serverError(message: string = "Internal server error"): NextResponse<ApiError> {
  return error(message, 500, "SERVER_ERROR");
}
