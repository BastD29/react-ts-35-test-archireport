import { useState } from "react";
import { firebaseAuth } from "../../config/firebase-config";

import firebase from "firebase/compat/app";
import { format } from "date-fns";
import styles from "./ChatMessage.module.css";

export type ChatMessageProps = {
  id: string;
  text: string;
  uid: string;
  photoURL: string;
  createdAt: firebase.firestore.Timestamp;
  displayName: string;
  handleDelete: (id: string) => void;
  handleUpdate: (id: string, newText: string) => void;
};

type DateInput = { toDate: () => Date } | Date;

function ChatMessage({
  id,
  text,
  uid,
  photoURL,
  createdAt,
  displayName,
  handleDelete,
  handleUpdate,
}: ChatMessageProps) {
  const messageClass =
    uid === firebaseAuth.currentUser?.uid ? styles.sent : styles.received;

  const [newText, setNewText] = useState<string>(text);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const startEditing = () => setIsEditing(true);
  const cancelEditing = () => setIsEditing(false);

  const updateMessage = () => {
    handleUpdate(id, newText);
    setIsEditing(false);
  };

  const formatDate = (dateInput: DateInput | undefined) => {
    try {
      // Check if dateInput is a Firestore Timestamp
      if (dateInput && "toDate" in dateInput) {
        const date = dateInput.toDate(); // Convert to JS Date
        return format(date, "PPP, p"); // Format date
      } else if (dateInput instanceof Date) {
        // If already a JS Date
        return format(dateInput, "PPP, p");
      }
      // If input is undefined or invalid, return a fallback string
      return "Time unknown";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Time unknown";
    }
  };

  const formattedDate = formatDate(createdAt);

  return (
    <div className={`${styles.message} ${messageClass}`}>
      <img src={photoURL} className={styles.chatMessageImg} />
      {isEditing ? (
        <input value={newText} onChange={(e) => setNewText(e.target.value)} />
      ) : (
        <>
          <p>{text}</p>
          <strong>{displayName && displayName}</strong>
          <span>{formattedDate}</span>
        </>
      )}
      {uid === firebaseAuth.currentUser?.uid && (
        <div>
          {isEditing ? (
            <>
              <button onClick={updateMessage}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={startEditing}>Edit</button>
              <button onClick={() => handleDelete(id)}>Delete</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatMessage;
