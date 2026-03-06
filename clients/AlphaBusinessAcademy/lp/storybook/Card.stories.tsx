import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../app/components/ui/Card';

const meta: Meta<typeof Card> = {
    title: 'Design System/Card',
    component: Card,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Container base para agrupamento de informações, utilizando surface-card e tokens de sombra para elevação.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    args: {
        children: (
            <div className="text-primary">
                <h3 className="font-bold mb-space-2">Card Title</h3>
                <p className="text-secondary text-sm">This is a basic card using surface-card token.</p>
            </div>
        ),
    },
};

export const Elevated: Story = {
    args: {
        elevated: true,
        children: (
            <div className="text-primary">
                <h3 className="font-bold mb-space-2">Elevated Card</h3>
                <p className="text-secondary text-sm">Uses shadow-card and hover states for interactive surfaces.</p>
            </div>
        ),
    },
};
