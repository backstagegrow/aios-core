import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '../app/components/ui/Dropdown';
import { Button } from '../app/components/ui/Button';

const meta: Meta<typeof Dropdown> = {
    title: 'Design System/Dropdown',
    component: Dropdown,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Menu suspenso utilizando overlay-popover token e animações motion-fast.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
    args: {
        trigger: <Button variant="secondary">Opções ▾</Button>,
        items: [
            { label: 'Perfil', onClick: () => console.log('Perfil clicked') },
            { label: 'Configurações', onClick: () => console.log('Config clicked') },
            { label: 'Sair', onClick: () => console.log('Sair clicked') },
        ],
    },
};
