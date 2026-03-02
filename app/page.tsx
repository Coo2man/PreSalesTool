import Link from 'next/link';
import { ArrowRight, Server, Zap, Shield, Banknote } from 'lucide-react';
import { cookies } from 'next/headers';
import { verifyContextToken } from '@/lib/auth';

export default async function Home() {
    const cookieStore = cookies();
    const contextCookie = cookieStore.get('presales_user_context');

    let role = null;
    if (contextCookie) {
        role = await verifyContextToken(contextCookie.value);
    }
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-border p-10 md:p-16 text-center md:text-left">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Accelerate Your PreSales Process
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Access powerful tools designed for consultants. Size servers instantly, calculate ROI, and compare competitors—all in one place.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link href="/sizing" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-primary/25">
                            Start Sizing <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="inline-flex items-center justify-center gap-2 bg-card text-card-foreground hover:bg-accent border border-border px-8 py-3 rounded-full font-medium transition-all">
                            View Documentation
                        </button>
                    </div>
                </div>

                {/* Decorative Grid */}
                <div className="absolute top-0 right-0 -m-16 opacity-10 pointer-events-none">
                    <svg width="400" height="400" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
            </section>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {role === 'Data Center Consultant' ? (
                    <>
                        <Link href="/sizing" className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                                <Server className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Server Sizing</h3>
                            <p className="text-muted-foreground text-sm">Calculate required hardware resources based on user load and workload type.</p>
                        </Link>

                        <Link href="/storage" className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Storage Sizer</h3>
                            <p className="text-muted-foreground text-sm">Forecast storage growth over time based on percentage or absolute values.</p>
                        </Link>

                        <Link href="/pricing" className="group p-6 rounded-2xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 text-green-500 group-hover:scale-110 transition-transform">
                                <Banknote className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">Listpreisrechner</h3>
                            <p className="text-muted-foreground text-sm">Ermitteln Sie EK- und VK-Preise auf Basis von Listenpreisen und Rabatten.</p>
                        </Link>

                        <div className="p-6 rounded-2xl border border-border bg-card/50 opacity-70 cursor-not-allowed hidden md:block">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Security Audit</h3>
                            <p className="text-muted-foreground text-sm">Quick checklist for security compliance. (Coming Soon)</p>
                        </div>
                    </>
                ) : (
                    <div className="col-span-1 md:col-span-3 p-12 text-center rounded-2xl border border-border bg-card border-dashed">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <Shield className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">No Tools Available</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Tools for your selected consultant context are currently in development. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
