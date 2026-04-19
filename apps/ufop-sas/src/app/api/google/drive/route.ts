import { NextResponse } from 'next/server'
import { listGoogleSheets } from '@/lib/google-sheets'

export const dynamic = "force-static"

export async function GET() {
    try {
        const files = await listGoogleSheets()
        return NextResponse.json({ files })
    } catch (error: any) {
        console.error('Erro na API de Drive:', error)
        return NextResponse.json(
            { error: 'Falha ao buscar arquivos do Drive', details: error.message },
            { status: 500 }
        )
    }
}
