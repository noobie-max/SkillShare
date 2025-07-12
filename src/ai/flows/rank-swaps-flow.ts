'use server';

/**
 * @fileOverview Ranks swap requests based on the relevance of offered skills to wanted skills.
 *
 * - rankSwapRequests - A function that ranks swap requests.
 * - RankSwapRequestsInput - The input type for the rankSwapRequests function.
 * - RankSwapRequestsOutput - The return type for the rankSwapRequests function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankSwapRequestsInputSchema = z.object({
  offeredSkills: z.array(z.string()).describe('List of skills offered by the requester.'),
  wantedSkills: z.array(z.string()).describe('List of skills wanted by the user.'),
});
export type RankSwapRequestsInput = z.infer<typeof RankSwapRequestsInputSchema>;

const RankSwapRequestsOutputSchema = z.object({
  rank: z.number().describe('A numerical rank indicating the relevance of the offered skills to the wanted skills. Higher values indicate greater relevance.'),
  explanation: z.string().describe('Explanation of the ranking.'),
});
export type RankSwapRequestsOutput = z.infer<typeof RankSwapRequestsOutputSchema>;

export async function rankSwapRequests(input: RankSwapRequestsInput): Promise<RankSwapRequestsOutput> {
  return rankSwapRequestsFlow(input);
}

const rankSwapRequestsPrompt = ai.definePrompt({
  name: 'rankSwapRequestsPrompt',
  input: {schema: RankSwapRequestsInputSchema},
  output: {schema: RankSwapRequestsOutputSchema},
  prompt: `You are an AI expert specializing in ranking skill swap requests based on relevance.

You will be provided with a list of offered skills and a list of wanted skills.
Your task is to rank the swap request on a scale of 1 to 10, with 10 being the most relevant.
Explain the ranking you have given.

Offered Skills: {{offeredSkills}}
Wanted Skills: {{wantedSkills}}`,
});

const rankSwapRequestsFlow = ai.defineFlow(
  {
    name: 'rankSwapRequestsFlow',
    inputSchema: RankSwapRequestsInputSchema,
    outputSchema: RankSwapRequestsOutputSchema,
  },
  async input => {
    const {output} = await rankSwapRequestsPrompt(input);
    return output!;
  }
);
