import { Label } from "@/components/ui/label";

interface Props {
    label: string;
    children: React.ReactNode;
}

export function AdminFormField({ label, children }: Props) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
                {label}
            </Label>
            {children}
        </div>
    );
}