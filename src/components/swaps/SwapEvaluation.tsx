"use client";

import { useState } from "react";
import { rankSwapRequests } from "@/ai/flows/rank-swaps-flow";
import { summarizeSwap } from "@/ai/flows/summarize-swap-flow";
import type { RankSwapRequestsOutput } from "@/ai/flows/rank-swaps-flow";
import type { SummarizeSwapOutput } from "@/ai/flows/summarize-swap-flow";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Loader2 } from "lucide-react";
import type { Swap, User } from "@/lib/types";

interface SwapEvaluationProps {
  swap: Swap & { requester: User; responder: User };
}

type EvaluationResult = {
  rank: RankSwapRequestsOutput;
  summary: SummarizeSwapOutput;
};

export function SwapEvaluation({ swap }: SwapEvaluationProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const { toast } = useToast();

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      if (!swap.requester || !swap.responder || !swap.offeredSkill || !swap.wantedSkill) {
          throw new Error("Swap details are incomplete.");
      }

      const rankInput = {
        offeredSkills: [swap.offeredSkill.name],
        wantedSkills: [swap.wantedSkill.name],
      };
      const rankData = await rankSwapRequests(rankInput);

      const summaryInput = {
        offeredSkill: swap.offeredSkill.name,
        requestedSkill: swap.wantedSkill.name,
        userDetails: `Requester: ${swap.requester.name}, Responder: ${swap.responder.name}`,
      };
      const summaryData = await summarizeSwap(summaryInput);

      setResult({ rank: rankData, summary: summaryData });
    } catch (e) {
      console.error(e);
      toast({
        title: "Evaluation Failed",
        description: "Could not get AI evaluation for this swap.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      {!result ? (
        <div className="text-center">
          <Button onClick={handleEvaluate} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Get AI Evaluation
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            See an AI-powered summary and relevance score.
          </p>
        </div>
      ) : (
        <div className="space-y-4 text-sm bg-secondary/50 p-4 rounded-lg">
          <h4 className="font-headline font-semibold">AI Evaluation</h4>
          <div>
            <p className="font-semibold">Relevance Score: <span className="font-bold text-primary">{result.rank.rank}/10</span></p>
            <p className="text-muted-foreground italic text-xs">{result.rank.explanation}</p>
          </div>
           <div>
            <p className="font-semibold">Summary:</p>
            <p className="text-muted-foreground">{result.summary.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
