import styles from './section-card.module.css'
import Card from "./card";
import clsx from "classnames";
import Link from 'next/link';

const SectionCards = (props) => {
    const {title,videos=[], size, shouldWrap = false, shouldScale} = props;

    return(
        <section className={styles.container}>
            <h2 className={styles.title}>{title}</h2>
            <div className={clsx(styles.cardWrapper,shouldWrap && styles.wrap)}>
                {videos.map((video,index) =>{
                    return(
                        <Link href={`/video/${video.id}`}>
                            <a>
                                <Card key={index} id={index} imgUrl={video.imgUrl} size={size} shouldScale={shouldScale}/>
                            </a>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default SectionCards;
