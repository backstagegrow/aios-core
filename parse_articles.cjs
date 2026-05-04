const fs = require('fs');
const path = require('path');

const inputCsv = 'd:/001Gravity/aios-core/articles.csv';
const outputMd = 'D:/01 -Arquivos/Obsidian/AIOS/Projects/Erick Sena em FACULDADE/extraction-matrix-data.md';

const csvContent = fs.readFileSync(inputCsv, 'utf8');
const lines = csvContent.split('\n').filter(line => line.trim().length > 0);

function parseCsvLine(text) {
    let result = [];
    let curVal = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (i < text.length - 1 && text[i+1] === '"') {
                    curVal += '"'; i++;
                } else {
                    inQuotes = false;
                }
            } else {
                curVal += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                result.push(curVal);
                curVal = '';
            } else {
                curVal += char;
            }
        }
    }
    result.push(curVal);
    return result;
}

let articles = [];
for (let i = 1; i < lines.length; i++) {
    const parsed = parseCsvLine(lines[i]);
    if (parsed.length > 5) {
        articles.push({
            title: parsed[1],
            year: parsed[2],
            authors: parsed[10],
            url: parsed[11],
            doi: parsed[17]
        });
    }
}

let outContent = '# 🗂️ Matriz de Extração de Dados (TCC)\n\n';
outContent += 'Esta matriz contém os ' + articles.length + ' artigos selecionados para leitura completa. À medida que os PDFs forem processados, atualize as colunas de extração (Objetivo, Ferramentas, Impacto, Lacuna).\n\n';
outContent += '| ID | Autor (Ano) | Título | Objetivo Principal | Ferramentas de IA Citadas | Impacto no Marketing | Lacuna Identificada | Link/DOI |\n';
outContent += '| :-- | :---------- | :----- | :----------------- | :------------------------ | :------------------- | :------------------ | :------- |\n';

articles.forEach((a, index) => {
    let authorsStr = a.authors || '';
    let authorName = authorsStr.split(' and ')[0].trim().replace(/,/g, ' ').replace(/  /g, ' ');
    if (authorsStr.split(' and ').length > 1) {
        authorName += ' et al.';
    }
    const autorAno = authorName + ' (' + (a.year || '') + ')';
    const title = (a.title || '').replace(/\|/g, '-').replace(/\n/g, ' ');
    const link = a.doi ? a.doi : a.url;
    const doiLink = link ? '[Link](' + link + ')' : '';
    const id = String(index + 1).padStart(2, '0');
    
    outContent += '| ' + id + ' | ' + autorAno + ' | ' + title + ' | | | | | ' + doiLink + ' |\n';
});

fs.writeFileSync(outputMd, outContent, 'utf8');
console.log('Done parsing CSV and writing to Markdown matrix.');
