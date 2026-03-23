import { Activity, Shield, TimerReset } from "lucide-react";
import { RpcPulse } from "@/components/rpc-pulse";

export function RpcStatusCard() {
  return (
    <div className="panel p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-cyan-200/80">Network status</div>
          <h2 className="mt-2 text-2xl font-semibold">Devnet control tower</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <Activity className="h-5 w-5 text-cyan-200" />
        </div>
      </div>

      <RpcPulse />

      <div className="mt-6 grid gap-3 text-sm text-muted">
        <div className="panel-subtle flex items-start gap-3 p-4">
          <Shield className="mt-0.5 h-4 w-4 text-accent" />
          <p>Default mode keeps execution honest: real wallet UX, real Devnet memo flow, no fake live swaps.</p>
        </div>
        <div className="panel-subtle flex items-start gap-3 p-4">
          <TimerReset className="mt-0.5 h-4 w-4 text-accent2" />
          <p>Public Devnet endpoints are fine for demos, but you will want dedicated RPC before any serious traffic.</p>
        </div>
      </div>
    </div>
  );
}
