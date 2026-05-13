import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { api } from "../services/api";
import type { AppUser } from "../types/auth";

import HistoryScreen from "./HistoryScreen";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import TopupScreen from "./TopupScreen";
import TransactionHistoryScreen from "./TransactionHistoryScreen";
import WalletScreen from "./WalletScreen";

type MainTabsProps = {
  user: AppUser;
  onLogout: () => void;
};

type TabKey = "home" | "wallet" | "parkingHistory" | "transactions" | "profile";
type ScreenKey = TabKey | "topup";

export type Transaction = {
  id: number;
  type: "topup" | "parking_fee";
  title: string;
  amount: number;
  createdAt: string;
};

export type ParkingSession = {
  id: number;
  plateNumber: string;
  checkinTime: string;
  checkoutTime: string;
  fee: number;
  status: "parking" | "completed";
};

type CurrentParking = {
  plateNumber: string;
  checkinTime: string;
};

export default function MainTabs({ user, onLogout }: MainTabsProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("home");

  const studentCode = user.studentCode || user.username;

  const [balance, setBalance] = useState(0);
  const [availableSlots, setAvailableSlots] = useState(0);
  const [currentParking, setCurrentParking] = useState<CurrentParking | null>(
    null
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [parkingSessions, setParkingSessions] = useState<ParkingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadStudentData = async () => {
    try {
      const summaryResponse = await api.get(`/student/${studentCode}/summary`);
      const transactionsResponse = await api.get(
        `/student/${studentCode}/transactions`
      );
      const sessionsResponse = await api.get(
        `/student/${studentCode}/parking-sessions`
      );

      if (summaryResponse.data.success) {
        setBalance(summaryResponse.data.student.balance);
        setAvailableSlots(summaryResponse.data.availableSlots);

        if (summaryResponse.data.currentParking) {
          setCurrentParking({
            plateNumber: summaryResponse.data.currentParking.plateNumber,
            checkinTime: summaryResponse.data.currentParking.checkinTime,
          });
        } else {
          setCurrentParking(null);
        }
      }

      setTransactions(
        transactionsResponse.data.map((item: any) => ({
          id: item.id,
          type: item.type,
          title: item.type === "topup" ? "Nạp tiền" : "Phí gửi xe",
          amount: item.amount,
          createdAt: item.createdAt,
        }))
      );

      setParkingSessions(
        sessionsResponse.data.map((item: any) => ({
          id: item.id,
          plateNumber: item.plateNumber,
          checkinTime: item.checkinTime,
          checkoutTime: item.checkoutTime || "Chưa ra",
          fee: item.fee || 0,
          status: item.status,
        }))
      );
    } catch (error: any) {
      console.log("LOAD STUDENT DATA ERROR:", error?.message);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sinh viên từ backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStudentData();
  }, []);

  const goToScreen = (screen: ScreenKey) => {
    setActiveScreen(screen);

    if (
      screen === "home" ||
      screen === "wallet" ||
      screen === "parkingHistory" ||
      screen === "transactions"
    ) {
      loadStudentData();
    }
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    if (activeScreen === "home") {
      return (
        <HomeScreen
          user={user}
          balance={balance}
          availableSlots={availableSlots}
          currentParking={currentParking}
        />
      );
    }

    if (activeScreen === "wallet") {
      return (
        <WalletScreen
          balance={balance}
          transactions={transactions}
          onTopup={() => setActiveScreen("topup")}
          onSeeAllTransactions={() => goToScreen("transactions")}
        />
      );
    }

    if (activeScreen === "topup") {
      return (
        <TopupScreen
          balance={balance}
          studentCode={studentCode}
          onBack={() => goToScreen("wallet")}
          onTopupRequestCreated={() => {
            Alert.alert(
              "Đã tạo yêu cầu",
              "Vui lòng chờ người quản lý xác nhận giao dịch"
            );
            goToScreen("wallet");
          }}
        />
      );
    }

    if (activeScreen === "parkingHistory") {
      return <HistoryScreen sessions={parkingSessions} />;
    }

    if (activeScreen === "transactions") {
      return <TransactionHistoryScreen transactions={transactions} />;
    }

    return (
      <ProfileScreen
        user={user}
        onLogout={onLogout}
        onResetData={() => {
          loadStudentData();
          Alert.alert("Đã tải lại", "Dữ liệu đã được đồng bộ từ backend");
        }}
      />
    );
  };

  const activeTab: TabKey =
    activeScreen === "topup" ? "wallet" : activeScreen;

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <View style={styles.tabBar}>
        <TabButton
          title="Trang chủ"
          active={activeTab === "home"}
          onPress={() => goToScreen("home")}
        />

        <TabButton
          title="Ví"
          active={activeTab === "wallet"}
          onPress={() => goToScreen("wallet")}
        />

        <TabButton
          title="Gửi xe"
          active={activeTab === "parkingHistory"}
          onPress={() => goToScreen("parkingHistory")}
        />

        <TabButton
          title="Giao dịch"
          active={activeTab === "transactions"}
          onPress={() => goToScreen("transactions")}
        />

        <TabButton
          title="Tài khoản"
          active={activeTab === "profile"}
          onPress={() => setActiveScreen("profile")}
        />
      </View>
    </View>
  );
}

type TabButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

function TabButton({ title, active, onPress }: TabButtonProps) {
  return (
    <Pressable
      style={[styles.tabButton, active && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, active && styles.tabTextActive]}>
        {title}
      </Text>
    </Pressable>
  );
}

const PRIMARY = "#C8102E";
const BG = "#FFF5F6";
const BORDER = "#F0D6DB";
const TEXT = "#222222";
const SUBTEXT = "#666666";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  tabBar: {
    height: 82,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingTop: 8,
    paddingBottom: 14,
  },
  tabButton: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabButtonActive: {
    backgroundColor: "#FFF0F2",
  },
  tabText: {
    fontSize: 12,
    color: SUBTEXT,
    fontWeight: "600",
    textAlign: "center",
  },
  tabTextActive: {
    color: PRIMARY,
    fontWeight: "900",
  },
});