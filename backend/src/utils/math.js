/**
 * Math utilities for statistical z-scores, standard deviation, and clamping
 */

const clamp = (val, min = 0, max = 100) => {
  return Math.min(Math.max(val, min), max);
};

const calculateMean = (values = []) => {
  if (!values.length) return 0;
  const sum = values.reduce((acc, v) => acc + v, 0);
  return sum / values.length;
};

const calculateStdDev = (values = [], mean = null) => {
  if (values.length <= 1) return 0.001; // epsilon floor
  const m = mean !== null ? mean : calculateMean(values);
  const variance = values.reduce((acc, v) => acc + Math.pow(v - m, 2), 0) / (values.length - 1);
  return Math.max(Math.sqrt(variance), 0.001); // avoid divide-by-zero
};

const calculateZScore = (value, mean, stddev, epsilon = 0.001) => {
  const safeStdDev = Math.max(stddev, epsilon);
  return (value - mean) / safeStdDev;
};

module.exports = {
  clamp,
  calculateMean,
  calculateStdDev,
  calculateZScore
};
