import { NextResponse } from "next/server";

export type ApiResponse<T = Record<string, unknown>> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};

export function successResponse<T>(
  status: number,
  data: T,
  message?: string,
  pagination?: ApiResponse["pagination"],
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    message,
    pagination,
  }, {status});
}

export function errorResponse(
  error: string,
  status: number = 400,
  message?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status }
  );
}