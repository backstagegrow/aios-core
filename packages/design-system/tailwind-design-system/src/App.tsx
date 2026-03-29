import React from 'react';
import { Button } from './components/Button';
import { Icon } from './components/Icon';
import { Input } from './components/Input';
import { Select } from './components/Select';
import { Checkbox } from './components/Checkbox';
import { Radio } from './components/Radio';
import { ComponentShowcase } from './components/CodeBlock';
import { Navigation } from './components/Navigation';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 pb-24">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-6 pt-12">
        <header className="mb-16">
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Design System</h1>
          <p className="text-lg text-zinc-600 max-w-2xl">
            A comprehensive design system built with Tailwind CSS and React. Features accessible, reusable components with consistent design tokens.
          </p>
        </header>

        {/* Foundation Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-8 pb-2 border-b border-zinc-200">Foundation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Colors */}
            <div>
              <h3 className="text-lg font-medium text-zinc-900 mb-4">Colors</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">Zinc (Primary Neutral)</div>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                      <div key={weight} className={`flex-1 bg-zinc-${weight}`} title={`zinc-${weight}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">Indigo (Brand)</div>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                      <div key={weight} className={`flex-1 bg-indigo-${weight}`} title={`indigo-${weight}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-500 mb-2">Red (Destructive/Error)</div>
                  <div className="flex h-10 rounded-lg overflow-hidden">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                      <div key={weight} className={`flex-1 bg-red-${weight}`} title={`red-${weight}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div>
              <h3 className="text-lg font-medium text-zinc-900 mb-4">Typography</h3>
              <div className="space-y-4 bg-white p-6 rounded-xl border border-zinc-200">
                <div>
                  <div className="text-4xl font-bold text-zinc-900">Heading 1</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">text-4xl font-bold</div>
                </div>
                <div>
                  <div className="text-2xl font-semibold text-zinc-900">Heading 2</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">text-2xl font-semibold</div>
                </div>
                <div>
                  <div className="text-lg font-medium text-zinc-900">Heading 3</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">text-lg font-medium</div>
                </div>
                <div>
                  <div className="text-base text-zinc-700">Body text (Base)</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">text-base</div>
                </div>
                <div>
                  <div className="text-sm text-zinc-600">Small text</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">text-sm</div>
                </div>
              </div>
            </div>
            
            {/* Spacing & Radius */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4">Border Radius</h3>
                <div className="flex flex-wrap gap-4">
                  {[
                    { label: 'none', class: 'rounded-none' },
                    { label: 'sm', class: 'rounded-sm' },
                    { label: 'md', class: 'rounded-md' },
                    { label: 'lg', class: 'rounded-lg' },
                    { label: 'xl', class: 'rounded-xl' },
                    { label: '2xl', class: 'rounded-2xl' },
                    { label: 'full', class: 'rounded-full' },
                  ].map((radius) => (
                    <div key={radius.label} className="flex flex-col items-center gap-2">
                      <div className={`w-16 h-16 bg-indigo-100 border border-indigo-200 ${radius.class}`} />
                      <span className="text-xs font-mono text-zinc-500">{radius.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-zinc-900 mb-4">Spacing Scale</h3>
                <div className="space-y-2">
                  {[
                    { size: '4', px: '16px' },
                    { size: '8', px: '32px' },
                    { size: '12', px: '48px' },
                    { size: '16', px: '64px' },
                  ].map((space) => (
                    <div key={space.size} className="flex items-center gap-4">
                      <div className="w-12 text-xs font-mono text-zinc-500 text-right">{space.size}</div>
                      <div className={`h-4 bg-indigo-200 rounded-sm w-${space.size}`} />
                      <div className="text-xs text-zinc-400">{space.px}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section>
          <h2 className="text-2xl font-semibold text-zinc-900 mb-8 pb-2 border-b border-zinc-200">Components</h2>

          <ComponentShowcase
            title="Buttons"
            description="Button components in different variants and sizes. Includes hover, active, focus, and disabled states."
            code={`import { Button } from './components/Button';
import { Icon } from './components/Icon';

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With Icons
<Button>
  <Icon name="add" size={20} />
  Add Item
</Button>

// States
<Button disabled>Disabled</Button>`}
          >
            <div className="flex flex-col gap-8 w-full max-w-2xl">
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" disabled>Disabled</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">
                  <Icon name="add" size={20} />
                  Add Item
                </Button>
                <Button variant="outline">
                  <Icon name="settings" size={20} />
                  Settings
                </Button>
                <Button variant="ghost" className="!px-2">
                  <Icon name="more_vert" size={20} />
                </Button>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase
            title="Icons"
            description="Material Symbols Rounded (Weight 200). Available in multiple sizes."
            code={`import { Icon } from './components/Icon';

<Icon name="home" size={16} />
<Icon name="search" size={20} />
<Icon name="settings" size={24} />
<Icon name="favorite" size={32} />
<Icon name="account_circle" size={40} />`}
          >
            <div className="flex items-end gap-8 text-zinc-700">
              <div className="flex flex-col items-center gap-2">
                <Icon name="home" size={16} />
                <span className="text-xs font-mono text-zinc-400">16px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="search" size={20} />
                <span className="text-xs font-mono text-zinc-400">20px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="settings" size={24} />
                <span className="text-xs font-mono text-zinc-400">24px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="favorite" size={32} />
                <span className="text-xs font-mono text-zinc-400">32px</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon name="account_circle" size={40} />
                <span className="text-xs font-mono text-zinc-400">40px</span>
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase
            title="Inputs"
            description="Text inputs with support for labels, icons, errors, and disabled states."
            code={`import { Input } from './components/Input';

<Input 
  label="Email address" 
  type="email" 
  placeholder="you@example.com" 
/>

<Input 
  label="Search" 
  icon="search" 
  placeholder="Search users..." 
/>

<Input 
  label="Username" 
  error="This username is already taken." 
  defaultValue="johndoe" 
/>

<Input 
  label="Disabled Input" 
  disabled 
  value="Cannot edit this" 
/>`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Input label="Email address" type="email" placeholder="you@example.com" />
              <Input label="Search" icon="search" placeholder="Search users..." />
              <Input label="Username" error="This username is already taken." defaultValue="johndoe" />
              <Input label="Disabled Input" disabled value="Cannot edit this" />
            </div>
          </ComponentShowcase>

          <ComponentShowcase
            title="Select & Dropdowns"
            description="Native select component styled to match the design system."
            code={`import { Select } from './components/Select';

<Select
  label="Project Status"
  options={[
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'completed', label: 'Completed' },
  ]}
  defaultValue="active"
/>

<Select
  label="Error State"
  error="Please select a valid option."
  options={[{ value: '1', label: 'Option 1' }]}
/>`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
              <Select
                label="Project Status"
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'paused', label: 'Paused' },
                  { value: 'completed', label: 'Completed' },
                ]}
                defaultValue="active"
              />
              <Select
                label="Disabled Select"
                disabled
                options={[{ value: '1', label: 'Option 1' }]}
                defaultValue="1"
              />
            </div>
          </ComponentShowcase>

          <ComponentShowcase
            title="Checkboxes & Radio Buttons"
            description="Custom styled form controls with support for descriptions."
            code={`import { Checkbox } from './components/Checkbox';
import { Radio } from './components/Radio';

// Checkboxes
<Checkbox 
  label="Enable notifications" 
  description="Get notified when someone mentions you." 
/>
<Checkbox label="Disabled checked" disabled checked />

// Radio Buttons
<Radio 
  name="plan" 
  label="Pro Plan" 
  description="$12/month per user" 
/>
<Radio name="plan" label="Disabled option" disabled />`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-2xl">
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Checkboxes</h4>
                <Checkbox label="Accept terms and conditions" />
                <Checkbox 
                  label="Enable notifications" 
                  description="Get notified when someone mentions you." 
                  defaultChecked
                />
                <Checkbox label="Disabled checked" disabled defaultChecked />
                <Checkbox label="Disabled unchecked" disabled />
              </div>
              
              <div className="flex flex-col gap-4">
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Radio Buttons</h4>
                <Radio name="plan" label="Basic Plan" description="Free forever" />
                <Radio name="plan" label="Pro Plan" description="$12/month per user" defaultChecked />
                <Radio name="plan_disabled" label="Disabled selected" disabled defaultChecked />
                <Radio name="plan_disabled" label="Disabled unselected" disabled />
              </div>
            </div>
          </ComponentShowcase>

          <ComponentShowcase
            title="Navigation / Menu"
            description="A responsive top navigation bar with search and actions."
            code={`import { Navigation } from './components/Navigation';

// See src/components/Navigation.tsx for full implementation
<Navigation />`}
          >
            <div className="w-full border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <Navigation />
              <div className="bg-zinc-50 h-32 flex items-center justify-center text-zinc-400 text-sm">
                Page Content Area
              </div>
            </div>
          </ComponentShowcase>

        </section>
      </main>
    </div>
  );
}

