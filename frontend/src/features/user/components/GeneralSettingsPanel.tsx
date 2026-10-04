import { EditPencil, Link } from "iconoir-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/shared/ui/Button";
import { SettingsCard } from "./SettingsCard";
import { Tooltip } from "@/shared/ui/Tooltip";

const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <div>
        <p className="mb-1 text-label text-content-muted">{label}</p>
        <p className="text-body-sm font-medium text-content">{value || "—"}</p>
    </div>
);

const EditButton = () => (
    <Button variant="secondary" icon={<EditPencil width={16} height={16} strokeWidth={2} />}>Edit</Button>
);

export const GeneralSettingsPanel = () => {
    const { user } = useAuth();

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username;
    const memberSince = user?.dateJoined
        ? new Date(user.dateJoined).toLocaleDateString(undefined, { month: "long", year: "numeric" })
        : null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-stroke-subtle bg-ui-card p-5">
                <div className="flex items-center gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-header-3 font-bold text-primary">
                        {fullName?.[0]?.toUpperCase() ?? "?"}
                    </span>
                    <div>
                        <div className="flex gap-5 items-center">
                            <span>
                                <p className="font-semibold text-body text-content">{fullName}</p>
                                <p className="text-body-sm text-content-muted">@{user?.username}</p>
                            </span>
                            <Tooltip label="Share Profile">
                                <span className="p-1 border border-accent-secondary/50 text-accent-secondary rounded-full cursor-pointer">
                                    <Link strokeWidth={2} fontSize={12} />
                                </span>
                            </Tooltip>
                        </div>
                        {memberSince && <p className="text-label text-content-muted">Member since {memberSince}</p>}
                    </div>
                </div>
                <EditButton />
            </div>

            <SettingsCard title="Personal Information" action={<EditButton />}>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="First Name" value={user?.firstName} />
                    <Field label="Last Name" value={user?.lastName} />
                    <Field label="Email address" value={user?.email} />
                    <Field label="Username" value={user?.username} />
                </div>
            </SettingsCard>
        </div>
    );
};
