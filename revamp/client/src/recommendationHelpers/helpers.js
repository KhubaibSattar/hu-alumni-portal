import {
  createInteractionMatrix,
  calculateSimilarityScores,
  generateFriendRecommendations,
} from './friendRecommendationSystem';
import { get } from '../actions/dashboard';

export const getTopRecommendedUsers = async (targetUser, users) => {
  const usersArray = Object.values(users);
  const interactionMatrix = await createInteractionMatrix(usersArray);
  const similarityScores = await calculateSimilarityScores(interactionMatrix);
  const topUsers = generateFriendRecommendations(targetUser, usersArray, similarityScores);
  const sortedTopUsers = topUsers.sort((a, b) => b.similarity - a.similarity);

  // Return only the top 10 users
  const top10Users = sortedTopUsers.slice(0, 5);

  return top10Users;
};
