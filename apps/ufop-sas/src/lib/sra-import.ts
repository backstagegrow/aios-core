import * as XLSX from 'xlsx'
import { supabase } from './supabase'

export interface SRAStudentRow {
    nome: string
    matricula: string
    email?: string
    data_ingresso?: string
    professor_orientador?: string
}

export const processSRAExport = async (file: File) => {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
            try {
                const data = e.target?.result
                const workbook = XLSX.read(data, { type: 'binary' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const rows = XLSX.utils.sheet_to_json<SRAStudentRow>(sheet)

                // Mapeamento básico para as tabelas do projeto
                const studentsToInsert = rows.map(row => ({
                    nome: row.nome || (row as any)['Nome do Aluno'],
                    matricula: row.matricula || (row as any)['Matrícula'],
                    email: row.email || (row as any)['E-mail'],
                    data_ingresso: row.data_ingresso || (row as any)['Data de Ingresso']
                }))

                const { data: result, error } = await supabase
                    .from('alunos')
                    .upsert(studentsToInsert, { onConflict: 'matricula' })

                if (error) throw error
                resolve(result)
            } catch (err) {
                reject(err)
            }
        }
        reader.onerror = reject
        reader.readAsBinaryString(file)
    })
}
