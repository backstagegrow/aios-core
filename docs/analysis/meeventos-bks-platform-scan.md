# MeEventos BKS — Varredura Completa da Plataforma

**URL:** `https://app8.meeventos.com.br/bks/`  
**Usuário:** Erick  
**Plano:** ENTERPRISE  
**Saldo MeShop:** R$ 2,50  
**Data da varredura:** 2026-04-22  

---

## Visão Geral

MeEventos é um **SaaS brasileiro de gestão de eventos** com white-label para empresas (instância `/bks`). Toda a interface é renderizada client-side via JavaScript/AJAX — o backend serve apenas o shell HTML. Identificadas **45 páginas/módulos** na instância ENTERPRISE.

---

## Mapa Completo de Funcionalidades

### 1. Dashboard / Home
| Página | Rota | Descrição |
|--------|------|-----------|
| Tela Principal | `?p=principal` | Dashboard central com menu rápido de atalhos |
| Central de Notificações | `?p=mensagens` | Feed de notificações, avisos e atualizações do sistema |
| Últimas Atualizações do Sistema | (widget) | Painel de novidades do sistema com timeline |

**Menu Rápido (Atalhos visíveis no principal):**
- Novo Orçamento
- Acompanhar Todos Orçamentos
- Funil de Vendas
- Cadastrar Novo Evento
- Visualizar Próximos Eventos
- Visualizar Tarefas dos Eventos
- Áreas de Clientes Ativas
- Criar modelos de orçamentos por E-mail ou WhatsApp
- Criar modelos de contratos
- Usuários do Sistema
- Alterar Principais Textos e Mensagens do Sistema

---

### 2. Planejamento de Eventos
| Página | Rota | Descrição |
|--------|------|-----------|
| Planejamentos | `?p=dashboardplan` | Dashboard de planejamento de eventos |
| Eventos com Escala de Equipe | `?p=dashboardeventosequipe` | Visão de eventos com alocação de equipe |
| Contratos e Documentos | `?p=dashboarddocs` | Gestão de contratos e docs por evento |
| Escala da Equipe | `?p=dashboardequipe` | Escalonamento de equipe |
| Grupo de Eventos | `?p=grupo_eventos` | Agrupamento de eventos |
| Checklists | `?p=checklist` | Checklists por evento |
| Pré-Reservas | `?p=dashprereservas` | Visualizar todas as pré-reservas |

---

### 3. Agenda
| Página | Rota | Descrição |
|--------|------|-----------|
| Agenda Geral | `?p=agenda` | Calendário geral de eventos |
| Agenda Checklist | `?p=agendachecklist` | Agenda com checklists vinculados |
| Agenda Anual de Eventos | `?p=agendaanual` | Visão anual de todos os eventos |

---

### 4. CRM — Clientes e Contatos
| Página | Rota | Descrição |
|--------|------|-----------|
| Clientes | `?p=clientes` | Base de clientes |
| Fornecedores da Empresa | `?p=fornecedores` | Cadastro de fornecedores próprios |
| Fornecedores Parceiros | `?p=parceiros` | Rede de fornecedores parceiros |
| Casting | `?p=casting` | Cadastro de artistas/profissionais — com filtros, signatários e seleção |
| Catálogo de Fornecedores | `?p=catalogo` | Catálogo público — ação: CRIAR CATÁLOGO |
| Loja Online | `?p=catalogo_loja` | Vitrine online de produtos/serviços |

---

### 5. Locais de Eventos
| Página | Rota | Descrição |
|--------|------|-----------|
| Cadastrar/Visualizar Locais | `?p=locaiseventos` | CRUD de locais de eventos |
| Filtrar Locais | `?p=filtrolocais` | Busca e filtros de locais cadastrados |

---

### 6. Equipe
| Página | Rota | Descrição |
|--------|------|-----------|
| Grupos de Equipe | `?p=grupodeequipe` | Criação de grupos de equipe |
| MeSkills | `?p=meskills` | Cadastro de habilidades da equipe — ação: Salvar Alterações |
| Usuários do Sistema | `?p=usuarios` | Gestão de acessos (campos: Foto, Nome, E-mail, Cargo) |

---

### 7. Equipamentos e Insumos
| Página | Rota | Descrição |
|--------|------|-----------|
| Itens e Insumos | `?p=equipamentos` | Inventário — ações: Registrar, + Nova categoria |
| Itens Reservados | `?p=items-dashboard` | Dashboard de itens reservados por evento |
| Itens em Manutenção | `?p=manutencao` | Controle de itens em manutenção |

