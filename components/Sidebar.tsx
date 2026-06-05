"use client";

import Link from 'next/link';
import { LayoutDashboard, Server, Calculator, BarChart3, Settings, Database, Menu, X, Banknote, Percent } from 'lucide-react';
import { useState } from 'react';
import { UserRole } from '@/lib/auth';
import ContextModal from './ContextModal';
import { rolesConfig } from '@/lib/roles';

interface SidebarProps {
    userRole?: UserRole | null;
}

const Sidebar = ({ userRole }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showContextModal, setShowContextModal] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const currentRoleObj = rolesConfig.find(r => r.id === userRole);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-md shadow-lg"
                onClick={toggleSidebar}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 w-72 bg-card text-card-foreground border-r border-border flex flex-col shadow-lg transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-border pl-16 md:pl-6 flex items-center gap-3">
                    <img src="/logo.png" alt="PreSales Logo" className="h-10 w-auto object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            PreSales Box
                        </h1>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Consultant Workspace</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    <Link
                        href="/"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group"
                    >
                        <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</p>
                    </div>
                    {userRole === 'Data Center Consultant' ? (
                        <>
                            <Link
                                href="/sizing"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group"
                            >
                                <Server className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-medium">Server Sizing</span>
                            </Link>
                            <Link
                                href="/storage"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group"
                            >
                                <Database className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-medium">Storage Sizer</span>
                            </Link>
                            <Link
                                href="/pricing"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group"
                            >
                                <Banknote className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-medium">Listpreisrechner</span>
                            </Link>
                            <Link
                                href="/discount"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group"
                            >
                                <Percent className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <span className="font-medium">Rabattsatzrechner</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-muted-foreground/80 cursor-not-allowed transition-all opacity-70">
                                <Calculator className="w-5 h-5" />
                                <span className="font-medium">ROI Calculator</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-muted-foreground/80 cursor-not-allowed transition-all opacity-70">
                                <BarChart3 className="w-5 h-5" />
                                <span className="font-medium">Competitor Compare</span>
                            </Link>
                        </>
                    ) : (
                        <div className="px-4 py-3 text-sm text-muted-foreground/70 italic">
                            No tools available for this context yet.
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-border bg-muted/20">
                    <div
                        onClick={() => setShowContextModal(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                            {currentRoleObj ? (
                                <div className="scale-75">
                                    {currentRoleObj.icon}
                                </div>
                            ) : (
                                "SSE"
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold truncate max-w-[180px]">
                                {currentRoleObj?.title || userRole || "Consultant"}
                            </span>
                            <span className="text-xs text-muted-foreground">SSE - Solution Sales Experts</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Context Switch Modal */}
            {showContextModal && (
                <ContextModal
                    currentRole={userRole}
                    onClose={() => setShowContextModal(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
