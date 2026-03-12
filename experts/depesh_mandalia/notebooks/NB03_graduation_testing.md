# Notebook 03: The GT Framework (Graduation Testing)
**Expert:** Depesh Mandalia
**Domínio:** Estrutura de Testes para Facebook/Meta Ads

## 1. A Filosofia Fundamental dos Testes
** Princípio:**  Nunca desperdice grandes montantes de orçamento em variáveis não testadas ("Never waste big spend on untested variables"). Teste pequeno, gradue os vencedores ("Test small, graduate winners"). 

O Facebook requer dados para otimizar, mas a fase de descoberta de anúncios campeões deve ser isolada do orçamento principal.

## 2. As Fases do Graduation Testing (GT)

O método GT é projetado para isolar variáveis. Você não testa Criativo e Público ao mesmo tempo no mesmo teste cego, pois não saberá qual fator gerou o resultado.

### GT 1: O Teste de "Sandbox" de Públicos (Audience Testing)
- **Objetivo:** Identificar os melhores públicos usando pequenos orçamentos diários em campanhas separadas (as "sandbox campaigns").
- **Método:** Pegue criativos que você já sabe que funcionam (ou seus melhores "palpites" muito baseados no Avatar 5W) e teste-os contra *novos públicos*. Isole o público.

### GT 2: Teste de Criativos (Creative Testing)
- **Objetivo:** Descobrir o gancho (hook), o formato, texto e apelo visual campeões.
- **Método:** Pegue os públicos vencedores da fase GT 1 e faça testes empilhando "novos criativos" contra eles. Teste formatos, visuais, chamadas de copy e até landing pages.

### GT 3: A Graduação (Prospecting Optimization)
- **Objetivo:** Escala e consolidação ("Graduating the winners").
- **Método:** Mova a combinação vencedora (Público Vencedor + Criativo Vencedor) para a campanha principal de prospecção. Aguarde 2-3 dias para a estabilidade do conjunto de anúncios antes de tentar escalar orçamentos brutalmente. Não tenha pressa. Aguarde o algoritmo se acalmar.
