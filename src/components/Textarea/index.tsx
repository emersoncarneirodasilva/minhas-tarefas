import styles from "./styles.module.css";
import { HTMLProps } from "react";

const Textarea = ({ ...rest }: HTMLProps<HTMLTextAreaElement>) => {
  return <textarea className={styles.textarea} {...rest}></textarea>;
};

export default Textarea;
