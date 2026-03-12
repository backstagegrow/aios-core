/**
 * AIOS Technical Audit → ClickUp Upload Script
 * Uploads the complete audit documentation to ClickUp "Gestão Empresarial" space
 * 
 * Usage: node scripts/upload_audit_to_clickup.js
 */

const https = require('https');
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY || 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const TEAM_ID = '90132645314';

function clickupRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            path: `/api/v2${path}`,
            method,
            headers: {
                'Authorization': CLICKUP_API_KEY,
                'Content-Type': 'application/json',
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSpaces() {
    const res = await clickupRequest('GET', `/team/${TEAM_ID}/space?archived=false`);
    return res.data.spaces || [];
}

async function findOrCreateSpace(name) {
    const spaces = await getSpaces();
    let space = spaces.find(s => s.name === name);
    if (space) {
        console.log(`✅ Space found: "${name}" (${space.id})`);
        return space;
    }
    console.log(`📦 Creating space: "${name}"...`);
    const res = await clickupRequest('POST', `/team/${TEAM_ID}/space`, {
        name,
        multiple_assignees: true,
        features: {
            due_dates: { enabled: true },
            time_tracking: { enabled: true },
            tags: { enabled: true },
            checklists: { enabled: true },
        },
    });
    console.log(`✅ Space created: "${name}" (${res.data.id})`);
    return res.data;
}

async function findOrCreateFolder(spaceId, folderName) {
    const res = await clickupRequest('GET', `/space/${spaceId}/folder?archived=false`);
    const folders = res.data.folders || [];
    let folder = folders.find(f => f.name === folderName);
    if (folder) {
        console.log(`  ✅ Folder found: "${folderName}" (${folder.id})`);
        return folder;
    }
    console.log(`  📂 Creating folder: "${folderName}"...`);
    const createRes = await clickupRequest('POST', `/space/${spaceId}/folder`, { name: folderName });
    console.log(`  ✅ Folder created: "${folderName}" (${createRes.data.id})`);
    return createRes.data;
}

async function findOrCreateList(folderId, listName) {
    const res = await clickupRequest('GET', `/folder/${folderId}/list?archived=false`);
    const lists = res.data.lists || [];
    let list = lists.find(l => l.name === listName);
    if (list) {
        console.log(`    ✅ List found: "${listName}" (${list.id})`);
        return list;
    }
    console.log(`    📋 Creating list: "${listName}"...`);
    const createRes = await clickupRequest('POST', `/folder/${folderId}/list`, { name: listName });
    console.log(`    ✅ List created: "${listName}" (${createRes.data.id})`);
    return createRes.data;
}

async function createTask(listId, taskData) {
    const res = await clickupRequest('POST', `/list/${listId}/task`, taskData);
    if (res.status === 200 || res.status === 201) {
        console.log(`      ✅ Task created: "${taskData.name}" (${res.data.id})`);
        return res.data;
    } else {
        console.log(`      ❌ Error creating task "${taskData.name}": ${JSON.stringify(res.data)}`);
        return null;
    }
}

async function createChecklist(taskId, checklistName, items) {
    const checkRes = await clickupRequest('POST', `/task/${taskId}/checklist`, { name: checklistName });
    if (checkRes.status !== 200 && checkRes.status !== 201) return;
    const checklistId = checkRes.data.checklist.id;
    for (const item of items) {
        await clickupRequest('POST', `/checklist/${checklistId}/checklist_item`, { name: item });
        await sleep(200);
    }
    console.log(`        ✅ Checklist "${checklistName}" with ${items.length} items`);
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
    console.log('🚀 AIOS Technical Audit → ClickUp Upload');
    console.log('=========================================\n');

    // 1. Find or Create Space
    const space = await findOrCreateSpace('AIOS Infrastructure');
    await sleep(500);

    // 2. Create Folders
    const folders = [
        'Agents', 'Prompts', 'Database', 'Integrations',
        'Observability', 'Governance', 'Policies', 'Risks',
        'Improvements', 'Technical Debt'
    ];

    const folderMap = {};
    for (const f of folders) {
        folderMap[f] = await findOrCreateFolder(space.id, f);
        await sleep(300);
    }

    // 3. Create Lists under Agents folder (per squad)
    const squads = [
        'bks-growth-ops', 'nexus-copy-elite', 'bks-sales-page-ops',
        'bks-executive-board', 'bks-campaign-vanguard', 'bks-devops'
    ];

    const squadLists = {};
    for (const s of squads) {
        squadLists[s] = await findOrCreateList(folderMap['Agents'].id, s);
        await sleep(300);
    }

    // 4. Create agent tasks per squad
    const auditChecklist = [
        'Prompt versionado',
        'Supabase modelado',
        'Dependências mapeadas',
        'Variáveis auditadas',
        'Observabilidade validada',
        'Segurança analisada',
        'Riscos documentados',
        'Fallback validado',
        'Integrações confirmadas',
    ];

    // Growth Ops agents
    const growthOpsAgents = [
        { name: '🤖 growth_operator', role: 'Growth Operations Orchestrator', category: 'Orchestrator', temp: '0.2' },
        { name: '📊 client_intelligence_analyst', role: 'Client Strategic Intelligence Analyst', category: 'Strategy', temp: '0.3' },
        { name: '🔍 market_opportunity_analyst', role: 'Macro & Opportunity Analyst', category: 'Strategy', temp: '0.4' },
        { name: '🎯 campaign_strategist', role: 'Growth Campaign Architect', category: 'Strategy', temp: '0.4' },
        { name: '⚙️ decision_engine', role: 'Funnel & Channel Decision Strategist', category: 'Strategy', temp: '0.2' },
        { name: '📈 market_performance_researcher', role: 'Market Performance Researcher', category: 'Traffic', temp: '0.3' },
        { name: '🏗️ meta_campaign_builder', role: 'Meta Campaign Architecture Strategist', category: 'Traffic', temp: '0.3' },
        { name: '🎨 creative_brief_generator', role: 'Creative Brief Generator', category: 'Traffic', temp: 'var' },
        { name: '🔧 meta_ads_optimizer', role: 'Meta Ads Optimizer', category: 'Traffic', temp: 'var' },
        { name: '💬 whatsapp_flow_builder', role: 'WhatsApp Flow Builder', category: 'Traffic', temp: 'var' },
        { name: '💻 frontend_developer', role: 'Frontend Developer', category: 'Build', temp: 'var' },
        { name: '🖥️ backend_developer', role: 'Backend Developer', category: 'Build', temp: 'var' },
        { name: '📝 document_parser', role: 'Structured Document Intelligence Extractor', category: 'Memory', temp: '0.2' },
        { name: '📖 memory_loader', role: 'Client Experience & Strategy Retriever', category: 'Memory', temp: '0.1' },
        { name: '🧹 memory_curator', role: 'Strategy Refinement Specialist', category: 'Memory', temp: '0.2' },
        { name: '✅ performance_validator', role: 'Statistical Validation Gatekeeper', category: 'Memory', temp: '0.1' },
        { name: '📊 performance_updater', role: 'Performance Data & Memory Specialist', category: 'Memory', temp: '0.1' },
        { name: '🔎 campaign_auditor', role: 'Quality Assurance for Ad Campaigns', category: 'QA', temp: '0.1' },
    ];

    for (const agent of growthOpsAgents) {
        const task = await createTask(squadLists['bks-growth-ops'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** bks-growth-ops\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Temperatura:** ${agent.temp}\n**Versão:** 1.0.0\n**Status:** Ativo\n\n---\n\n**Prompt System:** Versionado como v1.0.0\n**Fallback Model:** ❌ NÃO CONFIGURADO\n**Observabilidade:** ❌ NÃO IMPLEMENTADA\n**Output Contract:** ❌ NÃO DOCUMENTADO`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // Copy Elite agents
    const copyEliteAgents = [
        { name: '👑 nexus_copy_chief', role: 'Nexus Elite Copy Director', category: 'Orchestrator' },
        { name: '🔬 nexus_market_strategist', role: 'Nexus Market Research Strategist', category: 'Research' },
        { name: '💡 nexus_big_idea_architect', role: 'Nexus Big Idea & Positioning Architect', category: 'Ideation' },
        { name: '🎁 nexus_offer_specialist', role: 'Nexus Offer & Value Engineering Specialist', category: 'Ideation' },
        { name: '✍️ nexus_conversion_copywriter', role: 'Nexus Elite Conversion Copywriter', category: 'Copy' },
        { name: '🏷️ nexus_brand_positioning_writer', role: 'Nexus Brand Authority & Positioning Copywriter', category: 'Copy' },
        { name: '🎬 nexus_script_specialist', role: 'Nexus Script & VSL Specialist', category: 'Copy' },
        { name: '🎯 nexus_persuasion_optimizer', role: 'Nexus Persuasion & QA Optimizer', category: 'QA' },
    ];

    for (const agent of copyEliteAgents) {
        const task = await createTask(squadLists['nexus-copy-elite'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** nexus-copy-elite\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Versão:** 1.0.0\n**Status:** Ativo`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // Sales Page Ops agents
    const salesPageAgents = [
        { name: '⚙️ sales_page_operator', role: 'Sales Page Operations Orchestrator', category: 'Orchestrator' },
        { name: '📋 client_requirements_analyst', role: 'Sales Page Briefing Analyst', category: 'Strategy' },
        { name: '✍️ sales_page_copywriter', role: 'Sales Page Copywriter', category: 'Copy' },
        { name: '🎨 ux_ui_page_designer', role: 'UX/UI Page Designer', category: 'Design' },
        { name: '🎨 design_system_curator', role: 'Design System Curator', category: 'Design' },
        { name: '💻 frontend_page_developer', role: 'Frontend Page Developer', category: 'Build' },
        { name: '🖥️ backend_page_developer', role: 'Backend Page Developer', category: 'Build' },
        { name: '✅ sales_page_validator', role: 'Sales Page Validator (QA)', category: 'QA' },
    ];

    for (const agent of salesPageAgents) {
        const task = await createTask(squadLists['bks-sales-page-ops'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** bks-sales-page-ops\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Versão:** 1.0.0\n**Status:** Ativo`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // Executive Board agents
    const execBoardAgents = [
        { name: '🏛️ board_orchestrator', role: 'Executive Board Chairman', category: 'Orchestrator' },
        { name: '📊 cmo_strategic_director', role: 'Chief Marketing Strategist', category: 'Strategy' },
        { name: '💰 cfo_growth_analyst', role: 'CFO Growth Analyst', category: 'Strategy' },
        { name: '⚙️ coo_operations_architect', role: 'COO Operations Architect', category: 'Strategy' },
        { name: '🎯 ceo_scenario_simulator', role: 'CEO Scenario Simulator', category: 'Strategy' },
    ];

    for (const agent of execBoardAgents) {
        const task = await createTask(squadLists['bks-executive-board'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** bks-executive-board\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Versão:** 1.0.0\n**Status:** Ativo`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // Campaign Vanguard agents
    const campaignAgents = [
        { name: '🎯 performance_campaign_architect', role: 'Performance Campaign Architect', category: 'Orchestrator' },
        { name: '🕵️ media_intelligence_spy', role: 'Media Intelligence Spy', category: 'Intelligence' },
    ];

    for (const agent of campaignAgents) {
        const task = await createTask(squadLists['bks-campaign-vanguard'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** bks-campaign-vanguard\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Versão:** 1.0.0\n**Status:** Ativo`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // DevOps agents
    const devopsAgents = [
        { name: '🔧 agent_doctor', role: 'AIOS Agent & Squad Debugger', category: 'DevOps' },
    ];

    for (const agent of devopsAgents) {
        const task = await createTask(squadLists['bks-devops'].id, {
            name: agent.name,
            description: `**Role:** ${agent.role}\n**Squad:** bks-devops\n**Categoria:** ${agent.category}\n**Modelo:** claude-sonnet-4-20250514\n**Versão:** 1.0.0\n**Status:** Ativo`,
            priority: 2,
            status: 'TO DO',
        });
        if (task) {
            await createChecklist(task.id, 'Auditoria Técnica', auditChecklist);
        }
        await sleep(500);
    }

    // 5. Create Documentation Lists
    console.log('\n📄 Creating documentation lists...\n');

    // Prompts
    const promptsList = await findOrCreateList(folderMap['Prompts'].id, 'Prompt Registry');
    await sleep(300);
    await createTask(promptsList.id, {
        name: '📋 Inventário Centralizado de Prompts',
        description: '**Total:** 93+ prompts catalogados\n\n**Classificações:**\n- System: 48\n- Instruction: 20+\n- Guardrail: 12\n- Decision: 8\n- Fallback: 2\n\n**STATUS:** ⚠️ NENHUM prompt tem versionamento formal.\n\n**RISCO CRÍTICO:** Matriz B2B Exent duplicada em 5 prompts diferentes.',
        priority: 1,
    });
    await sleep(500);

    // Database
    const dbList = await findOrCreateList(folderMap['Database'].id, 'Supabase Schema');
    await sleep(300);
    await createTask(dbList.id, {
        name: '🗄️ Schema SQL Supabase (14 tabelas)',
        description: '**Tabelas:**\n1. squads\n2. agents\n3. agent_versions\n4. agent_prompts\n5. agent_runs\n6. agent_memory\n7. agent_logs\n8. agent_costs\n9. agent_tools\n10. agent_dependencies\n11. squad_agents\n12. environment_variables\n13. integrations\n14. observability_events\n\n**Inclui:** PKs, FKs, Índices, Constraints, RLS Policies, Audit Triggers, Seed Data.\n\n**STATUS:** SQL pronto para execução.',
        priority: 1,
    });
    await sleep(500);

    // Integrations
    const intList = await findOrCreateList(folderMap['Integrations'].id, 'Integration Registry');
    await sleep(300);
    const integrations = [
        { name: '✅ ClickUp Integration', desc: 'Status: ACTIVE. Config: clients/clickup_ops.yaml. 407 linhas de configuração operacional.' },
        { name: '✅ GitHub Integration', desc: 'Status: ACTIVE. 15 CI/CD workflows. 14 agents. Dependabot ativo.' },
        { name: '⚠️ Meta Ads Integration', desc: 'Status: PLANNED. Variáveis faltando no .env. CRÍTICA para squads de tráfego.' },
        { name: '⚠️ Canva Integration', desc: 'Status: PLANNED. Bridge implementado mas API key ausente.' },
        { name: '⚠️ Supabase Integration', desc: 'Status: PLANNED. 5 variáveis no .env.example. Zero configuração real. BLOQUEANTE.' },
        { name: '⚠️ NotebookLM Integration', desc: 'Status: PARTIAL. PowerShell scripts existem mas integração é manual.' },
    ];

    for (const int of integrations) {
        await createTask(intList.id, { name: int.name, description: int.desc, priority: 2 });
        await sleep(400);
    }

    // Risks
    const risksList = await findOrCreateList(folderMap['Risks'].id, 'Risk Registry');
    await sleep(300);
    const risks = [
        { name: '🔴 3 Agentes Órfãos (existem YAML mas não no squad)', priority: 1 },
        { name: '🔴 48 Prompts sem Versionamento', priority: 1 },
        { name: '🔴 31 Agentes sem Output Contract', priority: 1 },
        { name: '🔴 6+ Variáveis de Ambiente Descontroladas', priority: 1 },
        { name: '🟡 Memória sem Persistência (apenas Markdown)', priority: 2 },
        { name: '🟡 Matriz B2B Duplicada em 5 Locais (drift risk)', priority: 2 },
        { name: '🟡 Modelo Inconsistente (env vs yaml)', priority: 2 },
        { name: '🟡 68 Scripts sem Documentação', priority: 3 },
        { name: '🟡 Observabilidade: Spec Existe mas Não Implementada', priority: 2 },
        { name: '🟡 Nenhum Agente tem Fallback Model Configurado', priority: 2 },
    ];

    for (const risk of risks) {
        await createTask(risksList.id, { name: risk.name, priority: risk.priority });
        await sleep(400);
    }

    // Governance
    const govList = await findOrCreateList(folderMap['Governance'].id, 'Governance Documents');
    await sleep(300);
    const govDocs = [
        'Constitution v1.0.0',
        'Agent Output Contracts',
        'Permission Matrix',
        'Prompt Versioning & Rollback',
        'Commercial Claims Guardrails',
        'Operational Guardrails',
        'Security & Privacy Baseline',
    ];

    for (const doc of govDocs) {
        await createTask(govList.id, { name: `📜 ${doc}`, priority: 3 });
        await sleep(400);
    }

    // Policies
    const polList = await findOrCreateList(folderMap['Policies'].id, 'Operational Policies');
    await sleep(300);
    const policies = [
        'Retry & Fallback Policy',
        'Incident Response Playbook',
        'Observability Spec',
    ];

    for (const pol of policies) {
        await createTask(polList.id, { name: `📜 ${pol}`, priority: 3 });
        await sleep(400);
    }

    // Technical Debt
    const debtList = await findOrCreateList(folderMap['Technical Debt'].id, 'Debt Backlog');
    await sleep(300);
    const debts = [
        { name: '📌 Implementar prompt_version em todos os 48 YAMLs', priority: 1 },
        { name: '📌 Sincronizar .env com .env.example', priority: 1 },
        { name: '📌 Resolver 3 agentes órfãos', priority: 1 },
        { name: '📌 Criar contratos de output para 31 agentes', priority: 2 },
        { name: '📌 Extrair Matriz B2B para single-source-of-truth', priority: 2 },
        { name: '📌 Configurar e executar Supabase schema', priority: 2 },
        { name: '📌 Migrar memória .md para Supabase', priority: 2 },
        { name: '📌 Implementar observability hooks', priority: 3 },
        { name: '📌 Documentar 68 scripts operacionais', priority: 3 },
        { name: '📌 Implementar fallback model em agentes', priority: 3 },
        { name: '📌 Implementar cost tracking por agente', priority: 3 },
        { name: '📌 Implementar vector store para RAG', priority: 3 },
    ];

    for (const debt of debts) {
        await createTask(debtList.id, { name: debt.name, priority: debt.priority });
        await sleep(400);
    }

    // Improvements
    const impList = await findOrCreateList(folderMap['Improvements'].id, 'Improvement Backlog');
    await sleep(300);
    const improvements = [
        '🚀 Configurar Meta Ads API para tráfego pago operacional',
        '🚀 Implementar Supabase como banco de agentes',
        '🚀 Dashboard de Observabilidade em tempo real',
        '🚀 Vector Store para RAG (semantic search)',
        '🚀 Cost alerting por agente/squad',
        '🚀 Auto-versionamento de prompt via CI',
    ];

    for (const imp of improvements) {
        await createTask(impList.id, { name: imp, priority: 3 });
        await sleep(400);
    }

    console.log('\n=========================================');
    console.log('✅ UPLOAD COMPLETO!');
    console.log('=========================================');
    console.log(`Space: AIOS Infrastructure`);
    console.log(`Folders: ${folders.length}`);
    console.log(`Squad Lists: ${squads.length}`);
    console.log(`Total agent tasks: ~${growthOpsAgents.length + copyEliteAgents.length + salesPageAgents.length + execBoardAgents.length + campaignAgents.length + devopsAgents.length}`);
    console.log(`All tasks include Auditoria Técnica checklist (9 items)`);
}

main().catch(err => {
    console.error('❌ Fatal error:', err);
    process.exit(1);
});
