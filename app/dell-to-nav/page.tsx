import DellToNavTool from '@/components/DellToNavTool';

export const metadata = {
    title: 'Dell to NAV | PreSales Box',
    description: 'Konvertieren Sie Dell-Angebots-XMLs in kopierfertige Texte für Navision.',
};

export default function DellToNavPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Dell to NAV Tool</h1>
                <p className="text-muted-foreground">
                    Laden Sie Ihre Dell Quote XML-Datei hoch, um die Produkte und Stücklisten (Build Lines) im passenden Format für den Import nach Navision zu kopieren. Die Verarbeitung erfolgt clientseitig für maximale Datensicherheit.
                </p>
            </div>

            <DellToNavTool />
        </div>
    );
}
