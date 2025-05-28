import { NextRequest, NextResponse } from 'next/server';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export function handleApiError(error: unknown, req: NextRequest) {
  console.error(error);
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }
  return NextResponse.json(
    { error: 'Terjadi kesalahan server' },
    { status: 500 }
  );
} 