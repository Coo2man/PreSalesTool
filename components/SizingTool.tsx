"use client";

import { useState, useEffect } from 'react';
import { Server, Cpu, Activity, AlertTriangle, Zap, Gauge, HardDrive, ShieldAlert } from 'lucide-react';

const SizingTool = () => {
    // Default values
    const defaultInputs = {
        // CPU Inputs
        serverCount: 8,
        socketsPerServer: 1,
        coresPerSocket: 16,
        clockSpeed: 2.8,
        peakCpuUsage: 347,
        isHA: false, // New: HA / 2 Brandabschnitte

        // RAM Inputs
        peakRamUsage: 3300,
        dimmCount: 12,
        dimmSize: 16
    };

    // Lazy initialization from localStorage
    const [inputs, setInputs] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sizing-tool-storage');
            if (saved) {
                try {
                    return { ...defaultInputs, ...JSON.parse(saved) };
                } catch (e) {
                    console.error("Failed to load persistence", e);
                }
            }
        }
        return defaultInputs;
    });

    const [results, setResults] = useState({
        totalCpuGHz: 0,
        loadPercentage: 0,
        nMinusOneGHz: 0,
        loadNMinusOnePercentage: 0,
        nHalfGHz: 0,
        loadNHalfPercentage: 0,

        ramPerServer: 0,
        totalRam: 0,
        loadRamPercentage: 0,
        nMinusOneRam: 0,
        loadNMinusOneRamPercentage: 0,
        nHalfRam: 0,
        loadNHalfRamPercentage: 0
    });

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('sizing-tool-storage', JSON.stringify(inputs));
        calculateSizing();
    }, [inputs]);

    const calculateSizing = () => {
        const {
            serverCount, socketsPerServer, coresPerSocket, clockSpeed, peakCpuUsage, isHA,
            peakRamUsage, dimmCount, dimmSize
        } = inputs;

        // Validation
        if (serverCount <= 0) return;

        // --- CPU Calculations ---
        const totalCpuGHz = serverCount * socketsPerServer * coresPerSocket * clockSpeed;
        const loadPercentage = totalCpuGHz > 0 ? (peakCpuUsage / totalCpuGHz) * 100 : 0;

        const oneServerCpu = totalCpuGHz / serverCount;
        const nMinusOneGHz = totalCpuGHz - oneServerCpu;
        const loadNMinusOnePercentage = nMinusOneGHz > 0 ? (peakCpuUsage / nMinusOneGHz) * 100 : 0;

        // HA / Site Failure (n/2)
        const nHalfGHz = totalCpuGHz / 2;
        const loadNHalfPercentage = nHalfGHz > 0 ? (peakCpuUsage / nHalfGHz) * 100 : 0;


        // --- RAM Calculations ---
        const ramPerServer = dimmCount * dimmSize;
        const totalRam = ramPerServer * serverCount;
        const loadRamPercentage = totalRam > 0 ? (peakRamUsage / totalRam) * 100 : 0;

        const nMinusOneRam = totalRam - ramPerServer;
        const loadNMinusOneRamPercentage = nMinusOneRam > 0 ? (peakRamUsage / nMinusOneRam) * 100 : 0;

        const nHalfRam = totalRam / 2;
        const loadNHalfRamPercentage = nHalfRam > 0 ? (peakRamUsage / nHalfRam) * 100 : 0;


        setResults({
            totalCpuGHz,
            loadPercentage,
            nMinusOneGHz,
            loadNMinusOnePercentage,
            nHalfGHz,
            loadNHalfPercentage,

            ramPerServer,
            totalRam,
            loadRamPercentage,
            nMinusOneRam,
            loadNMinusOneRamPercentage,
            nHalfRam,
            loadNHalfRamPercentage
        });
    };

    const handleInputChange = (field: string, value: any) => {
        setInputs((prev: any) => ({ ...prev, [field]: value }));
    };

    // Helper to format numbers
    const formatNumber = (num: number, decimals: number = 1) => {
        return num.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    };

    const formatPercent = (num: number) => {
        return num.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Section - Left Column */}
            <div className="lg:col-span-4 space-y-8">

                {/* CPU Configuration */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" /> CPU Configuration
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 pb-4 border-b border-border">
                            <input
                                type="checkbox"
                                id="isHA"
                                checked={inputs.isHA}
                                onChange={(e) => handleInputChange('isHA', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="isHA" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                HA (2 Brandabschnitte)
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Anzahl Server (Ist-Szenario)</label>
                            <input
                                type="number" min="1"
                                value={inputs.serverCount}
                                onChange={(e) => handleInputChange('serverCount', parseInt(e.target.value) || 0)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Sockets/Server</label>
                                <input
                                    type="number" min="1"
                                    value={inputs.socketsPerServer}
                                    onChange={(e) => handleInputChange('socketsPerServer', parseInt(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Cores/Socket</label>
                                <input
                                    type="number" min="1"
                                    value={inputs.coresPerSocket}
                                    onChange={(e) => handleInputChange('coresPerSocket', parseInt(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Taktung (GHz)</label>
                            <input
                                type="number" step="0.1" min="0.1"
                                value={inputs.clockSpeed}
                                onChange={(e) => handleInputChange('clockSpeed', parseFloat(e.target.value) || 0)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-border">
                            <label className="text-sm font-medium leading-none text-blue-600 dark:text-blue-400">Usage Spitzenwert CPU (GHz)</label>
                            <input
                                type="number" min="0"
                                value={inputs.peakCpuUsage}
                                onChange={(e) => handleInputChange('peakCpuUsage', parseFloat(e.target.value) || 0)}
                                className="flex h-10 w-full rounded-md border border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10 px-3 py-2 text-sm font-semibold"
                            />
                        </div>
                    </div>
                </div>

                {/* RAM Configuration */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-primary" /> RAM Configuration
                    </h2>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-purple-600 dark:text-purple-400">Usage Spitzenwert RAM (GB)</label>
                            <div className="relative">
                                <input
                                    type="number" min="0"
                                    value={inputs.peakRamUsage}
                                    onChange={(e) => handleInputChange('peakRamUsage', parseFloat(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-purple-500/50 bg-purple-50/50 dark:bg-purple-900/10 px-3 py-2 pl-9 text-sm font-semibold"
                                />
                                <Gauge className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Anzahl DIMMs</label>
                                <input
                                    type="number" min="1"
                                    value={inputs.dimmCount}
                                    onChange={(e) => handleInputChange('dimmCount', parseInt(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Größe DIMMs (GB)</label>
                                <select
                                    value={[16, 32, 64, 128, 256].includes(inputs.dimmSize) ? inputs.dimmSize : "custom"}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === "custom") {
                                            handleInputChange('dimmSize', 48); // Standardwert für individuellen RAM
                                        } else {
                                            handleInputChange('dimmSize', parseInt(val));
                                        }
                                    }}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
                                >
                                    <option value={16}>16 GB</option>
                                    <option value={32}>32 GB</option>
                                    <option value={64}>64 GB</option>
                                    <option value={128}>128 GB</option>
                                    <option value={256}>256 GB</option>
                                    <option value="custom">Eigene Größe...</option>
                                </select>
                                {!([16, 32, 64, 128, 256].includes(inputs.dimmSize)) && (
                                    <input
                                        type="number"
                                        min="1"
                                        value={inputs.dimmSize === 0 ? '' : inputs.dimmSize}
                                        onChange={(e) => handleInputChange('dimmSize', parseInt(e.target.value) || 0)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none mt-2"
                                        placeholder="Größe in GB eingeben"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="pt-2 text-xs text-muted-foreground flex justify-between">
                            <span>RAM pro Server:</span>
                            <span className="font-mono font-bold">{formatNumber(results.ramPerServer)} GB</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section - Right Column */}
            <div className="lg:col-span-8 space-y-8">

                {/* CPU Results */}
                <div className="bg-gradient-to-br from-card to-accent/10 rounded-xl border border-border p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left flex items-center gap-2">
                        <Cpu className="w-6 h-6" /> CPU Sizing Analysis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Summe CPU */}
                        <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Kapazität (Gesamt)</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(results.totalCpuGHz)} <span className="text-lg font-normal text-muted-foreground">GHz</span>
                            </div>
                            <div className="mt-2 text-sm">Load: <span className={`font-bold ${results.loadPercentage > 90 ? 'text-red-500' : 'text-green-600'}`}>{formatPercent(results.loadPercentage)}</span></div>
                        </div>

                        {/* n-1 Analysis */}
                        <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">n-1 Kapazität</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(results.nMinusOneGHz)} <span className="text-lg font-normal text-muted-foreground">GHz</span>
                            </div>
                            <div className="mt-2 text-sm">Load n-1: <span className={`font-bold ${results.loadNMinusOnePercentage > 100 ? 'text-red-500' : (results.loadNMinusOnePercentage > 80 ? 'text-orange-500' : 'text-green-600')}`}>{formatPercent(results.loadNMinusOnePercentage)}</span></div>
                        </div>

                        {/* HA / Site Failure (Optional) */}
                        {inputs.isHA && (
                            <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden ring-2 ring-red-500/20">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Site Failure (n/2)
                                </div>
                                <div className="text-3xl font-extrabold text-foreground">
                                    {formatNumber(results.nHalfGHz)} <span className="text-lg font-normal text-muted-foreground">GHz</span>
                                </div>
                                <div className="mt-2 text-sm">Load n/2: <span className={`font-bold ${results.loadNHalfPercentage > 100 ? 'text-red-500' : 'text-green-600'}`}>{formatPercent(results.loadNHalfPercentage)}</span></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* RAM Results */}
                <div className="bg-gradient-to-br from-card to-purple-500/5 rounded-xl border border-border p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left flex items-center gap-2">
                        <HardDrive className="w-6 h-6" /> RAM Sizing Analysis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Summe RAM */}
                        <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">RAM (Gesamt)</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(results.totalRam)} <span className="text-lg font-normal text-muted-foreground">GB</span>
                            </div>
                            <div className="mt-2 text-sm">Load: <span className={`font-bold ${results.loadRamPercentage > 90 ? 'text-red-500' : 'text-green-600'}`}>{formatPercent(results.loadRamPercentage)}</span></div>
                        </div>

                        {/* n-1 RAM Analysis */}
                        <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">n-1 RAM Kapazität</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(results.nMinusOneRam)} <span className="text-lg font-normal text-muted-foreground">GB</span>
                            </div>
                            <div className="mt-2 text-sm">Load n-1: <span className={`font-bold ${results.loadNMinusOneRamPercentage > 100 ? 'text-red-500' : (results.loadNMinusOneRamPercentage > 80 ? 'text-orange-500' : 'text-green-600')}`}>{formatPercent(results.loadNMinusOneRamPercentage)}</span></div>
                        </div>

                        {/* HA / Site Failure RAM (Optional) */}
                        {inputs.isHA && (
                            <div className="bg-background rounded-xl p-6 border border-border shadow-sm relative overflow-hidden ring-2 ring-red-500/20">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> Site Failure (n/2)
                                </div>
                                <div className="text-3xl font-extrabold text-foreground">
                                    {formatNumber(results.nHalfRam)} <span className="text-lg font-normal text-muted-foreground">GB</span>
                                </div>
                                <div className="mt-2 text-sm">Load n/2: <span className={`font-bold ${results.loadNHalfRamPercentage > 100 ? 'text-red-500' : 'text-green-600'}`}>{formatPercent(results.loadNHalfRamPercentage)}</span></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Overall Assessment - Only show if risks detected */}
                {(results.loadNMinusOnePercentage > 100 || results.loadNMinusOneRamPercentage > 100 || (inputs.isHA && (results.loadNHalfPercentage > 100 || results.loadNHalfRamPercentage > 100))) && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400">Kritische Engpässe erkannt</h4>
                            <ul className="list-disc list-inside text-sm text-red-600/90 dark:text-red-400/90 mt-1">
                                {results.loadNMinusOnePercentage > 100 && <li>CPU n-1 Last ist zu hoch ({formatPercent(results.loadNMinusOnePercentage)})</li>}
                                {results.loadNMinusOneRamPercentage > 100 && <li>RAM n-1 Last ist zu hoch ({formatPercent(results.loadNMinusOneRamPercentage)})</li>}
                                {inputs.isHA && results.loadNHalfPercentage > 100 && <li>CPU Site Failure (n/2) Last ist zu hoch ({formatPercent(results.loadNHalfPercentage)})</li>}
                                {inputs.isHA && results.loadNHalfRamPercentage > 100 && <li>RAM Site Failure (n/2) Last ist zu hoch ({formatPercent(results.loadNHalfRamPercentage)})</li>}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SizingTool;
