'use server';

/**
 * @fileOverview A chat agent that responds to user queries.
 *
 * - chatWithAgent - A function that handles the AI chat agent process.
 * - ChatAgentInput - The input type for the chatWithAgent function.
 * - ChatAgentOutput - The return type for the chatWithAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatAgentInputSchema = z.object({
  query: z.string().describe('The user query for the AI agent.'),
  history: z.array(z.object({
      role: z.enum(['user', 'model']),
      content: z.string(),
  })).describe('The chat history between the user and the model.')
});
export type ChatAgentInput = z.infer<typeof ChatAgentInputSchema>;

const ChatAgentOutputSchema = z.object({
  response: z.string().describe('The AI agent\'s response.'),
});
export type ChatAgentOutput = z.infer<typeof ChatAgentOutputSchema>;


export async function chatWithAgent(input: ChatAgentInput): Promise<ChatAgentOutput> {
  return chatAgentFlow(input);
}

const chatAgentPrompt = ai.definePrompt({
    name: 'chatAgentPrompt',
    input: { schema: ChatAgentInputSchema },
    output: { schema: ChatAgentOutputSchema },
    prompt: `You are a helpful AI assistant within a skill-swapping application called SkillSync.
Your goal is to provide concise and helpful answers to user questions.
The user will have tagged you in a chat with another user.
Do not be overly verbose. Answer the user's question directly.

User's Question:
"{{query}}"

Chat History (for context):
{{#each history}}
- {{role}}: {{content}}
{{/each}}
`,
});

const chatAgentFlow = ai.defineFlow(
  {
    name: 'chatAgentFlow',
    inputSchema: ChatAgentInputSchema,
    outputSchema: ChatAgentOutputSchema,
  },
  async (input) => {
    const {output} = await chatAgentPrompt(input);
    return output!;
  }
);
