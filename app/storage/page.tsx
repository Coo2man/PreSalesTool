import StorageSizer from '@/components/StorageSizer';

export default function StoragePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Storage Sizer</h1>
                <p className="text-muted-foreground">
                    Calculate storage growth over time using percentage or absolute increments.
                </p>
            </div>

            <StorageSizer />
        </div>
    );
}
