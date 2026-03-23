import dynamic from "next/dynamic";

const ProvidersClient = dynamic(() => import("@/components/providers-client").then((mod) => mod.ProvidersClient), {
  ssr: false,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ProvidersClient>{children}</ProvidersClient>;
}
