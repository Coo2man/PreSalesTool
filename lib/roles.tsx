import { Server, Network, Building2 } from 'lucide-react';
import { UserRole } from '@/lib/auth';

export const rolesConfig: { id: UserRole; title: string; icon: React.ReactNode; description: string }[] = [
    {
        id: 'Data Center Consultant',
        title: 'Data Center Consultant',
        icon: <Server className="w-8 h-8 text-blue-500" />,
        description: 'Focus on compute, storage, virtualization, and backup solutions.'
    },
    {
        id: 'Network Consultant',
        title: 'Network Consultant',
        icon: <Network className="w-8 h-8 text-green-500" />,
        description: 'Focus on switching, routing, wireless, and network security.'
    },
    {
        id: 'Backoffice',
        title: 'Backoffice',
        icon: <Building2 className="w-8 h-8 text-purple-500" />,
        description: 'Administrative tasks, order processing, and general oversight.'
    }
];
