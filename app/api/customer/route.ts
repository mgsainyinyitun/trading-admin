import { NextResponse } from 'next/server';
import { z } from 'zod';

const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export async function GET(req: Request) {
  try {
    // Here you would fetch customers from your database
    // For demo, returning mock data
    const customers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 234-567-8901',
        joinDate: '2024-01-15',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1 234-567-8902',
        joinDate: '2024-01-14',
        status: 'active',
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+1 234-567-8903',
        joinDate: '2024-01-13',
        status: 'inactive',
      },
    ];

    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = customerSchema.parse(body);

    // Here you would create a new customer in your database
    // For demo, return mock response
    const newCustomer = {
      id: Math.random().toString(36).substr(2, 9),
      ...validatedData,
      joinDate: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}