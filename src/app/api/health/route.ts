import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ ok: true, service: 'swadheen-estates', timestamp: new Date().toISOString() })
}
