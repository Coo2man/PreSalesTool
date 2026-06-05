'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { UserRole } from '@/lib/auth';
import { setContextAction } from '@/app/actions';
import { rolesConfig } from '@/lib/roles';

interface ContextModalProps {
    onClose?: () => void;
    currentRole?: UserRole | null;
}

export default function ContextModal({ onClose, currentRole }: ContextModalProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const handleSelect = async (role: UserRole) => {
        if (role === currentRole && onClose) {
            onClose();
            return;
        }

        setIsSaving(true);
        try {
            await setContextAction(role);
            // Navigate to root dashboard to ensure fresh state/sidebar/tools
            window.location.href = '/';
        } catch (error) {
            console.error('Failed to set context:', error);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                        Welcome to PreSales Box
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Please select your primary consulting focus. This will customize your experience and ensure tools are relevant to your daily tasks.
                    </p>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors z-20"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {rolesConfig.map((role) => (
                        <button
                            key={role.id}
                            disabled={isSaving}
                            onClick={() => handleSelect(role.id)}
                            className={`group flex flex-col items-center text-center p-8 rounded-2xl border transition-all duration-300 ${isSaving
                                ? 'opacity-50 cursor-not-allowed border-border bg-card'
                                : currentRole === role.id
                                    ? 'border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background'
                                    : 'border-border bg-card hover:bg-accent hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 cursor-pointer'
                                }`}
                        >
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-sm ${currentRole === role.id ? 'bg-primary/20 text-primary' : 'bg-muted group-hover:bg-background'}`}>
                                {role.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 transition-colors ${currentRole === role.id ? 'text-primary' : 'group-hover:text-primary'}`}>{role.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {role.description}
                            </p>
                        </button>
                    ))}
                </div>

                {isSaving && (
                    <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20 backdrop-blur-sm">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
