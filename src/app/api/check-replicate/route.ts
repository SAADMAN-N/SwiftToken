import { NextResponse } from 'next/server';
import { checkReplicateConnection } from '@/lib/replicate';

export async function GET() {
  try {
    const status = await checkReplicateConnection();
    
    if (status.isValid) {
      return NextResponse.json({
        success: true,
        message: status.message,
        timestamp: status.timestamp
      });
    } else {
      return NextResponse.json({
        success: false,
        message: status.message
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to check Replicate API connection',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
