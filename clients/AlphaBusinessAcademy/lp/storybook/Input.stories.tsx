import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../app/components/ui/Input';

const meta: Meta<typeof Input> = {
    title: 'Design System/Input',
    component: Input,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Campo de texto com suporte a labels e mensagens de erro, utilizando border-focus para acessibilidade e tokens de status para erros.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
    args: {
        placeholder: 'Digite seu nome',
    },
};

export const WithLabel: Story = {
    args: {
        label: 'Nome Completo',
        placeholder: 'Jane Doe',
    },
};

export const WithError: Story = {
    args: {
        label: 'Email',
        placeholder: 'jane@example.com',
        error: 'E-mail inválido. Tente novamente.',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Empresa',
        placeholder: 'Alpha Business',
        disabled: true,
    },
};
