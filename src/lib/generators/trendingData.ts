import { openai } from '../openai';
import { getTrendingTopics } from '../services/trendingService';

interface TrendingData {
  topics: string[];
  context: string;
}

export async function gatherTrendingData(): Promise<TrendingData> {
  try {
    // Get real-time trending data
    const trendingSources = await getTrendingTopics();
    
    // Format the trending data for the AI
    const trendingContext = trendingSources
      .map(source => `${source.source} Trends:\n${source.trends.join('\n')}`)
      .join('\n\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a trend analysis expert. Analyze the provided real-time trending topics and identify the most relevant trends for a potential memecoin. Format the response as JSON with 'topics' (array of trending topics) and 'context' (brief summary of why these are trending)."
        },
        {
          role: "user",
          content: `Here are the current trending topics across platforms:\n\n${trendingContext}\n\nAnalyze these trends and identify the most memeable and viral potential topics for a cryptocurrency.`
        }
      ],
      temperature: 1,
      max_tokens: 500
    });

    const content = completion.choices[0].message.content;
    return JSON.parse(content || '{"topics":[], "context":""}');
  } catch (error) {
    console.error('Error gathering trending data:', error);
    return { topics: [], context: '' };
  }
}
