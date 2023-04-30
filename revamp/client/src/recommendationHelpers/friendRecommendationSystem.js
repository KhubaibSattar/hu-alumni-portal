
import { fetchAllPosts } from "../api";

const cosineSimilarity = (vectorA, vectorB) => {

  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    console.error('Invalid input vectors:', vectorA, vectorB);
    return 0;
  }
    const dotProduct = vectorA.reduce((sum, a, index) => sum + a * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
  
  
    const similarity = (magnitudeA === 0 || magnitudeB === 0) ? 0 : dotProduct / (magnitudeA * magnitudeB);
    
  
    return similarity;
  };


  
  
  export const createInteractionMatrix = async (users) => {
    const interactionMatrix = [];
    const usersWithSkills = users.filter(user => user.skills && user.skills[0]);
    try {
      for (const userA of usersWithSkills) {
        const userSkillsA = userA.skills[0].split('\n').map(skill => skill.trim());
        const interactionVector = new Array(usersWithSkills.length).fill(0);
  
        for (const userB of usersWithSkills) {
          if (userA._id !== userB._id) {
            const userSkillsB = userB.skills[0].split('\n').map(skill => skill.trim());
            const commonSkills = userSkillsA.filter(skill => userSkillsB.includes(skill)).length;
            
            interactionVector[usersWithSkills.findIndex((user) => user._id === userB._id)] = commonSkills;
          }
        }
  
        interactionMatrix.push({
          userId: userA._id,
          vector: interactionVector,
        });
      }
    } catch (error) {
      console.error("Error creating interaction matrix:", error);
    }
    console.log("Interaction Matrix:", interactionMatrix);
  
    return interactionMatrix;
  };
  
  
  
  
  
  
  // 2. Calculate similarity scores
  export const calculateSimilarityScores = async (interactionMatrix) => {
   
    const numUsers = interactionMatrix.length;
    const similarityScores = [];
  
    for (let i = 0; i < numUsers; i++) {
      const userSimilarities = [];
      for (let j = 0; j < numUsers; j++) {
        const similarity = cosineSimilarity(interactionMatrix[i].vector, interactionMatrix[j].vector);
        userSimilarities.push({ userId: interactionMatrix[j].userId, similarity });
      }
      similarityScores.push({ userId: interactionMatrix[i].userId, scores: userSimilarities }); // Add the userId property here
    }
    console.log("Interaction Matrix:", interactionMatrix);
    console.log("Similarity Scores:", similarityScores);
    return similarityScores;
  };

  export const generateFriendRecommendations = (targetUserId, allUsersData, similarityScores) => {
    const finalSimilarityScores = [];
    console.log("target: ", targetUserId);
    const currentUserScores = similarityScores.find(row => row.userId === targetUserId).scores.slice(1); // Start from the second element
    
    for (let otherUser of similarityScores.find(row => row.userId === targetUserId).scores) {

      if (targetUserId !== otherUser.userId) {
        if (otherUser) {
          finalSimilarityScores.push({
            userId: otherUser.userId,
            similarity: otherUser.similarity,
          });
        } else {
          console.warn(`Score not found for user: ${otherUser.userId}`);
        }
      }
    }
  
    console.log("Final Similarity Scores:", finalSimilarityScores);
    return finalSimilarityScores;
  };
  
  