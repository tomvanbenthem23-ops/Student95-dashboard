import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 's95_auth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const password = process.env.S95_PASSWORD;

  if (!password) {
    return NextResponse.json({ ok: true }); // gate disabled
  }
  if (!body || typeof body.password !== 'string' || body.password !== password) {
    return NextResponse.json({ error: 'Onjuist wachtwoord' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, password, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 dagen
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
