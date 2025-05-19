import { Job, Member } from "./data";
import {
  STOP_WORDS,
  K,
  POSITVE_NEIGHBOUR,
  NEGATIVE_NEIGHBOUR,
  JOB_SCORE_MULTIPLIER,
  NEGATIVE_LOCATION_SCORE,
  POSITIVE_LOCATION_SCORE,
  NEUTRAL_LOCATION_SCORE,
} from "./constants";

export interface CustomMember extends Member {
  jobsScore: number[];
  recommendedJob: Job | null;
}

/**
 * Loops through each member to get their job recomendation
 * the recommended job is added to the member object as CustomMember
 */
export const getAllJobRecommendations = (members: Member[], jobs: Job[]) => {
  // Normalize jobs
  const normalizedJobs = normalizeJobs(jobs);

  for (let i = 0; i < members.length; i++) {
    const recommendedJobIndex = getJobRecomendation(
      members[i] as CustomMember,
      normalizedJobs
    );
    (members[i] as CustomMember).recommendedJob =
      recommendedJobIndex !== null ? jobs[recommendedJobIndex] : null;
  }
};

/**
 * Returns the index of the job recommended for the member
 */
export const getJobRecomendation = (
  member: CustomMember,
  jobs: Job[]
): number | null => {
  // Keep the max score to return with each member
  let maxScore = 0;
  let maxScoreIndex = null;
  member.jobsScore = [];
  const bioWords = normalizeMembersBio(member.bio);

  for (let i = 0; i < bioWords.length; i++) {
    const word = bioWords[i];
    for (let j = 0; j < jobs.length; j++) {
      const job = jobs[j];
      // Get a score based on the accurary of the word VS the title of the job
      const score = job.title.includes(word)
        ? (word.length / job.title.length) * JOB_SCORE_MULTIPLIER
        : 0;
      // Get a score based on the location
      let locationScore = 0;
      // Check neighbour context, positive/negative/neutral
      if (word == job.location) {
        locationScore = checkKNeighbours(bioWords, i, K);
      }
      if (member.jobsScore.length - 1 < j) {
        member.jobsScore.push(locationScore + score);
      } else {
        member.jobsScore[j] += locationScore + score;
        if (member.jobsScore[j] > maxScore) {
          maxScore = member.jobsScore[j];
          maxScoreIndex = j;
        }
      }
    }
  }

  return maxScoreIndex;
};

/**
 * Return a job list with title and location text normalized (lowercase)
 */
export const normalizeJobs = (jobs: Job[]): Job[] =>
  jobs.map((job) => ({
    title: job.title.toLowerCase(),
    location: job.location.toLowerCase(),
  }));

/**
 * Normalizes the member bio's text. Removes puctuation, transforms to lowercase, removes stop words and
 * converts to an array of words
 */
export const normalizeMembersBio = (bio: string): string[] => {
  let cleanBio = removePuctuation(bio).toLowerCase();
  let bioWords = wordsFromText(cleanBio);
  bioWords = removeStopWords(bioWords);
  return bioWords;
};

export const wordsFromText = (str: string): string[] => {
  return str.split(" ").map((item: string) => item);
};

/**
 * Removes puctuation from text, anything that is not a word. Numbers will be removed too.
 */
export const removePuctuation = (str: string): string => {
  return str.replace(/[^A-Za-z\s]/g, () => "");
};

/**
 * Removes words not relevant to the context to clean the text and reduce the length of words to process
 */
export const removeStopWords = (words: string[]): string[] => {
  const newWords = [];
  for (let i = 0; i < words.length; i++) {
    if (!STOP_WORDS.has(words[i])) {
      newWords.push(words[i]);
    }
  }
  return newWords;
};

/**
 * Check for positive/neutral/negative context before the word in position "pos".
 * Uses K to check up to k previous neighbouring words
 */
export const checkKNeighbours = (
  words: string[],
  pos: number,
  k: number = K
): number => {
  for (let i = 1; i <= k; i++) {
    if (pos - i >= 0 && NEGATIVE_NEIGHBOUR.has(words[pos - i])) {
      // Negative context
      return NEGATIVE_LOCATION_SCORE;
    } else if (pos - i >= 0 && POSITVE_NEIGHBOUR.has(words[pos - i])) {
      // Positive context
      return POSITIVE_LOCATION_SCORE;
    }
  }
  return NEUTRAL_LOCATION_SCORE;
};
