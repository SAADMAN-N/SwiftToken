export interface TrendingData {
  topics: string[];
  context: string;
}

export interface TrendingSource {
  source: string;
  trends: string[];
  context?: string;
}

export interface RedditTrending {
  title: string;
  score: number;
  url: string;
  subreddit: string;
}

export interface TwitterTrending {
  topic: string;
  tweet_volume: number;
}