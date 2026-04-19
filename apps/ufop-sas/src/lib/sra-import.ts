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

                // Mapeamento básico para as tabelas do projeto lidando com variações e linhas vazias
                const studentsToInsert = rows
                    .map(row => {
                        const r = row as any;
                        return {
                            nome: row.nome || r['Nome do Aluno'] || r['Nome'] || r['NOME'] || r['Aluno'],
                            matricula: row.matricula || r['Matrícula'] || r['Matricula'] || r['MATRÍCULA'] || r['Registro'],
                            email: row.email || r['E-mail'] || r['Email'] || r['EMAIL'],
                            data_ingresso: row.data_ingresso || r['Data de Ingresso'] || r['Ingresso'] || r['Data']
                        }
                    })
                    // Remove linhas vazias (onde não há nome nem matricula)
                    .filter(student => student.nome && student.matricula)

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
