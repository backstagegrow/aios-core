import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Define os domínios principais da agência
    const mainDomains = ['localhost:3000', 'agencia.com', 'alphaacademy.com'];
    const isMainDomain = mainDomains.some(domain => hostname.includes(domain));

    // Se for o domínio principal, segue o fluxo normal
    if (isMainDomain) {
        return NextResponse.next();
    }

    // Se for um domínio de cliente (ou subdomínio), faz o rewrite para /sites/[slug]
    // Ex: cliente.com -> /sites/cliente
    // lp.cliente.com -> /sites/lp-cliente

    const slug = hostname
        .replace('.com.br', '')
        .replace('.com', '')
        .replace('.net', '')
        .replace('lp.', 'lp-')
        .split('.')[0]; // Pega a primeira parte significativa

    const searchParams = url.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`;

    console.log(`Rewriting ${hostname} to /sites/${slug}${path}`);

    return NextResponse.rewrite(new URL(`/sites/${slug}${path}`, request.url));
}

export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
    ],
};
