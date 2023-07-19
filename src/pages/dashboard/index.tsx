import styles from "./styles.module.css";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

// Import Data Base
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Import Get Server Side Props
import { GetServerSideProps } from "next";

// Import Next Auth
import { getSession } from "next-auth/react";

// Import Components
import Textarea from "../../components/Textarea";

// Import Icons
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";

interface DashboardProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const tastksRef = collection(db, "tarefas");
      const q = query(
        tastksRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let list = [] as TaskProps[];

        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(list);
      });
    };

    loadTasks();
  }, [user?.email]);

  // Check if the Task is Public
  const handleChangePublic = (e: ChangeEvent<HTMLInputElement>) => {
    setPublicTask(e.target.checked);
  };

  // Register Tasks
  const handleRegisterTaks = async (e: FormEvent) => {
    e.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (error) {
      console.log(error);
    }
  };

  // Copie URL Task
  const handleShare = async (id: string) => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/task/${id}`
    );

    alert("URL copiada com sucesso!");
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    const docRef = doc(db, "tarefas", id);

    await deleteDoc(docRef);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Meu Painel de tarefas</title>
      </Head>

      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles.contentForm}>
            <h1 className={styles.title}>Qual sua tarefa?</h1>
            <form onSubmit={handleRegisterTaks}>
              <Textarea
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className={styles.checkboxArea}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={publicTask}
                  onChange={handleChangePublic}
                />
                <label>Deixar tarefa pública?</label>
              </div>
              <button type="submit" className={styles.button}>
                Registrar
              </button>
            </form>
          </div>
        </section>

        <section className={styles.taskContainer}>
          <h1>Minhas Tarefas</h1>

          {tasks.map((task) => (
            <article key={task.id} className={styles.task}>
              {task.public && (
                <div className={styles.tagContainer}>
                  <label className={styles.tag}>PÚBLICO</label>
                  <button
                    className={styles.shareButton}
                    onClick={() => handleShare(task.id)}
                  >
                    <FiShare2 size={22} color="#3183ff" />
                  </button>
                </div>
              )}

              <div className={styles.taskContent}>
                {task.public ? (
                  <Link href={`/task/${task.id}`}>
                    <p className={styles.pTask}>{task.tarefa}</p>
                  </Link>
                ) : (
                  <p>{task.tarefa}</p>
                )}
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <FaTrash size={24} color="#fa2525" />
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

// Export Get Server Side Props
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
