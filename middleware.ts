import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, refreshSession } from './api/auth';

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname.startsWith("/welcome") && req.nextUrl.searchParams.has("tk") ){
        const tk: string = req.nextUrl.searchParams.get("tk") || ""
        const json = JSON.parse(atob(tk))

        const response = NextResponse.redirect(new URL("/welcome", req.url));
        response.cookies.set('jwt', json.jwt);
        response.cookies.set('user', JSON.stringify(json.user));

        return response;
    }

    const session = await getSession();

    if ( (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/") && session ) {
        console.log("Ya estás logueado");
        //refreshSession();
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if ( (req.nextUrl.pathname.startsWith("/home") ||
            req.nextUrl.pathname.startsWith("/welcome") ||
            req.nextUrl.pathname.startsWith("/groups") ||
            req.nextUrl.pathname.startsWith("/users/")) && !session ) {
        console.log("No estas logueado");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    //refreshSession();
    return NextResponse.next();
}
