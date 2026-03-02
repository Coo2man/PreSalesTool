import PricingTool from '@/components/PricingTool';

export const metadata = {
    title: 'Listpreisrechner | PreSales Box',
    description: 'Listpreisrechner für Data Center Consultants',
};

export default function PricingPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Listpreisrechner</h1>
                <p className="text-muted-foreground">
                    Ermitteln Sie EK- und VK-Preise auf Basis von Listenpreisen, Rabattsätzen und Deckungsbeiträgen.
                </p>
            </div>

            <PricingTool />
        </div>
    );
}
