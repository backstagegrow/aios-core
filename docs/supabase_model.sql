-- Fase 4: Modelagem Supabase do AIOS
-- Criação de tabelas obrigatórias

-- Habilitar a extensão pgcrypto para geração de UUIDs, se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabelas Principais

CREATE TABLE IF NOT EXISTS squads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    objective TEXT,
    strategic_role TEXT,
    fallback_strategy TEXT,
    memory_type VARCHAR(50), -- enum: short, long, vector, none
    observability_enabled BOOLEAN DEFAULT TRUE,
    cost_estimation_per_1k_tokens NUMERIC(10,5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS squad_agents (
    squad_id UUID REFERENCES squads(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    role VARCHAR(255),
    PRIMARY KEY (squad_id, agent_id)
);

-- 2. Versionamento e Prompts

CREATE TABLE IF NOT EXISTS agent_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    version_number VARCHAR(50) NOT NULL,
    changes_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    prompt_name VARCHAR(255),
    prompt_type VARCHAR(50), -- system, instruction, fallback, decision, guardrail
    content TEXT NOT NULL,
    version VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Histórico e Execução

CREATE TABLE IF NOT EXISTS agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    squad_id UUID REFERENCES squads(id) ON DELETE SET NULL,
    status VARCHAR(50), -- running, successful, failed
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    input_payload JSONB,
    output_payload JSONB,
    error_message TEXT
);

CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id UUID REFERENCES agent_runs(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    log_level VARCHAR(20), -- INFO, WARN, ERROR, DEBUG
    message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

CREATE TABLE IF NOT EXISTS agent_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    run_id UUID REFERENCES agent_runs(id),
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    total_cost NUMERIC(15, 6),
    model_version VARCHAR(100),
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_memory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    memory_key VARCHAR(255),
    memory_value JSONB,
    memory_type VARCHAR(50), -- short, long, context
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Integrações e Componentes Externos

CREATE TABLE IF NOT EXISTS agent_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    description TEXT,
    configuration JSONB
);

CREATE TABLE IF NOT EXISTS agent_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50), -- internal, external
    dependency_name VARCHAR(255),
    is_critical BOOLEAN DEFAULT FALSE,
    details JSONB
);

CREATE TABLE IF NOT EXISTS environment_variables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    security_level VARCHAR(50), -- public, secret, critical
    mapped_agents JSONB -- lista de nomes ou ids
);

CREATE TABLE IF NOT EXISTS integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    integration_type VARCHAR(50), -- API, DB, SaaS
    status VARCHAR(50) DEFAULT 'active',
    config_schema JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observability_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100), -- metric, alert, failure
    source VARCHAR(255),
    payload JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Habiitando RLS em tabelas criticas
ALTER TABLE environment_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_costs ENABLE ROW LEVEL SECURITY;

-- Políticas de Audit Logs para RLS
CREATE POLICY "Apenas admins podem visualizar vars de ambiente"
ON environment_variables FOR SELECT
USING (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'admin');

CREATE POLICY "Apenas admins podem visualizar integrations"
ON integrations FOR SELECT
USING (current_setting('request.jwt.claims', true)::jsonb->>'role' = 'admin');

-- Indices para Performance
CREATE INDEX idx_agents_name ON agents(name);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_logs_agent_id ON agent_logs(agent_id);
CREATE INDEX idx_agent_runs_agent_id ON agent_runs(agent_id);
CREATE INDEX idx_observability_timestamp ON observability_events(timestamp);

-- Audit Trigger (Exemplo genérico de atualização de 'updated_at')
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_update_agents
BEFORE UPDATE ON agents
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER trg_update_squads
BEFORE UPDATE ON squads
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
