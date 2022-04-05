import videoData from '/Users/asafgolan/Library/Application Support/JetBrains/PhpStorm2021.3/scratches/scratch_16.json';

export const getVideos = () =>{
    return videoData.items.map((item)=>{
        return{
            title: item.snippet.title,
            imgUrl: item.snippet.thumbnails.high.url,
            id: item?.id?.videoId

        }
    });
}
