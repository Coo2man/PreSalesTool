import DiscountTool from '@/components/DiscountTool';

export const metadata = {
    title: 'Rabattsatzrechner | PreSales Box',
    description: 'Rabattsatzrechner für Data Center Consultants',
};

export default function DiscountPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Rabattsatzrechner</h1>
                <p className="text-muted-foreground">
                    Ermitteln Sie den Rabattsatz auf Basis von Listenpreisen und EK-Preisen.
                </p>
            </div>

            <DiscountTool />
        </div>
    );
}
