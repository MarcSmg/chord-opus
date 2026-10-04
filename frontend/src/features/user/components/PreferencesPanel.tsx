import { useState } from "react";
import { Check } from "iconoir-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api/auth";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/utils/cn";
import { SettingsCard } from "./SettingsCard";

const NOTATION_OPTIONS = [
    { value: "english", label: "English", example: "C, D, E, F, G, A, B" },
    { value: "latin", label: "Latin", example: "Do, Re, Mi, Fa, Sol, La, Si" },
] as const;

const TUNING_OPTIONS = [
    { value: "EADGBE", label: "Standard" },
    { value: "DADGBE", label: "Drop D" },
    { value: "DGDGBD", label: "Open G" },
    { value: "DADF#AD", label: "Open D" },
    { value: "D#G#C#F#A#D#", label: "Half Step Down" },
] as const;

type SaveStatus = "idle" | "saving" | "saved" | "error";

const OptionCard = ({
    isActive,
    label,
    caption,
    onSelect,
}: {
    isActive: boolean;
    label: string;
    caption: string;
    onSelect: () => void;
}) => (
    <button
        type="button"
        onClick={onSelect}
        className={cn(
            "flex cursor-pointer flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors",
            isActive ? "border-accent-secondary bg-accent-secondary-soft" : "border-stroke-subtle hover:border-accent-secondary/50"
        )}
    >
        <span className="flex w-full items-center justify-between text-body-sm font-medium text-content">
            {label}
            {isActive && <Check width={16} height={16} strokeWidth={2} className="text-accent-secondary" />}
        </span>
        <span className="text-label text-content-muted">{caption}</span>
    </button>
);

export const PreferencesPanel = () => {
    const { user } = useAuth();
    const savedNotation = user?.profile?.notation ?? "english";
    const savedTuning = user?.profile?.tuning ?? "EADGBE";

    const [notation, setNotation] = useState(savedNotation);
    const [tuning, setTuning] = useState(savedTuning);
    const [status, setStatus] = useState<SaveStatus>("idle");

    const isDirty = notation !== savedNotation || tuning !== savedTuning;

    const handleSave = async () => {
        setStatus("saving");
        try {
            await authApi.preferences({ notation, tuning });
            setStatus("saved");
        } catch {
            setStatus("error");
        } finally {
            setTimeout(() => setStatus("idle"), 1500);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <SettingsCard title="Note Notation">
                <div className="grid grid-cols-2 gap-3">
                    {NOTATION_OPTIONS.map((option) => (
                        <OptionCard
                            key={option.value}
                            isActive={notation === option.value}
                            label={option.label}
                            caption={option.example}
                            onSelect={() => setNotation(option.value)}
                        />
                    ))}
                </div>
            </SettingsCard>

            <SettingsCard title="Default Tuning">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {TUNING_OPTIONS.map((option) => (
                        <OptionCard
                            key={option.value}
                            isActive={tuning === option.value}
                            label={option.label}
                            caption={option.value}
                            onSelect={() => setTuning(option.value)}
                        />
                    ))}
                </div>
            </SettingsCard>

            <div className="flex items-center justify-end gap-3">
                {status === "saved" && <span className="text-label text-status-success">Saved</span>}
                {status === "error" && <span className="text-label text-status-error">Couldn't save changes</span>}
                <Button variant="primary" disabled={!isDirty || status === "saving"} onClick={handleSave}>
                    {status === "saving" ? "Saving..." : "Save changes"}
                </Button>
            </div>
        </div>
    );
};
