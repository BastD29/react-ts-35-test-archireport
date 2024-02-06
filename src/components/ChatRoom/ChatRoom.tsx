import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";

import { debounce } from "lodash";

import ChatMessage from "../ChatMessage/ChatMessage";

import { firebaseAuth, firestoreDb } from "../../config/firebase-config";
import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import styles from "./ChatRoom.module.css";

function ChatRoom() {
  const divForAutoScroll = useRef<HTMLSpanElement>(null);

  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [formValue, setFormValue] = useState<string>("");

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const chatRoomId = "yourChatRoomId";

  useEffect(() => {
    const messagesRef = collection(firestoreDb, "chat-messages");
    const q = query(messagesRef, orderBy("createdAt"), limit(25));

    const unsubscribeMessages = onSnapshot(q, (querySnapshot) => {
      const fetchedMessages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(fetchedMessages);
      divForAutoScroll.current?.scrollIntoView({ behavior: "smooth" });
    });

    // Listen for typing status changes
    const typingRef = doc(firestoreDb, "typing", chatRoomId);

    const unsubscribeTyping = onSnapshot(typingRef, (doc) => {
      const data = doc.data() || {};

      const currentUserId = firebaseAuth.currentUser?.uid;
      const usersTyping = Object.keys(data).filter(
        (userId) => data[userId] === true && userId !== currentUserId
      );
      setTypingUsers(usersTyping);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
    };
  }, [chatRoomId]);

  const updateTypingStatus = (isTyping: boolean) => {
    if (firebaseAuth.currentUser) {
      const typingRef = doc(firestoreDb, "typing", chatRoomId);
      setDoc(
        typingRef,
        { [firebaseAuth.currentUser.uid]: isTyping },
        { merge: true }
      );
    } else {
      console.log("No user logged in.");
    }
  };

  const debouncedUpdateTypingStatus = debounce((isTyping) => {
    updateTypingStatus(isTyping);
  }, 500);

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (firebaseAuth.currentUser) {
      const { uid, photoURL } = firebaseAuth.currentUser;

      await addDoc(collection(firestoreDb, "chat-messages"), {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      });

      setFormValue("");
      debouncedUpdateTypingStatus(false);
      divForAutoScroll.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("No user logged in");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue(e.target.value);
    updateTypingStatus(true);
    debouncedUpdateTypingStatus(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(firestoreDb, "chat-messages", id));
  };

  const handleUpdate = async (id: string, newText: string) => {
    const messageRef = doc(firestoreDb, "chat-messages", id);
    await updateDoc(messageRef, {
      text: newText,
    });
  };

  return (
    <>
      <main className={styles.main}>
        {messages.map((message) => (
          <ChatMessage
            key={`${message.createdAt}-${message.uid}`}
            id={message.id}
            text={message.text}
            uid={message.uid}
            photoURL={message.photoURL}
            createdAt={message.createdAt}
            displayName={message.displayName}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
          />
        ))}
        <div>
          {typingUsers.length > 0 && (
            <div className={styles.typingIndicator}>
              {typingUsers.join(", ")} is typing...
            </div>
          )}
        </div>
        <span ref={divForAutoScroll}></span>
      </main>

      <form onSubmit={sendMessage} className={styles.form}>
        <input
          value={formValue}
          onChange={handleChange}
          placeholder="Write a message..."
          className={styles.formInput}
        />
        <button
          type="submit"
          disabled={!formValue}
          className={styles.formButton}
        >
          ➡️
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
