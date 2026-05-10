import { useState } from "react";
import LoginScreen from "../../src/screens/LoginScreen";
import MainTabs from "../../src/screens/MainTabs";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <MainTabs onLogout={() => setIsLoggedIn(false)} />;
}