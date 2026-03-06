import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../app/components/ui/Button';

const meta: Meta<typeof Button> = {
    title: 'Design System/Button',
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Botão semântico utilizando tokens action-primary, action-secondary e action-strong. Implementa estados de hover, active e disabled usando tokens de superfície e texto mutados.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Action Primary',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Action Secondary',
    },
};

export const Strong: Story = {
    args: {
        variant: 'strong',
        children: 'Action Strong',
    },
};

export const Disabled: Story = {
    args: {
        variant: 'primary',
        disabled: true,
        children: 'Disabled State',
    },
};
