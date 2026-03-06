import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from '../app/components/ui/Modal';
import { Button } from '../app/components/ui/Button';

const meta: Meta<typeof Modal> = {
    title: 'Design System/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Overlay modal utilizando overlay-backdrop e overlay-modal tokens. Inclui animações baseadas no token motion-normal.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
    args: {
        isOpen: true,
        title: 'Confirmação',
        onClose: () => console.log('closed'),
        children: (
            <div className="flex flex-col gap-space-6">
                <p>Tem certeza que deseja aplicar o novo Design System?</p>
                <div className="flex justify-end gap-space-4">
                    <Button variant="secondary" onClick={() => console.log('cancel')}>Cancelar</Button>
                    <Button variant="primary">Confirmar</Button>
                </div>
            </div>
        ),
    },
};
