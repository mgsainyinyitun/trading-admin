import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for signup
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = signupSchema.parse(body);

    // Here you would typically:
    // 1. Check if user exists
    // 2. Hash password
    // 3. Create user in database
    // For demo, we'll return a success message
    
    return NextResponse.json(
      { message: 'Account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}