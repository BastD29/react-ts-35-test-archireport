import { FormEvent, useRef, useState } from "react";

import ChatMessage from "../ChatMessage/ChatMessage";

import { firebaseAuth, firebaseFirestore } from "../../config/firebase-config";
import {
  DocumentData,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import styles from "./ChatRoom.module.css";

// export type MessageType = {
//   text: string;
//   uid: string;
//   photoURL: string;
//   createdAt: string;
// };

function ChatRoom() {
  const divForAutoScroll = useRef<HTMLSpanElement>(null);

  // const [messages, setMessages] = useState<MessageType[]>([]);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [formValue, setFormValue] = useState<string>("");

  const messagesRef = collection(firebaseFirestore, "chat-messages");
  // console.log("messagesRef: ", messagesRef);

  const q = query(messagesRef, orderBy("createdAt"), limit(25));
  // console.log("q", q);

  getDocs(q).then((response) => {
    setMessages(response.docs.map((doc) => doc.data()));
  });

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (firebaseAuth.currentUser) {
      const { uid, photoURL } = firebaseAuth.currentUser;

      await addDoc(collection(firebaseFirestore, "chat-messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });

      setFormValue("");

      divForAutoScroll.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("No user logged in");
    }
  };

  return (
    <>
      <main className={styles.main}>
        {messages &&
          messages.map((message) => (
            <ChatMessage
              /* message={message} */
              key={message.createdAt}
              text={message.text}
              uid={message.uid}
              photoURL={message.photoURL}
            />
          ))}

        <span ref={divForAutoScroll}></span>
      </main>

      <form onSubmit={sendMessage} className={styles.form}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Write a message..."
          className={styles.formInput}
        />

        <button
          type="submit"
          disabled={!formValue}
          className={styles.formButton}
          /* className="button-submit" */
        >
          ➡️
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
