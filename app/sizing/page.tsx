import SizingTool from '@/components/SizingTool';

export default function SizingPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Server Sizing Tool</h1>
                <p className="text-muted-foreground">
                    Estimate hardware requirements for your customer's environment.
                </p>
            </div>

            <SizingTool />
        </div>
    );
}
