import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type CurrentParking = {
  plateNumber: string;
  checkinTime: string;
};

type HomeScreenProps = {
  balance: number;
  availableSlots: number;
  currentParking: CurrentParking | null;
  onCheckin: (plateNumber: string) => void;
  onCheckout: (plateNumberOut: string) => void;
};

export default function HomeScreen({
  balance,
  availableSlots,
  currentParking,
  onCheckin,
  onCheckout,
}: HomeScreenProps) {
  const [plateNumberIn, setPlateNumberIn] = useState("");
  const [plateNumberOut, setPlateNumberOut] = useState("");

  const isParking = currentParking !== null;

  const handleCheckinPress = () => {
    onCheckin(plateNumberIn);
    setPlateNumberIn("");
  };

  const handleCheckoutPress = () => {
    onCheckout(plateNumberOut);
    setPlateNumberOut("");
  };

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
          <Text style={styles.subtitle}>Xin chào, Nguyễn Văn A</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mã sinh viên</Text>
          <Text style={styles.value}>SV001</Text>
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
                Biển số lúc vào: {currentParking.plateNumber}
              </Text>
              <Text style={styles.infoText}>
                Giờ vào: {currentParking.checkinTime}
              </Text>
            </View>
          )}

          {!isParking && (
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Biển số xe lúc vào</Text>
              <TextInput
                style={styles.input}
                placeholder="Ví dụ: 29A-12345"
                value={plateNumberIn}
                onChangeText={setPlateNumberIn}
                autoCapitalize="characters"
                returnKeyType="done"
              />
            </View>
          )}

          {isParking && (
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Biển số xe lúc ra</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập lại biển số khi ra"
                value={plateNumberOut}
                onChangeText={setPlateNumberOut}
                autoCapitalize="characters"
                returnKeyType="done"
              />

              <Text style={styles.hintText}>
                Hệ thống sẽ đối chiếu với biển số đã lưu lúc vào bãi
              </Text>
            </View>
          )}
        </View>

        {isParking ? (
          <Pressable style={styles.checkoutButton} onPress={handleCheckoutPress}>
            <Text style={styles.buttonText}>Mô phỏng xe ra bãi</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.checkinButton} onPress={handleCheckinPress}>
            <Text style={styles.buttonText}>Mô phỏng xe vào bãi</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
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
  inputBox: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3E3E6",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 8,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFDFD",
  },
  hintText: {
    marginTop: 8,
    fontSize: 12,
    color: SUBTEXT,
  },
  checkoutButton: {
    height: 52,
    backgroundColor: PRIMARY,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  checkinButton: {
    height: 52,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});