import Link from "next/link";

// Import Styles
import styles from "./styles.module.css";

// Import icons
import { BiTask } from "react-icons/bi";

// Import Next Auth
import { useSession, signIn, signOut } from "next-auth/react";

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <section className={styles.content}>
        <nav className={styles.nav}>
          <Link href="/">
            <h1 className={styles.logo}>
              Minhas Tarefas{" "}
              <span>
                <BiTask />
              </span>
            </h1>
          </Link>
          {session?.user && (
            <Link
              href={`${process.env.NEXT_PUBLIC_URL}/dashboard`}
              className={styles.link}
            >
              Meu Painel
            </Link>
          )}
        </nav>

        {status === "loading" ? (
          <></>
        ) : session ? (
          <button className={styles.loginButton} onClick={() => signOut()}>
            Olá {session?.user?.name}
            {/* <img
              src={session?.user?.image}
              alt={session?.user?.name}
              className={styles.img}
            /> */}
          </button>
        ) : (
          <button
            className={styles.loginButton}
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
};

export default Header;
