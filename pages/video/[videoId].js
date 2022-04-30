import {useRouter} from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import navbar from "../../components/nav/navbar";
import clsx from "classnames";
import {getYoutubeVideoById} from "../../lib/video";
import Navbar from "../../components/nav/navbar";
import LikeIcon from "../../components/icons/like-icon";
import DisLikeIcon from "../../components/icons/dislike-icon";
import {useEffect, useState} from "react";
import {magic} from "../../lib/magic-client";

Modal.setAppElement('#__next');

export async function getStaticProps(context) {
    //const res = await fetch('')
    //const posts = await res.json()
    const videoArray = await getYoutubeVideoById(context.params.videoId);
    return {
        props: {
            video: videoArray.length > 0 ? videoArray[0] : {},
        },

        revalidate: 10, // In seconds
    }
}


export async function getStaticPaths() {
    //const res = await fetch('https://.../posts')
    //const posts = await res.json()
    const listOfVideos = ["MdtyruRMlns"]

    const paths = listOfVideos.map((videoId) => ({
        params: {videoId},
    }))

    return {paths, fallback: 'blocking'}
}

const Video = ({video}) => {
    const router = useRouter()
    const {videoId} = router.query

    const [toggleLike, setToggleLike] = useState(false);
    const [toggleDisLike, setToggleDisLike] = useState(false);

    useEffect( () => {
        (async () => {
            const response = await fetch(`/api/stats?videoId=${videoId}`, {
                method: "GET",
            });
            const data = await response.json();
            if (data.length > 0) {
                const favourited = data[0].favourited;
                if (favourited === 1) {
                    setToggleLike(true);
                } else if (favourited === 0) {
                    setToggleDisLike(true);
                }
            }
        })()
    }, []);



    const runRatingService = async (favourited) => {
        return await fetch(`/api/stats`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                videoId,
                favourited
            })
        })
    }

    const handleToggleDisLike = async () => {
        const val = !toggleDisLike
        setToggleDisLike(val)
        setToggleLike(toggleDisLike)
        const favourited = val ? 0 : 1
        const response = await runRatingService(favourited)
        console.log('data', await response.json())

    }

    const handleToggleLike = async () => {
        const val = !toggleLike
        setToggleLike(val)
        setToggleDisLike(toggleLike)

        const favourited = val ? 1 : 0
        const response = await runRatingService(favourited)
    }

    const {title, publishTime, description, channelTitle, statistics: {viewsCount} = {viewsCount: 0}} = video

    return <div className={styles.container}>
        <Navbar username="Asaf@gmail.com"/>
        <Modal
            isOpen={true}
            contentLabel="watch the video"
            className={styles.modal}
            overlayClassName={styles.overlay}
            onRequestClose={() => {
                router.back()
            }}
        >
            <div>
                <iframe
                    id="ytplayer" type="text/html" width="100%" height="360"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&origin=http://example.com&controls=0&rel=0&modestbranding=1`}
                    frameBorder="0"
                    className={styles.videoPlayer}
                ></iframe>
                <div className={styles.likeDislikeBtnWrapper}>
                    <div className={styles.likeBtnWrapper}>
                        <button>
                            <div className={styles.btnWrapper} onClick={handleToggleLike}>
                                <LikeIcon selected={toggleLike}/>
                            </div>
                        </button>
                    </div>
                    <button>
                        <div className={styles.btnWrapper} onClick={handleToggleDisLike}>
                            <DisLikeIcon selected={toggleDisLike} />
                        </div>
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.modalBodyContent}>
                        <div className={styles.col1}>
                            <p className={styles.publishTime}>{publishTime}</p>
                            <p className={styles.title}>{title}</p>
                            <p className={styles.description}>{description}</p>
                        </div>
                        <div className={styles.col2}>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>
                                    Cast:
                                </span>
                                <span className={styles.channelTitle}>
                                    {channelTitle}
                                </span>
                            </p>
                            <p className={clsx(styles.subText, styles.subTextWrapper)}>
                                <span className={styles.textColor}>
                                    Views:
                                </span>
                                <span className={styles.channelTitle}>
                                    {viewsCount}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    </div>;
}

export default Video;
