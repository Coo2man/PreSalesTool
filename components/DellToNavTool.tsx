'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileCode, Copy, Check, FileJson, X, ChevronRight } from 'lucide-react';

interface ParsedProduct {
    id: string;
    description: string;
    listPrice: string;
    discount: string;
    total: string;
    buildLinesText: string;
}

export default function DellToNavTool() {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [products, setProducts] = useState<ParsedProduct[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [copiedField, setCopiedField] = useState<string | null>(null);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCopy = (text: string, fieldKey: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldKey);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const processFile = (file: File) => {
        if (!file.name.toLowerCase().endsWith('.xml')) {
            setError('Bitte laden Sie eine gültige XML-Datei hoch.');
            return;
        }

        setError(null);
        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(text, 'text/xml');

                const modelRows = xmlDoc.getElementsByTagName('MODEL_BUILD_ROW');
                if (modelRows.length === 0) {
                    setError('Ungültiges Format: Keine MODEL_BUILD_ROW-Elemente im XML gefunden.');
                    return;
                }

                const productsList: ParsedProduct[] = [];
                for (let i = 0; i < modelRows.length; i++) {
                    const row = modelRows[i];
                    const description = row.getElementsByTagName('MODEL_DESCRIPTION')[0]?.textContent || '';
                    const listPrice = row.getElementsByTagName('MODEL_LINE_LIST_PRICE_WITHFREIGHT')[0]?.textContent || '';
                    const discount = row.getElementsByTagName('MODEL_LINE_DOL_PERCENT')[0]?.textContent || '';
                    const total = row.getElementsByTagName('MODEL_TOTAL')[0]?.textContent || '';

                    const buildLinesRows = row.getElementsByTagName('BUILD_LINES_ROW');
                    const buildLinesTextArray = [];
                    
                    for (let j = 0; j < buildLinesRows.length; j++) {
                        const line = buildLinesRows[j];
                        const qty = line.getElementsByTagName('LINE_QTY')[0]?.textContent || '';
                        const sku = line.getElementsByTagName('SKU_NUMBER')[0]?.textContent || '';
                        const desc = line.getElementsByTagName('ITEM_DESCRIPTION')[0]?.textContent || '';
                        if (qty || sku || desc) {
                            buildLinesTextArray.push(`${qty}x ${sku} - ${desc}`);
                        }
                    }

                    productsList.push({
                        id: i.toString(),
                        description,
                        listPrice,
                        discount,
                        total,
                        buildLinesText: buildLinesTextArray.join('\n')
                    });
                }

                setProducts(productsList);
            } catch (err) {
                console.error(err);
                setError('Es gab einen Fehler beim Lesen der XML-Datei.');
            }
        };
        reader.readAsText(file);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    };

    const resetTool = () => {
        setFileName(null);
        setProducts([]);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const CopyButton = ({ text, fieldKey, label }: { text: string, fieldKey: string, label?: string }) => {
        const isCopied = copiedField === fieldKey;
        return (
            <button
                onClick={() => handleCopy(text, fieldKey)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isCopied 
                        ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                        : 'bg-secondary hover:bg-accent text-secondary-foreground border border-border'
                }`}
                title="In die Zwischenablage kopieren"
            >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {label && <span>{isCopied ? 'Kopiert!' : label}</span>}
            </button>
        );
    };

    return (
        <div className="space-y-6">
            {!fileName && (
                <div
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 ${
                        isDragging 
                            ? 'border-purple-500 bg-purple-500/10' 
                            : 'border-border bg-card/50 hover:bg-accent/30 hover:border-purple-500/50'
                    }`}
                >
                    <input
                        type="file"
                        accept=".xml"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                    />
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500">
                        <UploadCloud className={`w-10 h-10 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Dell XML-Datei hochladen</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Ziehen Sie Ihre Angebots-XML hierhin oder klicken Sie, um eine Datei auszuwählen. Die Verarbeitung erfolgt vollständig lokal im Browser.
                    </p>
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-6 py-4 rounded-xl flex items-center gap-3">
                    <X className="w-5 h-5 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {fileName && !error && (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 text-purple-500 rounded-lg">
                                <FileCode className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Aktuelle Datei</p>
                                <p className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">{fileName}</p>
                            </div>
                        </div>
                        <button 
                            onClick={resetTool}
                            className="text-sm bg-secondary hover:bg-destructive hover:text-destructive-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Andere Datei wählen
                        </button>
                    </div>

                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={index} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col gap-6">
                                        
                                        {/* Product Description */}
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Produktbeschreibung</p>
                                                <h4 className="text-lg font-bold text-foreground leading-tight">
                                                    {product.description || <span className="italic text-muted-foreground">Keine Beschreibung</span>}
                                                </h4>
                                            </div>
                                            <div className="shrink-0">
                                                <CopyButton text={product.description} fieldKey={`${index}-desc`} label="Text" />
                                            </div>
                                        </div>

                                        {/* Prices Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground font-medium">Listenpreis</p>
                                                <div className="flex items-center justify-between bg-background border border-border rounded-lg p-3">
                                                    <span className="font-semibold">{product.listPrice ? `${product.listPrice} €` : '-'}</span>
                                                    <CopyButton text={product.listPrice} fieldKey={`${index}-list`} />
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground font-medium">Rabattsatz</p>
                                                <div className="flex items-center justify-between bg-background border border-border rounded-lg p-3">
                                                    <span className="font-semibold">{product.discount ? `${product.discount} %` : '-'}</span>
                                                    <CopyButton text={product.discount} fieldKey={`${index}-disc`} />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground font-medium">EK Preis (Total)</p>
                                                <div className="flex items-center justify-between bg-background border border-border rounded-lg p-3">
                                                    <span className="font-semibold text-primary">{product.total ? `${product.total} €` : '-'}</span>
                                                    <CopyButton text={product.total} fieldKey={`${index}-total`} />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                
                                {/* Action Footer */}
                                <div className="bg-muted/30 border-t border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <FileJson className="w-4 h-4" />
                                        <span>Fertig aufbereitete Navision-Stückliste (unsichtbar)</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(product.buildLinesText, `${index}-build`)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${
                                            copiedField === `${index}-build` 
                                                ? 'bg-green-500 text-white hover:bg-green-600' 
                                                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md'
                                        }`}
                                    >
                                        {copiedField === `${index}-build` ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        {copiedField === `${index}-build` ? 'Stückliste kopiert!' : 'BUILD_LINES kopieren'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
