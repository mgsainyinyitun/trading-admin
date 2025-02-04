import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Here you would typically:
    // 1. Verify credentials
    // 2. Generate JWT token
    // 3. Set HTTP-only cookie
    // For demo, we'll return a mock token

    return NextResponse.json({
      message: 'Login successful',
      token: 'mock_jwt_token'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
}