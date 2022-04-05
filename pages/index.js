import Head from 'next/head'
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/navbar";
import Card from "../components/card/card";
import SectionCards from "../components/card/section-cards";
import {getVideos} from "../lib/video";
import Image from 'next/image'

import styles from '../styles/Home.module.css'

//const disneyVideos = getVideos();

export async function getServerSideProps() {
    const disneyVideos = getVideos();
    return {
        props: {
            disneyVideos
        }
    }
}

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix</title>
                <meta name="description" content="Netflix clone"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <Navbar username="Asaf@gmail.com"/>
            <Banner title="Red sun" subTitle="They thought it was orange, it wasn't" imgUrl="/static/Red-Sun.jpeg" />
            <div className={styles.sectionWrapper} >
                <SectionCards title="Disney" videos={disneyVideos} size="large"/>
                <SectionCards title="Disney" videos={disneyVideos} size="medium"/>
            </div>
        </div>
    )
}
