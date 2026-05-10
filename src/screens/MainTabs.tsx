import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import HistoryScreen from "./HistoryScreen";
import HomeScreen from "./HomeScreen";
import ProfileScreen from "./ProfileScreen";
import TopupScreen from "./TopupScreen";
import TransactionHistoryScreen from "./TransactionHistoryScreen";
import WalletScreen from "./WalletScreen";

type MainTabsProps = {
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
  status: "completed";
};

type CurrentParking = {
  plateNumber: string;
  checkinTime: string;
};

type AppData = {
  balance: number;
  availableSlots: number;
  currentParking: CurrentParking | null;
  transactions: Transaction[];
  parkingSessions: ParkingSession[];
};

const STORAGE_KEY = "SMART_PARKING_APP_DATA";

const DEFAULT_DATA: AppData = {
  balance: 50000,
  availableSlots: 25,
  currentParking: {
    plateNumber: "30B-67890",
    checkinTime: "06/05/2026 08:10",
  },
  transactions: [
    {
      id: 1,
      type: "topup",
      title: "Nạp tiền",
      amount: 50000,
      createdAt: "06/05/2026 08:00",
    },
    {
      id: 2,
      type: "parking_fee",
      title: "Phí gửi xe",
      amount: -3000,
      createdAt: "06/05/2026 11:15",
    },
  ],
  parkingSessions: [
    {
      id: 1,
      plateNumber: "29A-12345",
      checkinTime: "06/05/2026 07:30",
      checkoutTime: "06/05/2026 11:15",
      fee: 3000,
      status: "completed",
    },
  ],
};

