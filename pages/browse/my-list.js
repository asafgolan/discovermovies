import Head from "next/head";
import Navbar from "../../components/nav/navbar";
import SectionCards from "../../components/card/section-cards";
import styles  from "../../styles/MyList.module.css";
import {getMyList} from "../../lib/video";
import UseRedirectUser from "../../utils/redirectUser";

export async function getServerSideProps(context) {
    const { userId, token } = await UseRedirectUser(context);
    const videos = await getMyList(userId, token);

    return {
        props: {
            myListVideos: videos,
        }
    }
}

const MyList  = ({myListVideos})=>{
    return (
        <div>
           <Head>
               <title>My List</title>
           </Head>
           <main className={styles.main}>
               <Navbar/>
               <div className={styles.sectionWrapper}>
                   <SectionCards title="watch it again " videos={myListVideos} size="small" shouldWrap={true} shouldScale={false}/>
               </div>
           </main>
        </div>
    )
}

export default MyList;
