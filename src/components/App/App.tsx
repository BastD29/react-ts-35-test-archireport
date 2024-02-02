import ChatRoom from "../ChatRoom/ChatRoom";
import GoogleLogin from "../GoogleLogin/GoogleLogin";
import Header from "../Header/Header";
// import Login from "./components/Login/Login";

import { firebaseAuth } from "../../config/firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

import styles from "./App.module.css";

function App() {
  const [user] = useAuthState(firebaseAuth);

  console.log("user:", user);

  return (
    <div className="App">
      <Header user={user} />
      {/* <section>{user ? <ChatRoom /> : <Login />}</section> */}
      <section className={styles.section}>
        {user ? <ChatRoom /> : <GoogleLogin />}
      </section>
    </div>
  );
}

export default App;
