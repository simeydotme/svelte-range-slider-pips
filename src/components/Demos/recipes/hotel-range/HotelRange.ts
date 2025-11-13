/**
 * Helper functions to generate random hotel prices across a distribution.
 * Normally this data would be fetched from an API.
 */

/**
 * Generate a random value from a skewed normal distribution.
 * @param mean - The mean of the distribution.
 * @param stdDev - The standard deviation of the distribution.
 * @param skewness - The skewness of the distribution.
 * @returns A random value from the skewed normal distribution.
 */
export function skewedNormalRandom(mean: number, stdDev: number, skewness: number): number {
  // Generate random values, ensuring they're not too close to 0
  const u = Math.max(1e-10, Math.random());
  const v = Math.random(); // Can safely go up to (but not including) 1

  // Box-Muller transform
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  // Apply skewness
  // - positive skewness means longer tail to the right
  // - negative skewness means longer tail to the left
  const skewedZ = z + (skewness * (z * z - 1)) / 6;

  return mean + skewedZ * stdDev;
}

/**
 * Options for the skewed normal distribution.
 * @param min - The minimum value of the distribution.
 * @param max - The maximum value of the distribution.
 * @param mean - The mean of the distribution.
 * @param stdDev - The standard deviation of the distribution.
 * @param skewness - The skewness of the distribution.
 * @param maxAttempts - The maximum number of attempts to sample a value from the distribution.
 */
interface SkewedNormalOptions {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  skewness: number;
  maxAttempts?: number;
}

/**
 * Sample a value from a skewed normal distribution, falling back to a random value if the skewed normal distribution
 * doesn't produce a value within the min and max.
 * @param options - The options for the skewed normal distribution.
 * @returns A value from the skewed normal distribution.
 */
export function sampleSkewedNormal(options: SkewedNormalOptions): number {
  const { min, max, mean, stdDev = mean / 2, skewness = 0, maxAttempts = 50 } = options;

  let value: number;
  let attempts: number = 0;

  // try to sample a price between min and maxPrice, along the skewed normal distribution
  do {
    value = Math.round(skewedNormalRandom(mean, stdDev, skewness));
    attempts++;
    if (value >= min && value <= max) break;
  } while (attempts < maxAttempts);

  // Fallback if we can't find a price along the skewed normal distribution
  if (attempts >= maxAttempts) {
    value = Math.floor(Math.random() * (max - min)) + min;
  }

  return value;
}
