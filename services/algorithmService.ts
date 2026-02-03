
import { Post, User } from '../types';

/**
 * Carlin Relevance Engine v5.2
 * Highly optimized ranking based on following status, tags, and engagement.
 */

// Simulated "Following" list for the demonstration of the algorithm
// In a real app, this would come from the database/user profile
const USER_FOLLOWS = ["Carlin", "AmigoY", "expert_0", "expert_5"];
const USER_TAGS = ["ClashRoyale", "Marketing Digital", "Growth"];

export const updateInteraction = (user: User, post: Post, type: 'like' | 'share' | 'comment'): { updatedPost: Post, updatedUser: User } => {
  let increment = 0;
  if (type === 'like') increment = 1;
  if (type === 'share') increment = 2;
  if (type === 'comment') increment = 3;

  const updatedPost = {
    ...post,
    trendingScore: post.trendingScore + increment,
    likes: type === 'like' ? post.likes + 1 : post.likes,
    comments: type === 'comment' ? post.comments + 1 : post.comments,
    shares: type === 'share' ? post.shares + 1 : post.shares
  };

  const updatedUser = {
    ...user,
    viewedContent: [...new Set([...user.viewedContent, post.id])]
  };

  return { updatedPost, updatedUser };
};

export const rankFeed = (posts: Post[], user: User): Post[] => {
  const now = new Date();

  return posts
    .filter(post => !user.viewedContent.includes(post.id))
    .map(post => {
      let score = 0;

      // 1. Weight: Following status (High Priority)
      const isFollowing = USER_FOLLOWS.includes(post.username) || USER_FOLLOWS.includes(post.autor_id);
      if (isFollowing) score += 2.5;

      // 2. Weight: Tags / Categories (Medium Priority)
      const isInterested = user.interests.includes(post.category) || USER_TAGS.includes(post.category);
      if (isInterested) score += 3.0;

      // 3. Weight: Trending & Engagement (Engagement Ratio)
      const engagementScore = (post.likes * 1 + post.comments * 2 + post.shares * 3) * 0.005;
      score += engagementScore;

      // 4. Weight: Recency (Decay)
      const createdDate = new Date(post.createdAt);
      const diffHours = Math.max(1, (now.getTime() - createdDate.getTime()) / (1000 * 3600));
      const recencyScore = (1 / diffHours) * 1.5;
      score += recencyScore;

      // 5. Weight: Verification Bonus
      if (post.isVerified) score += 0.5;

      return {
        ...post,
        scores: {
          amigos: isFollowing ? 1.0 : 0,
          explorar: score,
          final: parseFloat(score.toFixed(4)),
          breakdown: {
            interest: isInterested ? 1.0 : 0,
            engagement: engagementScore,
            recency: recencyScore,
            trending: post.trendingScore / 100,
            diversity: Math.random() * 0.2
          }
        }
      };
    })
    .sort((a, b) => (b.scores?.final || 0) - (a.scores?.final || 0));
};
