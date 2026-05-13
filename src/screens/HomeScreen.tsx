import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { AppUser } from "../types/auth";

type CurrentParking = {
  plateNumber: string;
  checkinTime: string;
};

type HomeScreenProps = {
  user: AppUser;
  balance: number;
  availableSlots: number;
  currentParking: CurrentParking | null;
};

export default function HomeScreen({
  user,
  balance,
  availableSlots,
  currentParking,
}: HomeScreenProps) {
  const isParking = currentParking !== null;
  const studentCode = user.studentCode || user.username;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.school}>Đại học Bách khoa Hà Nội</Text>
          <Text style={styles.title}>Smart Parking</Text>
          <Text style={styles.subtitle}>Xin chào, {user.fullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mã sinh viên</Text>
          <Text style={styles.value}>{studentCode}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Số dư ví</Text>
          <Text style={styles.money}>{formatMoney(balance)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Số chỗ trống</Text>
          <Text style={styles.value}>{availableSlots} chỗ</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Trạng thái gửi xe</Text>

          <Text style={isParking ? styles.parking : styles.notParking}>
            {isParking ? "Đang gửi xe" : "Chưa gửi xe"}
          </Text>

          {currentParking && (
            <View style={styles.parkingInfo}>
              <Text style={styles.infoText}>
                Biển số xe: {currentParking.plateNumber}
              </Text>
              <Text style={styles.infoText}>
                Giờ vào: {formatDateTime(currentParking.checkinTime)}
              </Text>
            </View>
          )}

          <Text style={styles.noteText}>
            Việc xác nhận xe vào/ra bãi được thực hiện bởi nhân viên bãi đỗ xe.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
}

const PRIMARY = "#C8102E";
const PRIMARY_DARK = "#A60F25";
const BG = "#FFF5F6";
const BORDER = "#F0D6DB";
const TEXT = "#222222";
const SUBTEXT = "#666666";

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: BG,
  },
  scrollView: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flexGrow: 1,
    backgroundColor: BG,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  headerCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  school: {
    color: "#FFE9EC",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#FFF3F5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  label: {
    fontSize: 14,
    color: SUBTEXT,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT,
  },
  money: {
    fontSize: 26,
    fontWeight: "900",
    color: PRIMARY_DARK,
  },
  parking: {
    fontSize: 22,
    fontWeight: "800",
    color: PRIMARY,
  },
  notParking: {
    fontSize: 22,
    fontWeight: "800",
    color: SUBTEXT,
  },
  parkingInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3E3E6",
  },
  infoText: {
    fontSize: 14,
    color: TEXT,
    marginBottom: 4,
  },
  noteText: {
    marginTop: 12,
    fontSize: 14,
    color: SUBTEXT,
    lineHeight: 20,
  },
});