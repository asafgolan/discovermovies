import Head from 'next/head'
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import {getVideos, getWatchItAgainVideos} from "../lib/video";
import { verifyToken } from "../lib/utils";
import UseRedirectUser from "../utils/redirectUser";
import styles from '../styles/Home.module.css'


export async function getServerSideProps(context) {
    const { userId, token } = await UseRedirectUser(context);

    const watchItAgainVideos = await getWatchItAgainVideos(userId, token);



    const disneyVideos = await getVideos('disney%20trailer');
    const travelVideos = await getVideos('travel');
    const productivityVideos = await getVideos('productivity');
    return {
        props: {
            disneyVideos,
            travelVideos,
            productivityVideos,
            watchItAgainVideos
        }
    }
}

export default function Home({disneyVideos,
                                 travelVideos,
                                 productivityVideos,
                                 watchItAgainVideos  = []
                                 }) {

    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix</title>
                <meta name="description" content="Netflix clone"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <div className={styles.main}>
                <Navbar username="Asaf@gmail.com"/>
                <Banner id="MdtyruRMlns" title="Red sun" subTitle="They thought it was orange, it wasn't" imgUrl="/static/Red-Sun.jpeg" />
                <div className={styles.sectionWrapper} >
                    <SectionCards title="Disney" videos={disneyVideos} size="large"/>
                    <SectionCards title="watch it again " videos={watchItAgainVideos} size="small"/>
                    <SectionCards title="Travel" videos={travelVideos} size="small"/>
                    <SectionCards title="productivity" videos={productivityVideos} size="medium"/>
                    <SectionCards title="popular" videos={productivityVideos} size="small"/>

                </div>
            </div>
        </div>
    )
}
