import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { magic } from "../lib/magic-client";

import styles from "../styles/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const handleComplete = () => {
            setIsLoading(false);
        };
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    }, [router]);

    const handleOnChangeEmail = (e) => {
        setUserMsg("");
        const email = e.target.value;
        setEmail(email);
    };

    const handleLoginWithEmail = async (e) => {
        e.preventDefault();
        if(email){
            // log in a user by their email
            try {
                setIsLoading(true);

                const didToken =  await magic.auth.loginWithMagicLink({ email });

                if(didToken) {

                    const response = await fetch("/api/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${didToken}`
                        },
                    });

                    const loggedInResponse = await response.json();
                    if (loggedInResponse) {
                        console.log({loggedInResponse});
                        if (loggedInResponse.done === true){
                            router.push("/");
                        }else{
                            setIsLoading(false)
                            setUserMsg("Someting went wrong logging in");
                        }
                    }
                    //router.push("/");
                }
            } catch (error){
                // Handle errors if required!
                setIsLoading(false);
                console.log("something went wrong",error);
            }
        }else {
            // show user message
            setIsLoading(false);
            setUserMsg("Enter a valid email address");
        }
    };
    return (
        <div className={styles.container}>
            <Head>
                <title>Netflix SignIn</title>
            </Head>

            <header className={styles.header}>
                <div className={styles.headerWrapper}>
                    <a className={styles.logoLink} href="/">
                        <div className={styles.logoWrapper}>
                            <Image
                                src="/static/netflix.svg"
                                alt="Netflix logo"
                                width="128px"
                                height="34px"
                            />
                        </div>
                    </a>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.mainWrapper}>
                    <h1 className={styles.signinHeader}>Sign In</h1>

                    <input
                        type="text"
                        placeholder="Email address"
                        className={styles.emailInput}
                        onChange={handleOnChangeEmail}
                    />

                    <p className={styles.userMsg}>{userMsg}</p>
                    <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
                        {isLoading ? "Loading..." : "Sign In"}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Login;



(async () => {
    try {
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        if (email) {
            setUsername(email);
            setDidToken(didToken);
            console.log(email, didToken)
        }
    } catch (error) {
        console.error("Error retrieving email", error);
    }
})()