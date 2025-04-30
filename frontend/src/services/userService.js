import API from './api.js';

export const getAggregatedFeed = async () => {
  const { data } = await API.get('/feed/feeds');
  return data;
};

export const getSavedFeeds = async () => {
  const { data } = await API.get('/feed/saved');
  return data;
};

export const saveFeed = async (feedData) => {
  const { data } = await API.post('/feed/save', feedData);
  return data;
};

export const unsaveFeed = async (feedData) => {
  // axios.delete takes URL and { data: body }
  const { data } = await API.delete('/feed/unsave', { data: feedData })
  return data
}

export const reportFeed = async (feedData) => {
  const { data } = await API.post('/feed/report', feedData);
  return data;
};

export const getTransactionHistory = async () => {
  const { data } = await API.get('/credits/history');
  return data;
};

export const checkFeedSaved = async ({ contentId, contentType }) => {
  const { data } = await API.get('/feed/saved/check', {
    params: { contentId, contentType }
  });
  return data; // { isSaved: true/false }
};
