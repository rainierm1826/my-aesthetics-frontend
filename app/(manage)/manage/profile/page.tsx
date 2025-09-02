import OwnerWrapper from "@/components/ManagementWrapper";
import UserForm from "@/components/forms/UserForm";

export default function ProfilePage() {
  return (
    <OwnerWrapper title="Profile">
      <UserForm />
    </OwnerWrapper>
  );
}
