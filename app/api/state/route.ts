import { NextRequest, NextResponse } from 'next/server';
import { deleteState, getAllState, setState, setStateMany } from '@/app/lib/kv';

export async function GET() {
  try {
    const data = await getAllState();
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Ongeldige request body' }, { status: 400 });
  }
  try {
    if (Array.isArray(body.rows)) {
      await setStateMany(body.rows);
      return NextResponse.json({ ok: true, written: body.rows.length });
    }
    if (typeof body.key === 'string') {
      await setState(body.key, body.value);
      return NextResponse.json({ ok: true, written: 1 });
    }
    return NextResponse.json(
      { error: 'Verwacht {key,value} of {rows:[...]}' },
      { status: 400 },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.key !== 'string') {
    return NextResponse.json({ error: 'Verwacht {key}' }, { status: 400 });
  }
  try {
    await deleteState(body.key);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
