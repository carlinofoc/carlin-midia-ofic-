
import { Post, User } from '../types';

/**
 * Carlin Relevance Engine v4.8
 * Lógica baseada em categorias de interesse e viralidade global
 */

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
      const isInterested = user.interests.includes(post.category);
      
      // 1. ABA AMIGOS (Score Conexão)
      const interestScoreAmigos = isInterested ? 0.5 : 0;
      const engagementScoreAmigos = (post.likes + post.comments + post.shares) * 0.0001; // Normalizado para escala
      
      const createdDate = new Date(post.createdAt);
      const diffHours = Math.max(1, (now.getTime() - createdDate.getTime()) / (1000 * 3600));
      const recencyScore = (1 / diffHours) * 0.2;

      const score_amigos = interestScoreAmigos + (engagementScoreAmigos * 0.3) + recencyScore;

      // 2. ABA EXPLORAR (Score Descoberta)
      const trendingScore = (post.trendingScore / 100) * 0.5; // Normalizado
      const interestScoreExplore = isInterested ? 0.3 : 0;
      const diversityScore = Math.random() * 0.2;

      const score_explorar = trendingScore + interestScoreExplore + diversityScore;

      return {
        ...post,
        scores: {
          amigos: parseFloat(score_amigos.toFixed(4)),
          explorar: parseFloat(score_explorar.toFixed(4)),
          final: parseFloat((score_amigos + score_explorar).toFixed(4)),
          breakdown: {
            interest: isInterested ? 0.5 : 0,
            engagement: engagementScoreAmigos,
            recency: recencyScore,
            trending: trendingScore,
            diversity: diversityScore
          }
        }
      };
    })
    .sort((a, b) => (b.scores?.final || 0) - (a.scores?.final || 0));
};
