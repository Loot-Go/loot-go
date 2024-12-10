import { useRouter } from "next/navigation";
import { useEffect } from "react";

const RedirectToLogin = ({ status }: { status?: boolean }) => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      if (!status) {
        router.push("/login");
      }
    }, 55000);
  }, [status]);

  return (
    <div className="text-md flex min-h-screen flex-col items-center justify-center gap-y-4">
      <p>Loading...</p>
      <p className="text-center text-xs text-gray-400">
        Back to
        <a href="/login" className="ml-1 underline">
          Profile
        </a>
      </p>
    </div>
  );
};

const AccountWrapper = ({
  children,
  status,
}: {
  children: React.ReactNode;
  status?: boolean;
}) => {
  if (!status) {
    return <RedirectToLogin status={status} />;
  }

  return <>{children}</>;
};

export default AccountWrapper;
