"use client";

import { useState, useEffect } from 'react';
import { HardDrive, TrendingUp, Calendar, Database, ArrowRight } from 'lucide-react';

const StorageSizer = () => {
    // Default values
    const defaultInputs = {
        currentStorage: 80, // TB
        runtime: 5,        // Years
        growthPercent: 5,  // % p.a.
        growthTb: 7        // TB p.a.
    };

    // Lazy initialization from localStorage
    const [inputs, setInputs] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('storage-sizer-storage');
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

    const [tableData, setTableData] = useState<any[]>([]);
    const [sollSpeicher, setSollSpeicher] = useState({
        percent: 0,
        absolute: 0
    });

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('storage-sizer-storage', JSON.stringify(inputs));
        calculateGrowth();
    }, [inputs]);

    const calculateGrowth = () => {
        const { currentStorage, runtime, growthPercent, growthTb } = inputs;
        const data = [];
        const maxYears = 10; // Show 10 years forecast as per example

        let currentPercentVal = currentStorage;
        let currentAbsoluteVal = currentStorage;

        // Year 0 (Start)
        data.push({
            year: 0,
            percentVal: currentPercentVal,
            absoluteVal: currentAbsoluteVal
        });

        for (let i = 1; i <= maxYears; i++) {
            // Percent Calculation: Previous * (1 + growth/100)
            currentPercentVal = currentPercentVal * (1 + growthPercent / 100);

            // Absolute Calculation: Previous + growthTb
            currentAbsoluteVal = currentAbsoluteVal + growthTb;

            data.push({
                year: i,
                percentVal: currentPercentVal,
                absoluteVal: currentAbsoluteVal
            });
        }

        setTableData(data);

        // Find values at runtime year
        // Note: Array index matches year because we pushed Year 0 first.
        // If runtime > maxYears, we might need to calc specifically, but for now assuming user looks within the table range or we just calc it.
        // Actually, let's calculate exact target values regardless of table length for the summary box.

        const targetPercentVal = currentStorage * Math.pow(1 + growthPercent / 100, runtime);
        const targetAbsoluteVal = currentStorage + (growthTb * runtime);

        setSollSpeicher({
            percent: targetPercentVal,
            absolute: targetAbsoluteVal
        });
    };

    const handleInputChange = (field: string, value: any) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const formatNumber = (num: number) => {
        return num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Section - Left Column */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm h-full">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" /> Konfiguration
                    </h2>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Aktueller Speicher (TB)
                            </label>
                            <div className="relative">
                                <HardDrive className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    min="0"
                                    value={inputs.currentStorage}
                                    onChange={(e) => handleInputChange('currentStorage', parseFloat(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">
                                Laufzeit (Jahre)
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={inputs.runtime}
                                    onChange={(e) => handleInputChange('runtime', parseInt(e.target.value) || 0)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Wachstum % p.a.
                                </label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={inputs.growthPercent}
                                        onChange={(e) => handleInputChange('growthPercent', parseFloat(e.target.value) || 0)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                    Wachstum TB p.a.
                                </label>
                                <div className="relative">
                                    <Database className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={inputs.growthTb}
                                        onChange={(e) => handleInputChange('growthTb', parseFloat(e.target.value) || 0)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-border">
                            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                                <h3 className="font-semibold text-primary mb-2">Ergebnis Vorschau (Jahr {inputs.runtime})</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nach %:</span>
                                        <span className="font-bold">{formatNumber(sollSpeicher.percent)} TB</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nach TB:</span>
                                        <span className="font-bold">{formatNumber(sollSpeicher.absolute)} TB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section - Right Column */}
            <div className="lg:col-span-8 space-y-6">
                <div className="bg-gradient-to-br from-card to-accent/10 rounded-xl border border-border p-8 shadow-sm h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-center md:text-left flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" /> Wachstumsprognose
                    </h2>

                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Jahr</th>
                                    <th className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span>Wachstum {inputs.growthPercent}% p.a.</span>
                                            <span className="text-[10px] opacity-70">Dynamisch</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span>Wachstum {inputs.growthTb} TB p.a.</span>
                                            <span className="text-[10px] opacity-70">Linear</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {tableData.map((row) => {
                                    const isTargetYear = row.year === inputs.runtime;
                                    return (
                                        <tr
                                            key={row.year}
                                            className={`transition-colors hover:bg-muted/30 ${isTargetYear ? 'bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary' : ''}`}
                                        >
                                            <td className="px-6 py-3 font-medium">
                                                {row.year === 0 ? 'Start' : `Jahr ${row.year}`}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {formatNumber(row.percentVal)} <span className="text-muted-foreground ml-1">TB</span>
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                {formatNumber(row.absoluteVal)} <span className="text-muted-foreground ml-1">TB</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-background rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden ring-1 ring-primary/20">
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Soll Speicher (Dynamisch)</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(sollSpeicher.percent)} <span className="text-lg font-normal text-muted-foreground">TB</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                bei {inputs.growthPercent}% Wachstum über {inputs.runtime} Jahre
                            </p>
                        </div>

                        <div className="bg-background rounded-xl p-6 border border-border flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden ring-1 ring-primary/20">
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Soll Speicher (Linear)</div>
                            <div className="text-3xl font-extrabold text-foreground">
                                {formatNumber(sollSpeicher.absolute)} <span className="text-lg font-normal text-muted-foreground">TB</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                bei {inputs.growthTb} TB Wachstum über {inputs.runtime} Jahre
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StorageSizer;
