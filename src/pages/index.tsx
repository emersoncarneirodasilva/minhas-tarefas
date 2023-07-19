import Head from "next/head";
import Image from "next/image";

// Import Data Base
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConnection";

// Import Get Static Props
import { GetStaticProps } from "next";

// Import styles
import styles from "@/styles/Home.module.css";

// Import image
import heroImg from "../../public/assets/hero.png";

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          Minhas Tarefas | Organize suas tarefas de forma simple e dinâmica
        </title>
      </Head>

      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            src={heroImg}
            alt="Logo Minhas Tarefas"
            priority
          />
        </div>
        <h1 className={styles.title}>
          Sistema feito para você organizar <br /> suas tarefas do dia-a-dia
        </h1>

        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>
          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  );
}

// Export Get Static Props
export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tarefas");

  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);

  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60, // Será revalidada a cada 60 segundos
  };
};
