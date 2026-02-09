import Link from 'next/link';
import { LayoutDashboard, Server, Calculator, BarChart3, Settings } from 'lucide-react';

const Sidebar = () => {
    return (
        <aside className="w-72 bg-card text-card-foreground h-screen border-r border-border flex flex-col shadow-lg z-10">
            <div className="p-6 border-b border-border">
                <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    PreSales Box
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Consultant Workspace</p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group">
                    <LayoutDashboard className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">Dashboard</span>
                </Link>
                <div className="px-4 pt-4 pb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tools</p>
                </div>
                <Link href="/sizing" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all group">
                    <Server className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-medium">Server Sizing</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-muted-foreground/80 cursor-not-allowed transition-all opacity-70">
                    <Calculator className="w-5 h-5" />
                    <span className="font-medium">ROI Calculator</span>
                </Link>
                <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-muted-foreground/80 cursor-not-allowed transition-all opacity-70">
                    <BarChart3 className="w-5 h-5" />
                    <span className="font-medium">Competitor Compare</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-border bg-muted/20">
                <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        YM
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">Yannik Meier</span>
                        <span className="text-xs text-muted-foreground">Pro Consultant</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
