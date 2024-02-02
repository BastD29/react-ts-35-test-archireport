import { User } from "firebase/auth";
import styles from "./Header.module.css";
import Logout from "../Logout/Logout";

export type UserType = {
  user: User | null | undefined;
};

function Header({ user }: UserType) {
  return (
    <header className={styles.header}>
      {/* <div className={styles.logo}>Logo</div> */}
      {/* <img
        className={styles.logo}
        src={user ? user?.photoURL : <div>Logo</div>}
      /> */}
      {user?.photoURL ? (
        <img className={styles.logo} src={user.photoURL} alt="User" />
      ) : (
        <div className={styles.logo}>Logo</div>
      )}
      <div>
        {user && (
          <div className={styles.userInfo}>
            <h2>{`Welcome, ${user?.displayName || user.email}`}</h2>
            <Logout />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
