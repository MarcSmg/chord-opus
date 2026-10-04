import { WarningTriangle } from "iconoir-react";
import Heading from "@/shared/ui/Heading";
import { Button } from "@/shared/ui/Button";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

interface ErrorPageProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    retryLabel?: string;
}

export const ErrorPage = ({
    title = "Something went wrong",
    description = "An unexpected error occurred. Try reloading the page, or head back home.",
    onRetry = () => window.location.reload(),
    retryLabel = "Try again",
}: ErrorPageProps) => (
    <ThemeProvider>
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-ui-bg px-6 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-status-error-soft text-status-error">
                <WarningTriangle width={32} height={32} strokeWidth={2} />
            </span>

            <div className="flex flex-col gap-2">
                <Heading level={2}>{title}</Heading>
                <p className="max-w-md text-body text-content-muted">{description}</p>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => { window.location.href = "/home"; }}>
                    Go home
                </Button>
                <Button variant="primary" onClick={onRetry}>{retryLabel}</Button>
            </div>
        </div>
    </ThemeProvider>
);
