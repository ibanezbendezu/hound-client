import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession, refreshSession } from './api/auth';
import { cookies } from 'next/headers';

export async function middleware(req: NextRequest) {
    if(req.nextUrl.pathname.startsWith("/welcome") && req.nextUrl.searchParams.has("tk") ){
        const tk: string = req.nextUrl.searchParams.get("tk") || ""
        const json = JSON.parse(atob(tk))

        cookies().set('jwt', json.jwt);
        cookies().set('user', json.user);
    }

    const session = await getSession();
    console.log("Session:", session);

    if ( (req.nextUrl.pathname.startsWith("/home") ||
            req.nextUrl.pathname.startsWith("/welcome") ||
            req.nextUrl.pathname.startsWith("/groups") ||
            req.nextUrl.pathname.startsWith("/users/")) && !session ) {
        console.log("No estas logueado");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    let response = NextResponse.next();
    if ( (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname === "/") && session ) {
        console.log("Ya estás logueado");
        //refreshSession();
        response = NextResponse.redirect(new URL("/home", req.url));
    }

    //refreshSession();
    response.cookies.set('jwt', cookies().get("jwt")?.value || "");
    response.cookies.set('user', cookies().get("user")?.value || "");
    return response;
}
