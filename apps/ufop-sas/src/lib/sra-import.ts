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

                // Normalização das chaves do Excel para evitar problemas de espaços (' DATA INGRESSO') ou capitalização ('NOME')
                const studentsToInsert = rows
                    .map(row => {
                        const rawRow = row as Record<string, any>;
                        const normalizedRow: Record<string, any> = {};

                        // Limpa os nomes das colunas: remove espaços em volta e deixa tudo maiúsculo
                        for (const key in rawRow) {
                            normalizedRow[key.trim().toUpperCase()] = rawRow[key];
                        }

                        return {
                            nome: normalizedRow['NOME'] || normalizedRow['NOME DO ALUNO'] || normalizedRow['ALUNO'],
                            matricula: normalizedRow['MATRICULA'] || normalizedRow['MATRÍCULA'],
                            email: normalizedRow['EMAIL INSTITUCIONAL'] || normalizedRow['EMAIL'] || normalizedRow['E-MAIL'],
                            data_ingresso: normalizedRow['DATA INGRESSO'] || normalizedRow['ANO INGRESSO'] || normalizedRow['DATA DE INGRESSO'] || null,
                            status_bolsa: normalizedRow['BOLSA'] || normalizedRow['DESCRICAO BOLSA'] || 'Nenhuma'
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
