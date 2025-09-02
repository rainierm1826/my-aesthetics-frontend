import OwnerWrapper from "@/components/ManagementWrapper";
import SettingsForm from "@/components/forms/SettingsForm";

export default function SettingsPage() {
  return (
    <OwnerWrapper title="Settings">
      <SettingsForm />
    </OwnerWrapper>
  );
}
