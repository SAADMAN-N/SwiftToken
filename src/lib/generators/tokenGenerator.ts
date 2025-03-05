import { openai } from '../openai';
import { TokenGenerationPrompt } from '../../types/generation';
import { MemeTokenMetadata } from '../../types/memecoin';
import { gatherTrendingData } from './trendingData';
import { TrendingData } from '../../types/trending';
import { generateTokenImage } from './imageGenerator';

export async function generateTokenIdea(
  prompt: TokenGenerationPrompt
): Promise<MemeTokenMetadata | { error: string }> {
  try {
    const trendingData = await gatherTrendingData();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a crypto memecoin expert specializing in viral political and tech trends. Focus on creating memecoins inspired by controversial figures like Trump, Elon Musk, or major political events. Make it provocative but not offensive, with high viral potential."
        },
        {
          role: "user",
          content: `Create a highly memeable token based on these current trends:

Reddit Trends:
${trendingData.topics.join('\n')}

Context: ${trendingData.context}

Focus on:
- Political drama and controversies
- Tech billionaire actions/tweets
- Viral social media moments
- Current political events

Requirements:
- Name: creative full name (can be provocative)
- Symbol: 3-6 letters
- Description: viral description with emojis, reference current events
- imageUrl: use "https://raw.githubusercontent.com/your-org/your-repo/main/placeholder.png"
- Attributes:
  - memeScore: number between 70-100
  - viralPotential: number between 70-100
  - uniqueness: number between 70-100

Respond with ONLY a JSON object matching the exact structure above.`
        }
      ],
      temperature: 0.9, // Increased for more creative results
      max_tokens: 500
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    try {
      const parsedResponse = JSON.parse(content.trim()) as MemeTokenMetadata;
      
      // Generate image for the token
      const imageUrl = await generateTokenImage(parsedResponse);
      if (imageUrl) {
        parsedResponse.imageUrl = imageUrl;
      } else {
        parsedResponse.imageUrl = "https://raw.githubusercontent.com/your-org/your-repo/main/default-token.png";
      }

      return parsedResponse;
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw content:", content);
      return { error: "Failed to parse token generation response" };
    }
  } catch (error) {
    console.error("Token Generation Error:", error);
    return { error: "Failed to generate token idea" };
  }
}

function constructPrompt(prompt: TokenGenerationPrompt): string {
  return `Theme: ${prompt.theme || 'Current meme trends'}
Style: ${prompt.style || 'Humorous and viral'}
Keywords: ${prompt.keywords?.join(', ') || 'crypto, viral, moon'}`;
}

function analyzeNewsRelevance(trendingData: TrendingData): string {
  // Filter and analyze news-specific trends
  const newsTopics = trendingData.topics
    .filter((topic: string) => topic.startsWith('NEWS:'))
    .map((topic: string) => topic.replace('NEWS:', '').trim());
  
  return newsTopics.length > 0 
    ? `Key news trends: ${newsTopics.join(', ')}`
    : 'No significant news trends identified';
}

function analyzeSocialTrends(trendingData: TrendingData): string {
  // Analyze social media specific trends
  const socialTopics = trendingData.topics
    .filter((topic: string) => topic.startsWith('SOCIAL:'))
    .map((topic: string) => topic.replace('SOCIAL:', '').trim());
  
  return socialTopics.length > 0
    ? `Viral social topics: ${socialTopics.join(', ')}`
    : 'No significant social trends identified';
}
