import { useState } from "react";

import LoginScreen from "../../src/screens/LoginScreen";
import MainTabs from "../../src/screens/MainTabs";
import ManagerScreen from "../../src/screens/ManagerScreen";
import ParkingStaffScreen from "../../src/screens/ParkingStaffScreen";
import type { AppUser } from "../../src/types/auth";

export default function Index() {
  const [user, setUser] = useState<AppUser | null>(null);

  if (!user) {
    return <LoginScreen onLoginSuccess={setUser} />;
  }

  if (user.role === "PARKING_STAFF") {
    return <ParkingStaffScreen user={user} onLogout={() => setUser(null)} />;
  }

  if (user.role === "MANAGER") {
    return <ManagerScreen user={user} onLogout={() => setUser(null)} />;
  }

  return <MainTabs user={user} onLogout={() => setUser(null)} />;
}