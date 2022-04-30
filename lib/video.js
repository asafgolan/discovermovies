import videoTestData from '../data/videos.json';
import {getMyListVideos, getWatchedVideos} from './db/hasura'


const fetchVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    const BASE_URL = 'youtube.googleapis.com/youtube/v3';
    const response = await fetch(`https://${BASE_URL}/${url}&key=${YOUTUBE_API_KEY}`);
    return await response.json();
}

export const getCommonVideos = async (url) => {
    try {
        const isDev = process.env.DEVELOPMENT;
        const data = isDev ? videoTestData : await fetchVideos(url);
        if (data?.error) {
            console.log('YOUTUBE API ERROR', data.error)
            return []
        }


        return data.items.map((item)=>{
            const id = item?.id?.videoId || item.id;
            return{
                title: item.snippet.title,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                id,
                description: item.snippet.description,
                publishTime: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle,
                viewCount: item.statistics ? item.statistics : {viewCount: 0},


            }
        });
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const getVideos = (searchQuery) => {
    return getCommonVideos(`search?part=snippet&maxResults=2&q=${searchQuery}`)
}

export const getYoutubeVideoById = (videoId) => {
    return getCommonVideos(`videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`)
}

export const getWatchItAgainVideos = async (userId, token) => {
    const videos = await getWatchedVideos(userId, token);
    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
        };
    }) || [];
};

export const getMyList = async (userId, token) => {
    const videos = await getMyListVideos(userId, token);
    return videos?.map((video) => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
        };
    }) || [];
};
// GET https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=MdtyruRMlns&key=[YOUR_API_KEY] HTTP/1.1
//
//     Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json
