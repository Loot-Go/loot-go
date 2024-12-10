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
    <div className="text-md flex min-h-screen items-center justify-center">
      <p>Loading...</p>
      <p>
        Back to profile page
        <a href="/login" className="ml-1 underline">
          login page
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
