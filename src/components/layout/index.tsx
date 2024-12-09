import DynamicProvider from "@/providers/DynamicProvider";
import Footer from "./footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DynamicProvider>
      <main className="mx-auto flex min-h-[100svh] max-w-md flex-col shadow">
        {children}
        <Footer />
      </main>
    </DynamicProvider>
  );
}
