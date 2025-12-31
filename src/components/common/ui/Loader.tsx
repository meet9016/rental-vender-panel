// components/ui/Loader.tsx
interface LoaderProps {
    size?: "sm" | "md" | "lg";
    color?: "primary" | "secondary" | "white";
    fullScreen?: boolean;
    text?: string;
}

export default function Loader({
    size = "md",
    color = "primary",
    fullScreen = false,
    text,
}: LoaderProps) {
    const sizes = {
        sm: "w-6 h-6",
        md: "w-10 h-10",
        lg: "w-16 h-16",
    };

    const colors = {
        primary: "border-blue-600",
        secondary: "border-gray-600",
        white: "border-white",
    };

    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
            />
            {text && <p className="text-sm text-gray-600 font-medium">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
                {spinner}
            </div>
        );
    }

    return <div className="flex items-center justify-center p-4">{spinner}</div>;
}