import { firebaseAuth } from "../../config/firebase-config";

import styles from "./Logout.module.css";

function Logout() {
  return (
    firebaseAuth.currentUser && (
      <button
        /* className="sign-out" */
        className={styles.logoutButton}
        onClick={() => firebaseAuth.signOut()}
      >
        👋🏽
      </button>
    )
  );
}

export default Logout;
