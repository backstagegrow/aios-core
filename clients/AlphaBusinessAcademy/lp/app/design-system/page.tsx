'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette,
    Type,
    Component,
    Ruler,
    FileText,
    ChevronRight,
    Layout,
    Layers,
    Sparkles,
    ExternalLink,
    Github,
    Info,
    Search,
    Moon,
    Sun,
    Code2,
    Eye,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    Construction,
    MoreHorizontal,
    Wand2,
    Settings2,
    Check
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Dropdown } from '../components/ui/Dropdown';

// --- Types & Data ---
type Tab = 'Brand' | 'Colors' | 'Typography' | 'Spacing' | 'Buttons' | 'Inputs' | 'Cards' | 'Modals' | 'Navigation' | 'Documentation';

interface SidebarItem {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    status: 'Ready' | 'Beta' | 'WIP';
}

interface SidebarCategory {
    title: string;
    items: SidebarItem[];
}

const SIDEBAR_STRUCTURE: SidebarCategory[] = [
    {
        title: 'FOUNDATIONS',
        items: [
            { id: 'Brand', label: 'Identidade de Marca', icon: <Wand2 size={16} />, status: 'Ready' },
            { id: 'Colors', label: 'Cores Semânticas', icon: <Palette size={16} />, status: 'Ready' },
            { id: 'Typography', label: 'Tipografia', icon: <Type size={16} />, status: 'Ready' },
            { id: 'Spacing', label: 'Espaçamento', icon: <Ruler size={16} />, status: 'Ready' },
        ]
    },
    {
        title: 'UI COMPONENTS',
        items: [
            { id: 'Buttons', label: 'Botões', icon: <Component size={16} />, status: 'Ready' },
            { id: 'Inputs', label: 'Inputs', icon: <Layers size={16} />, status: 'Ready' },
            { id: 'Cards', label: 'Cards', icon: <Layout size={16} />, status: 'Beta' },
            { id: 'Modals', label: 'Modais', icon: <FileText size={16} />, status: 'Beta' },
        ]
    },
    {
        title: 'PATTERNS',
        items: [
            { id: 'Navigation', label: 'Navegação', icon: <ChevronRight size={16} />, status: 'WIP' },
        ]
    },
    {
        title: 'RESOURCES',
        items: [
            { id: 'Documentation', label: 'Documentação', icon: <BookOpen size={16} />, status: 'Ready' },
        ]
    }
];

// --- Animations ---
const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as any }
};

const containerStagger = {
    animate: {
        transition: {
            staggerChildren: 0.05
        }
    }
};

