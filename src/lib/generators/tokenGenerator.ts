import { openai } from '../openai';
import { gatherTrendingData } from './trendingData';
import { MemeTokenMetadata } from '@/types/memecoin';
import { TokenGenerationPrompt } from '@/types/generation';
import { TrendingData } from '@/types/trending';

const PLACEHOLDER_IMAGE = "https://placehold.co/1024x1024/png";

export async function generateTokenIdea(prompt: TokenGenerationPrompt): Promise<MemeTokenMetadata | { error: string }> {
  try {
    const trendingData = await gatherTrendingData();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a memecoin generator. Generate ONE single memecoin based on current trends. The description MUST be a detailed visual scene that can be used for image generation. Return ONLY a valid JSON object with the following structure exactly: {\"name\": string, \"symbol\": string, \"description\": string, \"imageUrl\": string, \"attributes\": {\"memeScore\": number, \"viralPotential\": number, \"uniqueness\": number}}"
        },
        {
          role: "user",
          content: `Create a highly memeable token based on these current trends:

Reddit Trends:
${trendingData.topics.join('\n')}

Context: ${trendingData.context}

Requirements:
- Name: creative full name (can be provocative)
- Symbol: 3-6 letters
- Description: MUST be a detailed visual scene description (example: "pepe in soldiers uniform fighting in a war, holding a crypto flag")
- imageUrl: use "${PLACEHOLDER_IMAGE}"
- Attributes:
  - memeScore: number between 70-100
  - viralPotential: number between 70-100
  - uniqueness: number between 70-100

Make sure the description is VERY specific and detailed for image generation.`
        }
      ],
      temperature: 0.9,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in response');
    }

    const parsedContent = JSON.parse(content);
    
    // Ensure we use the actual generated image or fallback to placeholder
    const tokenData = parsedContent as MemeTokenMetadata;
    if (!tokenData.imageUrl) {
      tokenData.imageUrl = PLACEHOLDER_IMAGE;
    }
    
    return tokenData;

  } catch (error) {
    console.error('Error generating token:', error);
    return { error: 'Failed to generate token' };
  }
}

function constructPrompt(prompt: TokenGenerationPrompt): string {
  return `Theme: ${prompt.theme || 'Current meme trends'}
Style: ${prompt.style || 'Humorous and viral'}
Keywords: ${prompt.keywords?.join(', ') || 'crypto, viral, moon'}`;
}

function analyzeNewsRelevance(trendingData: TrendingData): string {
  const newsTopics = trendingData.topics
    .filter(topic => topic.startsWith('NEWS:'))
    .map(topic => topic.replace('NEWS:', '').trim());
  
  return newsTopics.length > 0 
    ? `Key news trends: ${newsTopics.join(', ')}`
    : 'No significant news trends identified';
}

function analyzeSocialTrends(trendingData: TrendingData): string {
  const socialTopics = trendingData.topics
    .filter(topic => topic.startsWith('SOCIAL:'))
    .map(topic => topic.replace('SOCIAL:', '').trim());
  
  return socialTopics.length > 0
    ? `Viral social topics: ${socialTopics.join(', ')}`
    : 'No significant social trends identified';
}
