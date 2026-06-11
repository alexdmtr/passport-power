import type { PassportDetail } from "@/lib/passport";
import { Card } from "@/components/ui/card";
import { Flag } from "./flag";

export function ScoreSummary({ detail }: { detail: PassportDetail }) {
  return (
    <Card className="flex-row items-center gap-5 p-6">
      <Flag
        code={detail.code}
        label={detail.name}
        className="h-14 w-[84px] shadow-sm"
      />
      <div>
        <div className="text-xl font-bold tracking-tight sm:text-2xl">
          {detail.name} passport
        </div>
        <div className="text-muted-foreground text-sm">
          {detail.destinations.length} destinations analysed
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="from-brand to-brand-2 bg-gradient-to-r bg-clip-text text-4xl leading-none font-extrabold tracking-tight text-transparent">
            {detail.score}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            destinations without a prior visa
          </span>
        </div>
      </div>
    </Card>
  );
}