---

### 8. Vendas e Financeiro
| Página | Rota | Descrição |
|--------|------|-----------|
| Funil de Vendas | `?p=funil` | Pipeline de vendas/orçamentos |
| Conciliação Bancária | `?p=conciliacao-bancaria` | Tabela: Data, Conta, Responsável, Lançamentos |
| Notas Fiscais | `?p=notas-fiscais` | Emissão/gestão de NFs |
| Relatórios Avançados | `?p=relatorios-financeiros` | Relatórios financeiros detalhados |
| Serviços | `?p=servicos` | Cadastro de serviços prestados |

---

### 9. Marketing e Presença Digital
| Página | Rota | Descrição |
|--------|------|-----------|
| Criador de Site | `?p=sites` | Builder de site para eventos |
| MePages | `?p=sociallink` | Link-in-bio / social link — ação: Salvar e Ativar |
| Links/QRCode de Avisos | `?p=avisosinternos` | Geração de QR Codes para avisos internos |
| Loja de Modelos | `?p=loja-modelos` | Marketplace de templates |

---

### 10. Inscrições e Feiras
| Página | Rota | Descrição |
|--------|------|-----------|
| Inscrições | `?p=etiquetasinscricoes` | Gestão de inscrições (etiquetas) |
| Todas as Feiras | `?p=feiras` | Módulo de feiras e exposições |

---

### 11. Relatórios
| Página | Rota | Descrição |
|--------|------|-----------|
| Relatórios | `?p=relatorios` | Central de relatórios gerais |
| Relatórios Avançados | `?p=relatorios-financeiros` | Financeiro detalhado |

---

### 12. Integrações e Plataforma
| Página | Rota | Descrição |
|--------|------|-----------|
| Integrações | `?p=integracoes` | Conectores com sistemas externos (badge: Novo) |
| Loja de APPs | `?p=lojaapps` | Marketplace de add-ons/apps |
| + Outras Categorias | `?p=cadastros` | Categorias adicionais de cadastro |
| MeShop | `?p=meshop` | Créditos internos — Saldo: R$ 2,50, Cadastro Usuário, Extrato |

---

### 13. Suporte e Conta
| Página | Rota | Descrição |
|--------|------|-----------|
| Indicações e Bônus | `?p=recompensas` | Programa de indicações |
| Ajuda - Tickets | `?p=ticket` | Sistema de suporte via tickets |
| Configurações | (dropdown) | Configurações do sistema |
| Termo de Uso | (link) | — |
| Política de Privacidade | (link) | — |

---

## Observações Técnicas

| Item | Detalhe |
|------|---------|
| Stack backend | PHP (PHPSESSID, `index.php?acao=`) |
| Renderização | 100% client-side JavaScript/AJAX |
| Autenticação | Sessão PHP via cookie PHPSESSID |
| API externa | `https://app.megestao.com.br/consultoriabi/news/updates.php` (feed de atualizações) |
| Frontend libs | jQuery 1.8.3, Bootstrap |
| Idiomas | Português (BR) e English (US) |
| Notificações | Sistema interno + pop-up de suporte (WhatsApp, Tickets, Central de Ajuda) |

---

## Módulo Mensagens (Foco da Solicitação)

A página `?p=mensagens` é a **Central de Notificações** do sistema — não é um chat ou mensageria externa. Funcionalidades:

- Feed de notificações do sistema (atualizações, avisos)
- Tabela com colunas: **Data | Tipo | Descrição | Ações**
- Integração com feed externo `app.megestao.com.br` para novidades do sistema
- Pop-up de suporte rápido: WhatsApp, Ticket, Treinamento, Central de Ajuda
- Botão "QUERO ASSINAR" — indica que algumas features dentro das notificações são bloqueadas por plano

---

## Resumo Executivo

O MeEventos (instância BKS) é uma **plataforma all-in-one para empresas de eventos** cobrindo:

1. **Operacional:** Agenda, Planejamento, Checklist, Equipe, Equipamentos
2. **Comercial:** CRM, Funil de Vendas, Orçamentos, Casting, Locais
3. **Financeiro:** Conciliação Bancária, Notas Fiscais, Relatórios
4. **Digital:** Criador de Sites, MePages (link-in-bio), QR Codes, Loja Online
5. **Marketplace:** Loja de APPs, Catálogo de Fornecedores, Loja de Modelos
6. **Suporte:** Tickets, Treinamentos, WhatsApp direto

O plano **ENTERPRISE** dá acesso a todos os módulos, com créditos MeShop para consumo de recursos extras.
