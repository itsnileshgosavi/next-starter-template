import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth' 

export function withAuth(
  handler: (
    req: NextRequest,
    session: any,
    context: { params: Promise<any> }
  ) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    context: { params: Promise<any> }
  ) => {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(req, session, context)
  }
}
