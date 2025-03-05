import { openai } from '../openai';
import { TokenGenerationPrompt, TokenGenerationResult } from '../../types/generation';

export async function generateTokenIdea(
  prompt: TokenGenerationPrompt
): Promise<TokenGenerationResult> {
  try {
    const promptText = constructPrompt(prompt);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a memecoin token generator. Generate creative and viral-worthy token names and descriptions. Return only JSON."
        },
        {
          role: "user",
          content: promptText
        }
      ],
      response_format: { type: "json_object" }
    });

    // Check if we have a valid response
    if (!completion.choices[0].message.content) {
      throw new Error('No content in response');
    }

    const response = JSON.parse(completion.choices[0].message.content);
    return response;
  } catch (error) {
    console.error('Error generating token idea:', error);
    throw error;
  }
}

function constructPrompt(prompt: TokenGenerationPrompt): string {
  const themeText = prompt.theme ? `Theme: ${prompt.theme}` : '';
  const styleText = prompt.style ? `Style: ${prompt.style}` : '';
  const keywordsText = prompt.keywords?.length 
    ? `Keywords: ${prompt.keywords.join(', ')}` 
    : '';

  return `
    Generate a creative memecoin token with the following parameters:
    ${themeText}
    ${styleText}
    ${keywordsText}
    
    Respond with a JSON object containing:
    - name: A catchy full name for the token
    - symbol: A 3-6 character symbol/ticker
    - description: A fun, viral-worthy description (max 200 chars)
  `.trim();
}
