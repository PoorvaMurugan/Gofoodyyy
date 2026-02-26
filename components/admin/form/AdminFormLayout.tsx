interface Props {
    title: string;
    children: React.ReactNode;
}

export function AdminFormLayout({ title, children }: Props) {
    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    {title}
                </h2>
            </div>

            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}