import { NextResponse } from 'next/server'
import { getSpreadsheetData } from '@/lib/google-sheets'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { spreadsheetId, range = 'A1:Z100' } = body

        if (!spreadsheetId) {
            return NextResponse.json({ error: 'spreadsheetId é obrigatório' }, { status: 400 })
        }

        const data = await getSpreadsheetData(spreadsheetId, range)

        // Futuro: Adicionar lógica de mapeamento para o Supabase aqui

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Erro na API de Sheets:', error)
        return NextResponse.json(
            { error: 'Falha ao buscar dados da planilha', details: error.message },
            { status: 500 }
        )
    }
}
