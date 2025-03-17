import { NextResponse } from "next/server";

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
  });
}

export function errorResponse(error: string, status: number = 400): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}

export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse<ApiResponse<never>> {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden"): NextResponse<ApiResponse<never>> {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = "Not found"): NextResponse<ApiResponse<never>> {
  return errorResponse(message, 404);
} 