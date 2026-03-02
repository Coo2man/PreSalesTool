'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Info, Calculator, Percent, DollarSign } from 'lucide-react';

interface ProductItem {
    id: string;
    name: string;
    listPrice: number;
}

const STANDARD_DISCOUNTS = [
    { label: 'HPE - Server', value: 78 },
    { label: 'Dell - Server', value: 65 },
    { label: 'Dell - Storage ME5', value: 60 },
    { label: 'Dell - Storage PowerStore', value: 80 }
];

export default function PricingTool() {
    const [isLoaded, setIsLoaded] = useState(false);

    const [items, setItems] = useState<ProductItem[]>([
        { id: '1', name: '', listPrice: 0 },
        { id: '2', name: '', listPrice: 0 },
        { id: '3', name: '', listPrice: 0 }
    ]);

    // Global inputs
    const [discountRate, setDiscountRate] = useState<number>(65); // Rabattsatz in %
    const [margin, setMargin] = useState<number>(15); // Deckungsbeitrag (DB) in %
    const [showDiscountInfo, setShowDiscountInfo] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedItems = localStorage.getItem('pricing_items');
        const savedDiscount = localStorage.getItem('pricing_discount');
        const savedMargin = localStorage.getItem('pricing_margin');

        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems));
            } catch (e) {
                console.error("Failed to parse saved pricing items", e);
            }
        }
        if (savedDiscount) setDiscountRate(Number(savedDiscount));
        if (savedMargin) setMargin(Number(savedMargin));

        setIsLoaded(true);
    }, []);

    // Save to localStorage when values change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('pricing_items', JSON.stringify(items));
            localStorage.setItem('pricing_discount', discountRate.toString());
            localStorage.setItem('pricing_margin', margin.toString());
        }
    }, [items, discountRate, margin, isLoaded]);

    if (!isLoaded) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Lade Kalkulator...</div>;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const handleItemChange = (id: string, field: keyof ProductItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), name: '', listPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const calculateEK = (listPrice: number) => {
        return listPrice * (1 - discountRate / 100);
    };

    const calculateVK = (ekPrice: number) => {
        // VK = EK / (1 - DB)
        // Ensure we don't divide by 0 or negative if DB >= 100%
        if (margin >= 100) return 0;
        return ekPrice / (1 - margin / 100);
    };

    const totalEK = items.reduce((sum, item) => sum + calculateEK(item.listPrice), 0);
    const totalVK = items.reduce((sum, item) => sum + calculateVK(calculateEK(item.listPrice)), 0);

    return (
        <div className="space-y-10">
            {/* Table 1: Listpreis -> EK */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" /> EK-Preis Kalkulation
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Berechnen Sie den Einkaufspreis auf Basis des Listenpreises und des Rabattsatzes.</p>
                    </div>

                    <div className="flex items-center gap-3 relative">
                        <label className="text-sm font-medium">Globaler Rabattsatz:</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={discountRate}
                                onChange={(e) => setDiscountRate(Number(e.target.value))}
                                className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-8"
                                placeholder="0"
                            />
                            <Percent className="w-4 h-4 absolute right-2 top-2.5 text-muted-foreground pointer-events-none" />
                        </div>

                        <button
                            className="p-2 bg-muted/50 hover:bg-accent rounded-full text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                            onClick={() => setShowDiscountInfo(!showDiscountInfo)}
                            aria-label="Standardrabatte anzeigen"
                        >
                            <Info className="w-5 h-5" />
                        </button>

                        {/* Popover */}
                        {showDiscountInfo && (
                            <div className="absolute top-full mt-2 right-0 w-64 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                <div className="p-3 bg-muted/30 border-b border-border">
                                    <h4 className="font-semibold text-sm">Standardrabatte</h4>
                                </div>
                                <div className="p-2 space-y-1">
                                    {STANDARD_DISCOUNTS.map((discount, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setDiscountRate(discount.value);
                                                setShowDiscountInfo(false);
                                            }}
                                            className="w-full text-left flex justify-between items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                                        >
                                            <span>{discount.label}</span>
                                            <span className="font-medium text-primary">{discount.value}%</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-4 py-3 font-semibold text-sm w-[45%]">Produkt</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[25%] text-right">Listenpreis</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[25%] text-right">EK - Preis</th>
                                    <th className="px-4 py-3 w-[5%] text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const ek = calculateEK(item.listPrice);
                                    return (
                                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                                            <td className="px-4 py-3">
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                    className="w-full bg-transparent border-none rounded-md px-2 py-1.5 focus:bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder={`Produkt ${index + 1}`}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={item.listPrice === 0 ? '' : item.listPrice}
                                                        onChange={(e) => handleItemChange(item.id, 'listPrice', Number(e.target.value))}
                                                        className="w-full bg-transparent border border-transparent rounded-md px-2 py-1.5 text-right focus:bg-background focus:border-border focus:ring-2 focus:ring-primary outline-none transition-all pr-6"
                                                        placeholder="0,00"
                                                    />
                                                    <span className="absolute right-2 top-2 text-muted-foreground pointer-events-none text-sm">€</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium text-blue-500/90 pr-6">
                                                {formatCurrency(ek)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                                    disabled={items.length === 1}
                                                    title="Zeile entfernen"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/20">
                        <button
                            onClick={addItem}
                            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors px-2 py-1 rounded-md hover:bg-primary/10"
                        >
                            <Plus className="w-4 h-4" /> Zeile hinzufügen
                        </button>
                        <div className="flex items-center gap-8 px-6">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Gesamt EK</span>
                            <span className="text-xl font-bold text-foreground">{formatCurrency(totalEK)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table 2: EK -> VK */}
            <div className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-green-500" /> VK-Preis Kalkulation
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Ermitteln Sie den Verkaufspreis auf Basis des Deckungsbeitrags.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium">Deckungsbeitrag (DB):</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={margin}
                                onChange={(e) => setMargin(Number(e.target.value))}
                                className="w-24 bg-background border border-border rounded-lg px-3 py-2 text-right focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none pr-8"
                                placeholder="0"
                            />
                            <Percent className="w-4 h-4 absolute right-2 top-2.5 text-muted-foreground pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-4 py-3 font-semibold text-sm w-[45%]">Produkt</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[25%] text-right">EK - Preis</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[25%] text-right">VK - Preis</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => {
                                    // Skip empty rows where list price is 0 and no name
                                    if (item.listPrice === 0 && !item.name.trim()) return null;

                                    const ek = calculateEK(item.listPrice);
                                    const vk = calculateVK(ek);
                                    return (
                                        <tr key={`vk-${item.id}`} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium">
                                                {item.name || <span className="text-muted-foreground italic">Unbenanntes Produkt</span>}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm text-muted-foreground pr-6">
                                                {formatCurrency(ek)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-green-500/90 pr-6">
                                                {formatCurrency(vk)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {items.every(i => i.listPrice === 0 && !i.name.trim()) && (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground text-sm italic">
                                            Fügen Sie oben Produkte hinzu, um die VK-Kalkulation zu sehen.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col items-end p-4 bg-muted/20 border-t border-border gap-2">
                        <div className="flex items-center gap-8 px-6 text-sm text-muted-foreground/70">
                            <span className="font-medium">Absoluter Deckungsbeitrag</span>
                            <span>{formatCurrency(totalVK - totalEK)}</span>
                        </div>
                        <div className="flex items-center gap-8 px-6">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Gesamt VK</span>
                            <span className="text-xl font-bold text-green-500">{formatCurrency(totalVK)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