// --- Main Component ---
export default function RefactoredDesignSystem() {
    const [activeTab, setActiveTab] = useState<Tab>('Brand');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Find active item info for breadcrumbs
    const activeItem = useMemo(() => {
        for (const cat of SIDEBAR_STRUCTURE) {
            const item = cat.items.find(i => i.id === activeTab);
            if (item) return { category: cat.title, ...item };
        }
        return null;
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-surface-page text-primary font-body flex overflow-hidden">
            {/* Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-action-primary/30 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-action-primary/20 rounded-full blur-[120px]" />
            </div>

            {/* Sidebar - SaaS Premium Style (260px) */}
            <aside className="w-[260px] h-screen border-r border-white/5 bg-surface-page/80 backdrop-blur-xl pt-6 px-4 flex flex-col z-20 sticky top-0 shrink-0">
                {/* Logo & Header Group */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 px-2 mb-2 group">
                        <div className="w-8 h-8 bg-action-primary rounded-lg flex items-center justify-center shadow-button-primary group-hover:rotate-6 transition-transform duration-500">
                            <Sparkles className="text-black w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-base font-bold uppercase tracking-tight leading-tight">Alpha DS</h1>
                            <p className="text-[10px] text-muted tracking-widest uppercase font-bold opacity-60">Official System</p>
                        </div>
                    </div>
                    <div className="px-2 pb-4 border-b border-white/[0.06] flex items-center justify-between">
                        <span className="text-[9px] text-muted font-mono opacity-50">Release v4.2.0</span>
                        <div className="flex gap-2">
                            <Moon size={12} className="text-muted cursor-pointer hover:text-action-primary transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Search Bar Placeholder */}
                <div className="px-2 mb-6">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-action-primary transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Buscar no sistema..."
                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none focus:border-action-primary/50 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Nav Groups */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
                    {SIDEBAR_STRUCTURE.map((category) => (
                        <div key={category.title} className="mb-8">
                            <h3 className="px-4 text-[10px] font-black tracking-[0.2em] text-muted/60 uppercase mb-3">
                                {category.title}
                            </h3>
                            <nav className="flex flex-col gap-[4px]">
                                {category.items.map((item) => (
                                    <NavItem
                                        key={item.id}
                                        icon={item.icon}
                                        label={item.label}
                                        active={activeTab === item.id}
                                        status={item.status}
                                        onClick={() => setActiveTab(item.id)}
                                    />
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Footer Link */}
                <div className="pt-4 border-t border-white/[0.06] mb-4">
                    <a href="#" className="flex items-center justify-between px-3 px-3 py-2 text-muted hover:text-primary transition-colors group text-[13px]">
                        <div className="flex items-center gap-3">
                            <Github size={14} />
                            <span>Repository</span>
                        </div>
                        <ExternalLink size={12} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                    </a>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-6 py-12 lg:px-12 z-10 custom-scrollbar">
                <div className="max-w-[1280px] mx-auto">
                    {/* Breadcrumbs & Page Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-muted uppercase tracking-widest mb-6 select-none">
                            <span>Design System</span>
                            <ChevronRight size={10} className="opacity-40" />
                            <span className="text-secondary">{activeItem?.category || 'General'}</span>
                            <ChevronRight size={10} className="opacity-40" />
                            <span className="text-action-primary font-bold">{activeItem?.label || activeTab}</span>
                        </div>

                        <div className="flex justify-between items-end border-b border-border-subtle pb-10">
                            <div>
                                <motion.h2
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-7xl font-black uppercase tracking-tighter leading-none"
                                >
                                    {activeItem?.label || activeTab}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-6 text-secondary text-lg max-w-xl leading-relaxed"
                                >
                                    Documentação técnica e padrões de design para a categoria <span className="text-primary font-semibold">{activeItem?.label}</span>.
                                </motion.p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                                {activeItem?.status && (
                                    <StatusBadge status={activeItem.status} />
                                )}
                                <div className="text-[10px] uppercase font-bold text-muted tracking-widest opacity-40">
                                    Last Sync: Now
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="mt-8"
                        >
                            {activeTab === 'Brand' && <BrandSection />}
                            {activeTab === 'Colors' && <ColorsSection />}
                            {activeTab === 'Typography' && <TypographySection />}
                            {activeTab === 'Spacing' && <SpacingSection />}
                            {activeTab === 'Buttons' && <ButtonsSection />}
                            {activeTab === 'Inputs' && <InputsSection />}
                            {activeTab === 'Documentation' && <DocumentationSection />}
                            {(activeTab === 'Cards' || activeTab === 'Modals' || activeTab === 'Navigation') && (
                                <WIPSection label={activeTab} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal for Demo */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="System Modal Layer">
                <div className="space-y-8 p-4">
                    <div className="w-full h-48 bg-gradient-to-br from-action-primary/20 via-surface-card to-surface-section rounded-3xl border border-action-primary/30 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--action-primary)_0%,_transparent_70%)] opacity-10 group-hover:opacity-20 transition-opacity" />
                        <Sparkles className="text-action-primary w-16 h-16 relative z-10" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-2xl font-black uppercase tracking-tight">Hierarquia de Camadas</h4>
                        <p className="text-secondary leading-relaxed">
                            Este contêiner utiliza o token de <code className="text-action-primary bg-action-primary/10 px-2 py-0.5 rounded">surface-elevated</code>.
                        </p>
                    </div>
                    <div className="flex justify-end gap-4 pt-8 border-t border-border-subtle">
                        <Button variant="secondary" size="md" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button size="md" onClick={() => setIsModalOpen(false)}>Confirmar Execução</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

// --- Status Badge ---
function StatusBadge({ status }: { status: SidebarItem['status'] }) {
    const config = {
        Ready: { icon: <CheckCircle2 size={12} />, class: 'text-status-success bg-status-success/10 border-status-success/20' },
        Beta: { icon: <AlertCircle size={12} />, class: 'text-status-warning bg-status-warning/10 border-status-warning/20' },
        WIP: { icon: <Construction size={12} />, class: 'text-muted bg-white/5 border-white/10' }
    };
    const { icon, class: className } = config[status];
    return (
        <div className={`px-3 py-1.5 border rounded-full flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${className}`}>
            {icon}
            <span>{status}</span>
        </div>
    );
}

// --- Sub-sections ---

function BrandSection() {
    const brandData = {
        client: "Alpha Business Academy",
        brand: {
            logo: "logo.svg",
            primaryColor: "#C9A24A",
            secondaryColor: "#1A1A1A",
            accentColor: "#F5F5F5",
            headingFont: "Inter",
            bodyFont: "Inter",
            radius: "12px",
            buttonStyle: "glass"
        }
    };

    return (
        <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-16">
            <section>
                <SectionHeader title="Brand Source of Truth" description="Esta é a camada de entrada do cliente. Qualquer alteração aqui reflete automaticamente nos tokens e componentes." />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Logo Preview */}
                    <Card className="p-8 flex flex-col items-center justify-center gap-6 bg-surface-card border-border-default h-full">
                        <div className="w-20 h-20 bg-action-primary rounded-2xl flex items-center justify-center shadow-glow">
                            <Sparkles className="text-black w-10 h-10" />
                        </div>
                        <div className="text-center">
                            <h4 className="font-black uppercase tracking-widest text-sm mb-1">Company Logo</h4>
                            <p className="text-xs text-muted font-mono">{brandData.brand.logo}</p>
                        </div>
                    </Card>

                    {/* Color Palette Wizard */}
                    <Card className="lg:col-span-2 p-10 bg-surface-card border-border-default">
                        <div className="flex justify-between items-start mb-8">
                            <h4 className="font-black uppercase tracking-widest text-sm">Primary Brand Palette</h4>
                            <div className="px-3 py-1 bg-action-primary/10 border border-action-primary/20 rounded-full text-[10px] text-action-primary font-bold uppercase tracking-widest">
                                Main Identity
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-6">
                            <BrandPaletteItem label="Primary" color={brandData.brand.primaryColor} active />
                            <BrandPaletteItem label="Secondary" color={brandData.brand.secondaryColor} />
                            <BrandPaletteItem label="Accent" color={brandData.brand.accentColor} />
                        </div>
                    </Card>
                </div>
            </section>

            <section>
                <SectionHeader title="Implementation Pipeline" description="Como os dados da marca são processados pelo sistema local." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <PipelineStep icon={<Settings2 size={18} />} title="Brand Input" description="Define cores e fontes globais do cliente." status="Source" />
                    <ChevronRight className="hidden lg:block self-center opacity-20" size={24} />
                    <PipelineStep icon={<Layers size={18} />} title="Design Tokens" description="Transforma marca em variáveis CSS/Tailwind." status="Syncing" />
                    <ChevronRight className="hidden lg:block self-center opacity-20" size={24} />
                    <PipelineStep icon={<Sparkles size={18} />} title="Live UI" description="Componentes brilham com a nova identidade." status="Active" />
                </div>
            </section>

            <section>
                <SectionHeader title="Brand Specifics" description="Regras geométricas e comportamentais exclusivas desta marca." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-8 bg-surface-card border-border-default">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Layout size={18} className="text-action-primary" />
                                <span className="font-bold uppercase tracking-widest text-xs">Corner Radius</span>
                            </div>
                            <code className="text-xs font-mono bg-white/5 px-2 py-1 rounded">{brandData.brand.radius}</code>
                        </div>
                        <div className="h-24 bg-action-primary/10 border-2 border-dashed border-action-primary/30 flex items-center justify-center" style={{ borderRadius: brandData.brand.radius }}>
                            <span className="text-[10px] font-black uppercase tracking-widest text-action-primary">Preview Radius</span>
                        </div>
                    </Card>

                    <Card className="p-8 bg-surface-card border-border-default">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Type size={18} className="text-action-primary" />
                                <span className="font-bold uppercase tracking-widest text-xs">Primary Typography</span>
                            </div>
                            <code className="text-xs font-mono bg-white/5 px-2 py-1 rounded">{brandData.brand.headingFont}</code>
                        </div>
                        <p className="text-4xl font-black uppercase tracking-tighter" style={{ fontFamily: `var(--font-family-heading)` }}>
                            Branding Typography
                        </p>
                    </Card>
                </div>
            </section>
        </motion.div>
    );
}

function BrandPaletteItem({ label, color, active }: any) {
    return (
        <div className="flex flex-col gap-3 group cursor-pointer">
            <div
                className={`w-24 h-24 rounded-2xl border-4 transition-all ${active ? 'border-action-primary shadow-glow scale-105' : 'border-white/5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}`}
                style={{ backgroundColor: color }}
            />
            <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
                <code className="text-[9px] font-mono text-muted">{color}</code>
            </div>
        </div>
    );
}

function PipelineStep({ icon, title, description, status }: any) {
    return (
        <Card className="p-6 bg-white/[0.02] border-border-subtle group hover:border-action-primary/30 transition-all">
            <div className="w-10 h-10 bg-action-primary/10 rounded-xl flex items-center justify-center text-action-primary mb-4 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h5 className="text-[11px] font-black uppercase tracking-widest text-primary mb-2">{title}</h5>
            <p className="text-xs text-secondary leading-relaxed mb-4">{description}</p>
            <div className="flex items-center gap-2">
                <Check size={10} className="text-action-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted">{status}</span>
            </div>
        </Card>
    );
}

function ColorsSection() {
    return (
        <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-16">
            <section>
                <SectionHeader title="Action & Branding" description="Cores primárias de interação. Usadas para CTAs, links ativos e estados de foco." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ColorCard name="Primary" variable="--action-primary" bg="bg-action-primary" text="text-black" />
                    <ColorCard name="Hover" variable="--action-primary-hover" bg="bg-action-primary-hover" text="text-black" />
                    <ColorCard name="Active" variable="--action-primary-active" bg="bg-action-primary-active" text="text-black" />
                    <ColorCard name="Strong" variable="--action-strong" bg="bg-action-strong" text="text-black" />
                </div>
            </section>

            <section>
                <SectionHeader title="Surface & Deep Layers" description="Definição de profundidade e background da interface. Use surface levels para criar separação." />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <ColorCard name="Level 0: Page" variable="--surface-page" bg="bg-surface-page" border="border-border-subtle" />
                    <ColorCard name="Level 1: Section" variable="--surface-section" bg="bg-surface-section" border="border-border-default" />
                    <ColorCard name="Level 2: Card" variable="--surface-card" bg="bg-surface-card" border="border-border-default" />
                    <ColorCard name="Level 3: Elevated" variable="--surface-elevated" bg="bg-surface-elevated" border="border-border-subtle" shadow="shadow-card" />
                </div>
            </section>
        </motion.div>
    );
}

function TypographySection() {
    return (
        <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-16">
            {/* Project Config Section */}
            <section>
                <SectionHeader title="Project Typography Config" description="Configuração de fontes aplicada a este projeto via tokens semânticos." />
                <Card className="overflow-hidden border-border-subtle bg-white/[0.02]">
                    <div className="grid grid-cols-3 bg-white/[0.04] p-4 text-[10px] font-black uppercase tracking-widest text-muted border-b border-white/[0.06]">
                        <span>Token</span>
                        <span>Assign Font</span>
                        <span>Sample</span>
                    </div>
                    <div className="divide-y divide-white/[0.06]">
                        <FontConfigRow token="--font-family-heading" font="Inter" sample="The quick brown fox" class="font-heading" />
                        <FontConfigRow token="--font-family-body" font="Inter" sample="Jumps over the lazy dog" class="font-body" />
                        <FontConfigRow token="--font-family-mono" font="JetBrains Mono" sample="console.log(ds_active)" class="font-mono" />
                    </div>
                </Card>
            </section>

            <section>
                <SectionHeader title="Font Scale & Semantic Tokens" description="Escala tipográfica consolidada que combina tamanho, peso e espaçamento." />
                <div className="space-y-2 bg-surface-card rounded-[2rem] border border-border-default overflow-hidden p-2">
                    <TypeScaleRow label="Heading XL" token="--font-heading-xl" className="text-6xl font-black uppercase tracking-tighter" sample="Impact Headline" />
                    <TypeScaleRow label="Heading LG" token="--font-heading-lg" className="text-4xl font-bold tracking-tight" sample="Section Header Large" />
                    <TypeScaleRow label="Heading MD" token="--font-heading-md" className="text-2xl font-semibold tracking-tight" sample="Sub-section heading" />
                    <TypeScaleRow label="Body Large" token="--font-body-lg" className="text-lg leading-relaxed" sample="Developing the leaders of the economy." />
                    <TypeScaleRow label="Body Normal" token="--font-body-md" className="text-base leading-normal" sample="Developing the leaders of the economy." />
                    <TypeScaleRow label="Caption" token="--font-caption" className="text-xs leading-tight text-secondary" sample="Small footnote or helper text" />
                </div>
            </section>
        </motion.div>
    );
}

function ButtonsSection() {
    return (
        <ComponentDocTemplate
            title="Action Buttons"
            description="Componente principal para chamadas de ação e gatilhos de fluxo."
            preview={
                <div className="flex flex-wrap gap-8 items-center justify-center p-12">
                    <Button>Primary Action</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="strong">Strong Action</Button>
                </div>
            }
            code={`<Button variant="primary">Primary</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="strong">Strong</Button>`}
            guidelines="Use botões primários apenas uma vez por seção visual para manter o foco. O contraste deve ser acessível (AA)."
        />
    );
}

function InputsSection() {
    return (
        <ComponentDocTemplate
            title="Text Inputs"
            description="Campos de entrada de dados com suporte a validação e labels semânticos."
            preview={
                <div className="max-w-md w-full mx-auto space-y-8 p-12">
                    <Input label="Nome Completo" placeholder="Ex: John Doe" />
                    <Input label="E-mail" value="invalid-email" error="Formato de e-mail inválido" readOnly />
                </div>
            }
            code={`<Input label="Name" placeholder="..." />\n<Input error="Field required" />`}
            guidelines="Sempre inclua labels descritivos. Use placeholders apenas para exemplos de preenchimento."
        />
    );
}

function SpacingSection() {
    return (
        <motion.div variants={containerStagger} className="max-w-3xl space-y-12">
            <SectionHeader title="Spacing Scale" description="Baseado em sistema de 4px (Soft Grid) para alinhamento matemático perfeito." />
            <Card className="p-12 bg-surface-card border border-border-default space-y-12">
                {[
                    { label: 'space-4', val: '16px', w: 'w-4' },
                    { label: 'space-8', val: '32px', w: 'w-8' },
                    { label: 'space-12', val: '48px', w: 'w-12' },
                    { label: 'space-16', val: '64px', w: 'w-16' },
                ].map((item) => (
                    <div key={item.label} className="flex items-center gap-12 group">
                        <div className={`h-8 rounded-xl bg-action-primary ${item.w} shadow-glow transition-all group-hover:scale-x-125 origin-left`} />
                        <div className="flex-1 border-b border-border-subtle pb-2 flex justify-between items-baseline">
                            <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs text-muted font-mono">{item.val}</span>
                        </div>
                    </div>
                ))}
            </Card>
        </motion.div>
    );
}

function WIPSection({ label }: { label: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10">
                <Construction size={40} className="text-muted" />
            </div>
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">{label} is coming</h3>
            <p className="text-muted max-w-sm">Estamos finalizando a documentação técnica deste módulo. Em breve estará disponível.</p>
        </div>
    );
}

function DocumentationSection() {
    return (
        <motion.div variants={fadeIn} className="max-w-5xl">
            <Card className="p-16 bg-gradient-to-br from-surface-card to-surface-section border-2 border-border-default rounded-[3rem] relative overflow-hidden">
                <div className="relative z-10 space-y-12 text-center max-w-2xl mx-auto">
                    <Sparkles className="mx-auto text-action-primary mb-8" size={64} />
                    <h3 className="text-5xl font-black uppercase tracking-tighter">Design for Production</h3>
                    <p className="text-secondary text-lg leading-loose">
                        Este sistema foi construído para ser escalável e agnóstico ao projeto através do uso rigoroso de **Tokens Semânticos**.
                        Nenhum valor fixo de cor ou fonte deve ser injetado nos componentes fora da camada de tokens.
                    </p>
                    <div className="pt-8">
                        <Button size="lg" className="w-full sm:w-auto">Baixar Tokens (JSON)</Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

// --- Internal Helper Components ---

function NavItem({ icon, label, active, status, onClick }: { icon: React.ReactNode, label: string, active: boolean, status: SidebarItem['status'], onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-between w-full text-left h-10 px-[14px] rounded-[10px] 
                text-[14px] font-medium tracking-[0.02em] transition-all duration-120 
                relative group overflow-hidden select-none outline-none
                ${active
                    ? 'text-black opacity-100 shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'text-primary opacity-60 hover:opacity-100 hover:bg-white/5 hover:translate-x-[2px]'
                }
            `}
        >
            {active && (
                <motion.div
                    layoutId="activeNavItemBG"
                    className="absolute inset-0 bg-action-primary z-0"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 40 }}
                />
            )}
            <div className="relative z-10 flex items-center gap-[10px]">
                <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {icon}
                </span>
                <span className="truncate">{label}</span>
            </div>
            {status !== 'Ready' && !active && (
                <div className={`relative z-10 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${status === 'Beta' ? 'text-status-warning border-status-warning/20' : 'text-muted border-white/5'}`}>
                    {status}
                </div>
            )}
        </button>
    );
}

function SectionHeader({ title, description }: { title: string, description: string }) {
    return (
        <div className="mb-8">
            <h3 className="text-xs text-action-primary font-black uppercase tracking-[0.5em] mb-3">{title}</h3>
            <p className="text-secondary text-base max-w-2xl leading-relaxed">{description}</p>
        </div>
    );
}

function FontConfigRow({ token, font, sample, class: className }: any) {
    return (
        <div className="grid grid-cols-3 p-4 items-center group hover:bg-white/[0.01] transition-colors">
            <code className="text-[11px] text-action-primary font-mono">{token}</code>
            <span className="text-sm border-l border-white/[0.06] pl-4 font-bold">{font}</span>
            <span className={`text-base border-l border-white/[0.06] pl-4 truncate ${className}`}>{sample}</span>
        </div>
    );
}

function TypeScaleRow({ label, token, className, sample }: any) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 hover:bg-surface-section/50 transition-colors group border-b border-white/[0.04] last:border-0">
            <div className="flex flex-col gap-2 min-w-[140px]">
                <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-black">{label}</span>
                <code className="text-[10px] text-action-primary font-mono opacity-60">{token}</code>
            </div>
            <p className={`flex-1 ${className} transition-colors duration-500 group-hover:text-action-primary truncate`}>
                {sample}
            </p>
        </div>
    );
}

function ComponentDocTemplate({ title, description, preview, code, guidelines }: any) {
    const [view, setView] = useState<'preview' | 'code' | 'guidelines'>('preview');

    return (
        <motion.section variants={fadeIn} className="space-y-8 mb-24">
            <SectionHeader title={title} description={description} />

            <Card className="overflow-hidden bg-surface-card/40 backdrop-blur-sm border-border-subtle rounded-[2rem]">
                {/* Tabs Header */}
                <div className="flex items-center gap-1 bg-white/[0.03] border-b border-white/[0.06] p-1.5">
                    <TabButton active={view === 'preview'} onClick={() => setView('preview')} icon={<Eye size={14} />} label="Preview" />
                    <TabButton active={view === 'code'} onClick={() => setView('code')} icon={<Code2 size={14} />} label="Code" />
                    <TabButton active={view === 'guidelines'} onClick={() => setView('guidelines')} icon={<Info size={14} />} label="Guidelines" />
                </div>

                {/* Content Area */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {view === 'preview' && (
                            <motion.div key="preview" {...fadeIn} className="p-4 h-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[length:24px_24px]">
                                {preview}
                            </motion.div>
                        )}
                        {view === 'code' && (
                            <motion.div key="code" {...fadeIn} className="p-8 h-full">
                                <pre className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm leading-relaxed overflow-x-auto custom-scrollbar">
                                    <code className="text-action-primary">{code}</code>
                                </pre>
                            </motion.div>
                        )}
                        {view === 'guidelines' && (
                            <motion.div key="guidelines" {...fadeIn} className="p-12 h-full max-w-2xl">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Sparkles size={20} className="text-action-primary" />
                                        <h4 className="font-black uppercase tracking-widest text-sm">Best Practices</h4>
                                    </div>
                                    <p className="text-secondary leading-loose italic underline-offset-8 decoration-action-primary/20 decoration-2 underline">
                                        &ldquo;{guidelines}&rdquo;
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </motion.section>
    );
}

function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${active ? 'bg-action-primary text-black shadow-lg' : 'text-muted hover:bg-white/5'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function ColorCard({ name, variable, bg, text = 'text-primary', border = 'border-border-subtle', shadow }: any) {
    return (
        <div className="group space-y-4">
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className={`h-40 rounded-[2rem] border ${border} ${bg} ${shadow} flex items-center justify-center p-8 transition-shadow group-hover:shadow-card-hover relative overflow-hidden`}
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className={`text-xs font-black uppercase text-center tracking-widest ${text} relative z-10`}>{name}</span>
            </motion.div>
            <div className="px-2">
                <code className="text-[10px] text-muted font-mono bg-white/5 py-1 px-2 rounded-lg">{variable}</code>
            </div>
        </div>
    );
}
