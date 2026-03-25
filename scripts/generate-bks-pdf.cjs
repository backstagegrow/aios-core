const { chromium } = require('playwright');

(async () => {
    console.log("Inicializando o navegador em background para converter...");
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const fileUrl = 'file:///d:/001Gravity/aios-core/packages/brand-engine/clients/bks-grow/presentations/new-bks-grow-presentation.html';

    console.log("Carregando layout cinematográfico...");
    await page.goto(fileUrl, { waitUntil: 'networkidle' });

    // Adiciona CSS de impressão para quebrar as páginas certinho em 1920x1080 (Aspect Ratio 16:9 de apresentação)
    await page.addStyleTag({
        content: `
        @media print {
            body { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important;
                background-color: #050505 !important;
            }
            section {
                height: 1080px !important;
                max-height: 1080px !important;
                min-height: 1080px !important;
                page-break-after: always !important;
                page-break-inside: avoid !important;
                overflow: hidden !important;
                padding: 80px 10% !important; /* Ajusta margens para caber na tela cheia de PDF */
            }
            /* Remove scrollbars and borders */
            ::-webkit-scrollbar { display: none; }
            section { border-bottom: none !important; }
        }
    `});

    const outputPath = 'd:/001Gravity/aios-core/packages/brand-engine/clients/bks-grow/presentations/BKS_GROW_Apresentacao_Oficial.pdf';

    console.log("Gerando arquivo PDF...");
    await page.pdf({
        path: outputPath,
        width: '1920px',
        height: '1080px',
        printBackground: true,
        landscape: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    console.log("✅ PDF gerado com sucesso em:");
    console.log(outputPath);

    await browser.close();
})();
