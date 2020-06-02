import ApiService from './api.service';

export default {
  search(phrase, prevPageToken = '', nextPageToken = '') {
    const pageToken = prevPageToken || nextPageToken;
    return ApiService.get(`/api/data/search?q=${phrase}&pageToken=${pageToken}`);
  },
  getPlaylists(channelId, prevPageToken = '', nextPageToken = '') {
    const pageToken = prevPageToken || nextPageToken;
    return ApiService.get(`/api/data/playlists?channelId=${channelId}&pageToken=${pageToken}`);
  },
  getPlaylistItems(playlistId, prevPageToken = '', nextPageToken = '') {
    const pageToken = prevPageToken || nextPageToken;
    return ApiService.get(`/api/data/playlistItems?playlistId=${playlistId}&pageToken=${pageToken}`);
  },
  getVideos(idList, prevPageToken = '', nextPageToken = '') {
    const pageToken = prevPageToken || nextPageToken;
    return ApiService.get(`/api/data/videos?idList=${idList}&pageToken=${pageToken}`);
  },
};
