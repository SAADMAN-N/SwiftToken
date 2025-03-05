import { NextResponse } from 'next/server';
import { getUserCredits } from '@/lib/database/users';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  try {
    const credits = await getUserCredits(walletAddress);
    return NextResponse.json({ credits });
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}