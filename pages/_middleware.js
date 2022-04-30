import { NextResponse } from 'next/server'
import { verifyToken } from '../lib/utils';

export async function middleware(req, ev) {
    const token = req ? req.cookies?.token : ''
    const userId = await verifyToken(token)
    const {pathname, origin} = req.nextUrl.clone()

    if ((token && userId) || pathname.includes(`/api/login`) || pathname.includes(`/static`)) {

        return NextResponse.next()
    }
    if (!token && pathname !== `/login`) {
        return NextResponse.redirect(`${origin}/login`)
    }
}