export default function MainTabs({ onLogout }: MainTabsProps) {
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("home");

  const [balance, setBalance] = useState(DEFAULT_DATA.balance);
  const [availableSlots, setAvailableSlots] = useState(
    DEFAULT_DATA.availableSlots
  );
  const [currentParking, setCurrentParking] =
    useState<CurrentParking | null>(DEFAULT_DATA.currentParking);
  const [transactions, setTransactions] = useState<Transaction[]>(
    DEFAULT_DATA.transactions
  );
  const [parkingSessions, setParkingSessions] = useState<ParkingSession[]>(
    DEFAULT_DATA.parkingSessions
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveData({
      balance,
      availableSlots,
      currentParking,
      transactions,
      parkingSessions,
    });
  }, [
    balance,
    availableSlots,
    currentParking,
    transactions,
    parkingSessions,
    isLoaded,
  ]);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedData) {
        const parsedData: AppData = JSON.parse(savedData);

        setBalance(parsedData.balance);
        setAvailableSlots(parsedData.availableSlots);
        setCurrentParking(parsedData.currentParking);
        setTransactions(parsedData.transactions);
        setParkingSessions(parsedData.parkingSessions);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu đã lưu");
    } finally {
      setIsLoaded(true);
    }
  };

  const saveData = async (data: AppData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu dữ liệu cục bộ");
    }
  };

  const resetData = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);

      setBalance(DEFAULT_DATA.balance);
      setAvailableSlots(DEFAULT_DATA.availableSlots);
      setCurrentParking(DEFAULT_DATA.currentParking);
      setTransactions(DEFAULT_DATA.transactions);
      setParkingSessions(DEFAULT_DATA.parkingSessions);

      Alert.alert("Thành công", "Đã reset dữ liệu demo");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể reset dữ liệu");
    }
  };

  const handleTopupSuccess = (amount: number) => {
    setBalance((currentBalance) => currentBalance + amount);

    const newTransaction: Transaction = {
      id: Date.now(),
      type: "topup",
      title: "Nạp tiền",
      amount,
      createdAt: getCurrentTime(),
    };

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);

    setActiveScreen("wallet");
  };

  const handleCheckin = (plateNumber: string) => {
    const formattedPlate = plateNumber.trim().toUpperCase();

    if (currentParking) {
      Alert.alert("Thông báo", "Sinh viên đang có xe trong bãi");
      return;
    }

    if (!formattedPlate) {
      Alert.alert("Thiếu biển số", "Vui lòng nhập biển số xe");
      return;
    }

    if (availableSlots <= 0) {
      Alert.alert("Bãi đã đầy", "Hiện không còn chỗ trống");
      return;
    }

    const newCurrentParking: CurrentParking = {
      plateNumber: formattedPlate,
      checkinTime: getCurrentTime(),
    };

    setCurrentParking(newCurrentParking);
    setAvailableSlots((currentSlots) => currentSlots - 1);

    Alert.alert(
      "Vào bãi thành công",
      `Đã ghi nhận biển số ${newCurrentParking.plateNumber}`
    );
  };

  const handleCheckout = (plateNumberOut: string) => {
    const parkingFee = 3000;
    const formattedPlateOut = plateNumberOut.trim().toUpperCase();

    if (!currentParking) {
      Alert.alert("Thông báo", "Hiện tại sinh viên chưa có xe trong bãi");
      return;
    }

    if (!formattedPlateOut) {
      Alert.alert("Thiếu biển số", "Vui lòng nhập biển số xe lúc ra");
      return;
    }

    if (formattedPlateOut !== currentParking.plateNumber) {
      Alert.alert(
        "Biển số không khớp",
        `Biển số lúc vào: ${currentParking.plateNumber}\nBiển số lúc ra: ${formattedPlateOut}`
      );
      return;
    }

    if (balance < parkingFee) {
      Alert.alert("Không đủ số dư", "Vui lòng nạp tiền trước khi ra bãi");
      return;
    }

    const now = getCurrentTime();

    const newTransaction: Transaction = {
      id: Date.now(),
      type: "parking_fee",
      title: "Phí gửi xe",
      amount: -parkingFee,
      createdAt: now,
    };

    const newParkingSession: ParkingSession = {
      id: Date.now() + 1,
      plateNumber: currentParking.plateNumber,
      checkinTime: currentParking.checkinTime,
      checkoutTime: now,
      fee: parkingFee,
      status: "completed",
    };

    setBalance((currentBalance) => currentBalance - parkingFee);

    setTransactions((currentTransactions) => [
      newTransaction,
      ...currentTransactions,
    ]);

    setParkingSessions((currentSessions) => [
      newParkingSession,
      ...currentSessions,
    ]);

    setAvailableSlots((currentSlots) => currentSlots + 1);
    setCurrentParking(null);

    Alert.alert(
      "Ra bãi thành công",
      `Biển số khớp: ${formattedPlateOut}\nĐã trừ ${formatMoney(
        parkingFee
      )} phí gửi xe`
    );
  };

  const renderScreen = () => {
    if (!isLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

    if (activeScreen === "home") {
      return (
        <HomeScreen
          balance={balance}
          availableSlots={availableSlots}
          currentParking={currentParking}
          onCheckin={handleCheckin}
          onCheckout={handleCheckout}
        />
      );
    }

    if (activeScreen === "wallet") {
      return (
        <WalletScreen
          balance={balance}
          transactions={transactions}
          onTopup={() => setActiveScreen("topup")}
          onSeeAllTransactions={() => setActiveScreen("transactions")}
        />
      );
    }

    if (activeScreen === "topup") {
      return (
        <TopupScreen
          balance={balance}
          onBack={() => setActiveScreen("wallet")}
          onTopupSuccess={handleTopupSuccess}
        />
      );
    }

    if (activeScreen === "parkingHistory") {
      return <HistoryScreen sessions={parkingSessions} />;
    }

    if (activeScreen === "transactions") {
      return <TransactionHistoryScreen transactions={transactions} />;
    }

    return <ProfileScreen onLogout={onLogout} onResetData={resetData} />;
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
          onPress={() => setActiveScreen("home")}
        />

        <TabButton
          title="Ví"
          active={activeTab === "wallet"}
          onPress={() => setActiveScreen("wallet")}
        />

        <TabButton
          title="Gửi xe"
          active={activeTab === "parkingHistory"}
          onPress={() => setActiveScreen("parkingHistory")}
        />

        <TabButton
          title="Giao dịch"
          active={activeTab === "transactions"}
          onPress={() => setActiveScreen("transactions")}
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

function getCurrentTime() {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hour}:${minute}`;
}

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
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