import { openai } from '../openai';
import { gatherTrendingData } from './trendingData';
import { MemeTokenMetadata } from '@/types/memecoin';
import { TokenGenerationPrompt } from '@/types/generation';

// Fallback model - GPT-3.5-turbo is cheaper than GPT-4
const FALLBACK_MODEL = "gpt-3.5-turbo";

// Fallback tokens when OpenAI is completely unavailable
const FALLBACK_TOKENS: MemeTokenMetadata[] = [
  {
    name: "DogeMaster",
    symbol: "DMASTER",
    description: "A majestic Shiba Inu wearing a space suit and cryptocurrency symbols floating around",
    imageUrl: "",
    attributes: {
      memeScore: 85,
      viralPotential: 90,
      uniqueness: 75
    }
  },
  {
    name: "PepeKing",
    symbol: "PKING",
    description: "A smiling green Pepe the Frog wearing a crown and holding crypto coins",
    imageUrl: "",
    attributes: {
      memeScore: 95,
      viralPotential: 88,
      uniqueness: 82
    }
  },
  {
    name: "ElonRocket",
    symbol: "ELON",
    description: "Elon Musk as an anime character riding a Dogecoin rocket to the moon",
    imageUrl: "",
    attributes: {
      memeScore: 92,
      viralPotential: 95,
      uniqueness: 78
    }
  },
  {
    name: "CatCoin",
    symbol: "CATC",
    description: "A cute cat wearing sunglasses and a bitcoin necklace",
    imageUrl: "",
    attributes: {
      memeScore: 88,
      viralPotential: 85,
      uniqueness: 80
    }
  }
];

export async function generateTokenIdea(prompt: TokenGenerationPrompt): Promise<MemeTokenMetadata | { error: string }> {
  try {
    const trendingData = await gatherTrendingData();
    
    // Try with GPT-4 first
    try {
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

Context: ${trendingData.context}`
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      });

      return handleCompletion(completion);
      
    } catch (error) {
      // If we hit rate limit, try fallback model
      if (error instanceof Error && 
          (error.message.includes('429') || error.message.includes('quota'))) {
        console.log('Rate limited on GPT-4, falling back to GPT-3.5-turbo');
        
        try {
          const fallbackCompletion = await openai.chat.completions.create({
            model: FALLBACK_MODEL,
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

Context: ${trendingData.context}`
              }
            ],
            temperature: 0.9,
            max_tokens: 500
          });

          return handleCompletion(fallbackCompletion);
        } catch (fallbackError) {
          // If both models fail, use fallback tokens
          console.log('Both models failed, using fallback token');
          const randomToken = FALLBACK_TOKENS[Math.floor(Math.random() * FALLBACK_TOKENS.length)];
          return randomToken;
        }
      }
      
      throw error;
    }

  } catch (error) {
    console.error('Error generating token:', error);
    // Last resort - return a fallback token
    const randomToken = FALLBACK_TOKENS[Math.floor(Math.random() * FALLBACK_TOKENS.length)];
    return randomToken;
  }
}

function handleCompletion(completion: any) {
  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error('No content in response');
  }

  const parsedContent = JSON.parse(content);
  
  // Ensure we use the actual generated image or fallback to placeholder
  const tokenData = parsedContent as MemeTokenMetadata;
  if (!tokenData.imageUrl) {
    tokenData.imageUrl = "https://placehold.co/1024x1024/png";
  }
  
  return tokenData;
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
