// @ts-ignore
import trigramSimilarity from "trigram-similarity";

const TRIGRAM_SIMILARITY_THRESHOLD = 0.3; // same value as postgresql

/**
 * Calculates the trigram similarity of the two provided strings.
 */
export function calculateSimilarity(s1: string, s2: string) {
  return trigramSimilarity(s1, s2);
}

/**
 * Values for `similarity` greater-than-or-equal to the `TRIGRAM_SIMILARITY_THRESHOLD` are considered similar.
 * @param similarity A numeric value between 0 and 1
 */
export function isSimilar(similarity: number) {
  return similarity >= TRIGRAM_SIMILARITY_THRESHOLD;
}
