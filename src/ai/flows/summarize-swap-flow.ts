'use server';
/**
 * @fileOverview A skill swap summarization AI agent.
 *
 * - summarizeSwap - A function that handles the skill swap summarization process.
 * - SummarizeSwapInput - The input type for the summarizeSwap function.
 * - SummarizeSwapOutput - The return type for the summarizeSwap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeSwapInputSchema = z.object({
  offeredSkill: z.string().describe('The skill being offered in the swap.'),
  requestedSkill: z.string().describe('The skill being requested in the swap.'),
  userDetails: z.string().describe('Details about the users involved in the swap, including their experience levels and goals.'),
});
export type SummarizeSwapInput = z.infer<typeof SummarizeSwapInputSchema>;

const SummarizeSwapOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the skill swap, including key expectations and potential benefits.'),
});
export type SummarizeSwapOutput = z.infer<typeof SummarizeSwapOutputSchema>;

export async function summarizeSwap(input: SummarizeSwapInput): Promise<SummarizeSwapOutput> {
  return summarizeSwapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSwapPrompt',
  input: {schema: SummarizeSwapInputSchema},
  output: {schema: SummarizeSwapOutputSchema},
  prompt: `You are an expert skill swap summarizer, skilled at taking the details of a skill swap and creating a concise summary.

  Given the following information, create a summary of the skill swap. Focus on what each participant should expect to gain, and what they are expected to contribute.

  Offered Skill: {{{offeredSkill}}}
  Requested Skill: {{{requestedSkill}}}
  User Details: {{{userDetails}}}

  Summary:`,
});

const summarizeSwapFlow = ai.defineFlow(
  {
    name: 'summarizeSwapFlow',
    inputSchema: SummarizeSwapInputSchema,
    outputSchema: SummarizeSwapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
