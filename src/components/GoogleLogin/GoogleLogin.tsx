import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { firebaseAuth } from "../../config/firebase-config";

import styles from "./GoogleLogin.module.css";

function GoogleLogin() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(firebaseAuth, provider);
  };

  return (
    <>
      <button
        /* className="sign-in" */
        className={styles.googleLoginButton}
        onClick={signInWithGoogle}
      >
        Login with Google 👀🚀
      </button>
    </>
  );
}

export default GoogleLogin;
