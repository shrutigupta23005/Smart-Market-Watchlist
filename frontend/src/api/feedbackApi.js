import axiosClient from './axiosClient';

export const submitFeedbackApi = (feedbackData) =>
  axiosClient.post('/feedback', feedbackData);

export const getFeedbackSummaryApi = () =>
  axiosClient.get('/feedback/summary');
