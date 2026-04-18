import { XMLParser } from 'fast-xml-parser'

export interface LattesIndicators {
    indexH?: number
    fwci?: number
    artigos: any[]
    orientacoes: any[]
}

export const parseLattesXML = async (xmlContent: string): Promise<LattesIndicators> => {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ""
    })

    const jsonObj = parser.parse(xmlContent)
    const curriculum = jsonObj['CURRICULO-VITAE']

    // Extração de Artigos em Periódicos
    const producaoBibliografica = curriculum['PRODUCAO-BIBLIOGRAFICA'] || {}
    const artigosRaw = producaoBibliografica['ARTIGOS-PUBLICADOS']?.['ARTIGO-PUBLICADO'] || []

    const artigos = (Array.isArray(artigosRaw) ? artigosRaw : [artigosRaw]).map((art: any) => ({
        titulo: art['DADOS-BASICOS-DO-ARTIGO']?.['TITULO-DO-ARTIGO'],
        ano: art['DADOS-BASICOS-DO-ARTIGO']?.['ANO-DO-ARTIGO'],
        periodico: art['DETALHAMENTO-DO-ARTIGO']?.['TITULO-DO-PERIODICO-OU-REVISTA'],
        doi: art['DADOS-BASICOS-DO-ARTIGO']?.['DOI']
    }))

    // Extração de Orientações
    const outraProducao = curriculum['OUTRA-PRODUCAO'] || {}
    const orientacoesRaw = outraProducao['ORIENTACOES-CONCLUIDAS']?.['ORIENTACAO-CONCLUIDA'] || []

    const orientacoes = (Array.isArray(orientacoesRaw) ? orientacoesRaw : [orientacoesRaw]).map((ori: any) => ({
        tipo: ori['DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS']?.['NATUREZA'],
        titulo: ori['DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS']?.['TITULO'],
        ano: ori['DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS']?.['ANO'],
        orientado: ori['DETALHAMENTO-DE-ORIENTACOES-CONCLUIDAS']?.['NOME-DO-ORIENTADO']
    }))

    return {
        artigos,
        orientacoes
    }
}
