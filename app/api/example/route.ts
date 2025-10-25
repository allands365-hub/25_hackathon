import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

// GET example - Fetch data from Supabase
export async function GET(request: Request) {
  try {
    // Example: Fetch all rows from a table
    // Replace 'your_table' with your actual table name
    // const { data, error } = await supabaseAdmin
    //   .from('your_table')
    //   .select('*');

    // if (error) {
    //   return NextResponse.json(
    //     { error: error.message },
    //     { status: 500 }
    //   );
    // }

    // For now, return a placeholder response
    return NextResponse.json({
      message: 'API route working!',
      // data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST example - Create new data in Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Example: Insert data into a table
    // const { data, error } = await supabaseAdmin
    //   .from('your_table')
    //   .insert([body])
    //   .select();

    // if (error) {
    //   return NextResponse.json(
    //     { error: error.message },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      message: 'Data created successfully',
      // data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT example - Update data in Supabase
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    // const { data, error } = await supabaseAdmin
    //   .from('your_table')
    //   .update(updateData)
    //   .eq('id', id)
    //   .select();

    // if (error) {
    //   return NextResponse.json(
    //     { error: error.message },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      message: 'Data updated successfully',
      // data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE example - Delete data from Supabase
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // const { error } = await supabaseAdmin
    //   .from('your_table')
    //   .delete()
    //   .eq('id', id);

    // if (error) {
    //   return NextResponse.json(
    //     { error: error.message },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({
      message: 'Data deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
