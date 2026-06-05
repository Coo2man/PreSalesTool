'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Percent, Calculator, Copy, Check } from 'lucide-react';

interface DiscountItem {
    id: string;
    name: string;
    listPrice: number;
    ekPrice: number;
}

export default function DiscountTool() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [copied, setCopied] = useState(false);

    const [items, setItems] = useState<DiscountItem[]>([
        { id: '1', name: '', listPrice: 0, ekPrice: 0 },
        { id: '2', name: '', listPrice: 0, ekPrice: 0 },
        { id: '3', name: '', listPrice: 0, ekPrice: 0 }
    ]);

    // Load from localStorage on mount
    useEffect(() => {
        const savedItems = localStorage.getItem('discount_items');

        if (savedItems) {
            try {
                setItems(JSON.parse(savedItems));
            } catch (e) {
                console.error("Failed to parse saved discount items", e);
            }
        }

        setIsLoaded(true);
    }, []);

    // Save to localStorage when items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('discount_items', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    if (!isLoaded) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground animate-pulse">Lade Rabattsatzrechner...</div>;
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const formatPercent = (value: number) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'percent',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value / 100);
    };

    const handleItemChange = (id: string, field: keyof DiscountItem, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), name: '', listPrice: 0, ekPrice: 0 }]);
    };

    const removeItem = (id: string) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const calculateDiscount = (listPrice: number, ekPrice: number) => {
        if (listPrice <= 0) return 0;
        return (1 - (ekPrice / listPrice)) * 100;
    };

    const totalListPrice = items.reduce((sum, item) => sum + item.listPrice, 0);
    const totalEKPrice = items.reduce((sum, item) => sum + item.ekPrice, 0);
    const totalDiscountRate = totalListPrice > 0 ? ((1 - (totalEKPrice / totalListPrice)) * 100) : 0;

    const copyTableToClipboard = () => {
        const header = "Produkt | Listenpreis | EK-Preis | Rabattsatz\n" +
                       "----------------------------------------------\n";
        const rows = items.map((item, idx) => {
            const name = item.name.trim() || `Produkt ${idx + 1}`;
            const listPriceStr = formatCurrency(item.listPrice);
            const ekPriceStr = formatCurrency(item.ekPrice);
            const discountStr = formatPercent(calculateDiscount(item.listPrice, item.ekPrice));
            return `${name} | ${listPriceStr} | ${ekPriceStr} | ${discountStr}`;
        }).join('\n');
        
        const footer = "\n----------------------------------------------\n" +
                       `Gesamt Listenpreis: ${formatCurrency(totalListPrice)}\n` +
                       `Gesamt EK: ${formatCurrency(totalEKPrice)}\n` +
                       `Durchschnitts-Rabattsatz: ${formatPercent(totalDiscountRate)}`;
                       
        const textToCopy = header + rows + footer;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Fehler beim Kopieren:', err);
        });
    };

    return (
        <div className="space-y-10">
            {/* Table: Listpreis & EK -> Rabattsatz */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-primary" /> Rabattsatz-Ermittlung
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">Geben Sie Produkt, Listenpreis und Einkaufs(EK)-Preis an, um den implizierten Rabattsatz zu berechnen.</p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/40">
                                    <th className="px-4 py-3 w-[5%] text-center">
                                        <button
                                            onClick={copyTableToClipboard}
                                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                                            title="Tabelle in Zwischenablage kopieren"
                                        >
                                            {copied ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[38%]">Produkt</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[18%] text-right">Listenpreis</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[18%] text-right">EK - Preis</th>
                                    <th className="px-4 py-3 font-semibold text-sm w-[16%] text-right">Rabattsatz</th>
                                    <th className="px-4 py-3 w-[5%] text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => {
                                    const discount = calculateDiscount(item.listPrice, item.ekPrice);
                                    return (
                                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors group">
                                            <td className="px-4 py-3 text-center w-[5%]"></td>
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
                                            <td className="px-4 py-3">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={item.ekPrice === 0 ? '' : item.ekPrice}
                                                        onChange={(e) => handleItemChange(item.id, 'ekPrice', Number(e.target.value))}
                                                        className="w-full bg-transparent border border-transparent rounded-md px-2 py-1.5 text-right focus:bg-background focus:border-border focus:ring-2 focus:ring-primary outline-none transition-all pr-6 cursor-pointer"
                                                        placeholder="0,00"
                                                    />
                                                    <span className="absolute right-2 top-2 text-muted-foreground pointer-events-none text-sm">€</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-primary pr-6">
                                                {formatPercent(discount)}
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
                        <div className="flex items-center gap-6 px-4">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gesamt Listenpreis</span>
                                <span className="text-base text-foreground">{formatCurrency(totalListPrice)}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gesamt EK</span>
                                <span className="text-base text-foreground">{formatCurrency(totalEKPrice)}</span>
                            </div>
                            <div className="flex flex-col items-end border-l border-border pl-6 ml-2">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Percent className="w-3.5 h-3.5" />Ø Rabatt</span>
                                <span className="text-xl font-bold text-primary">{formatPercent(totalDiscountRate)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
