import { firebaseAuth } from "../../config/firebase-config";

import styles from "./ChatMessage.module.css";

export type ChatMessageProps = {
  text: string;
  //   uid: number;
  uid: string;
  photoURL: string;
};

function ChatMessage({ text, uid, photoURL }: ChatMessageProps) {
  const messageClass =
    // uid === firebaseAuth.currentUser?.uid ? "sent" : "received";
    uid === firebaseAuth.currentUser?.uid ? styles.sent : styles.received;

  return (
    // <div className={`message ${messageClass}`}>
    <div className={`${styles.message} ${messageClass}`}>
      <img src={photoURL} className={styles.chatMessageImg} />
      <p>{text}</p>
    </div>
  );
}

export default ChatMessage;
