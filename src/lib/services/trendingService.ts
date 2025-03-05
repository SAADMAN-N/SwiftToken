import { z } from 'zod';

interface RedditTrending {
  title: string;
  score: number;
  url: string;
  subreddit: string;
}

interface TwitterTrending {
  topic: string;
  tweet_volume: number;
}

interface TrendingSource {
  source: string;
  trends: string[];
  context?: string;
}

const redditSchema = z.object({
  data: z.object({
    children: z.array(
      z.object({
        data: z.object({
          title: z.string(),
          score: z.number(),
          url: z.string(),
          subreddit: z.string(),
        }),
      })
    ),
  }),
});

let lastTwitterFetch = 0;
const TWITTER_RATE_LIMIT = 15 * 60 * 1000; // 15 minutes in milliseconds
const TWITTER_CACHE: { data: TwitterTrending[], timestamp: number } = {
  data: [],
  timestamp: 0
};

export async function getTrendingTopics(): Promise<TrendingSource[]> {
  try {
    console.log('Fetching trending topics...');
    
    const [redditTrends, twitterTrends, newsTrends] = await Promise.all([
      getRedditTrending(),
      getTwitterTrending(),
      getNewsTrending(),
    ]);

    // Log the raw data
    console.log('Reddit Trends:', redditTrends);
    console.log('Twitter Trends:', twitterTrends);
    console.log('News Trends:', newsTrends);

    const sources = [
      {
        source: 'Reddit',
        trends: redditTrends.map(t => t.title),
        context: `Top trending from r/${redditTrends[0]?.subreddit}`
      },
      {
        source: 'Twitter',
        trends: twitterTrends.map(t => t.topic),
        context: `Volume: ${twitterTrends[0]?.tweet_volume || 0} tweets`
      },
      {
        source: 'News',
        trends: newsTrends,
      }
    ];

    // Log the formatted data
    console.log('Formatted Sources:', sources);
    
    return sources;
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return [];
  }
}

async function getRedditTrending(): Promise<RedditTrending[]> {
  try {
    const response = await fetch(
      'https://www.reddit.com/r/all/hot.json?limit=10',
      {
        headers: {
          'User-Agent': 'SwiftToken/1.0.0'
        }
      }
    );
    
    const data = await response.json();
    const validated = redditSchema.parse(data);
    
    return validated.data.children.map(child => ({
      title: child.data.title,
      score: child.data.score,
      url: child.data.url,
      subreddit: child.data.subreddit
    }));
  } catch (error) {
    console.error('Reddit API error:', error);
    return [];
  }
}

async function getTwitterTrending(): Promise<TwitterTrending[]> {
  const now = Date.now();
  
  // Return cached data if within rate limit window
  if (now - TWITTER_CACHE.timestamp < TWITTER_RATE_LIMIT) {
    return TWITTER_CACHE.data;
  }

  const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  
  if (!TWITTER_BEARER_TOKEN) {
    console.warn('Twitter API token not configured');
    return [];
  }

  try {
    const response = await fetch(
      'https://api.twitter.com/2/trends/place?id=1', // 1 = worldwide
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`
        }
      }
    );
    
    const data = await response.json();
    const trends = data[0]?.trends || [];
    
    // Update cache
    TWITTER_CACHE.data = trends;
    TWITTER_CACHE.timestamp = now;
    
    return trends;
  } catch (error) {
    console.error('Twitter API error:', error);
    // Return cached data on error
    return TWITTER_CACHE.data;
  }
}

async function getNewsTrending(): Promise<string[]> {
  const NEWS_API_KEY = process.env.NEWS_API_KEY;
  
  if (!NEWS_API_KEY) {
    console.warn('News API key not configured');
    return [];
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&apiKey=${NEWS_API_KEY}`
    );
    
    const data = await response.json();
    return data.articles
      .slice(0, 5)
      .map((article: any) => article.title);
  } catch (error) {
    console.error('News API error:', error);
    return [];
  }
}
