import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { api } from "../services/api";
import type { AppUser } from "../types/auth";

type ParkingStaffScreenProps = {
  user: AppUser;
  onLogout: () => void;
};

export default function ParkingStaffScreen({
  user,
  onLogout,
}: ParkingStaffScreenProps) {
  const [studentCode, setStudentCode] = useState("");
  const [plateIn, setPlateIn] = useState("");
  const [plateOut, setPlateOut] = useState("");
  const [result, setResult] = useState("");

  const handleCheckin = async () => {
    if (!studentCode || !plateIn) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập MSSV và biển số xe vào");
      return;
    }

    try {
      const response = await api.post("/parking/checkin", {
        studentCode,
        plateNumber: plateIn,
      });

      setResult(response.data.message);

      if (response.data.success) {
        setStudentCode("");
        setPlateIn("");
      }

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối backend");
    }
  };

  const handleCheckout = async () => {
    if (!plateOut) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập biển số xe ra");
      return;
    }

    try {
      const response = await api.post("/parking/checkout", {
        plateNumber: plateOut,
      });

      setResult(response.data.message);

      if (response.data.success) {
        setPlateOut("");
      }

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể kết nối backend");
    }
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
          <Text style={styles.title}>Cổng bãi xe</Text>
          <Text style={styles.subtitle}>{user.fullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mô phỏng xe vào bãi</Text>

          <Text style={styles.label}>Mã số sinh viên</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: SV001"
            value={studentCode}
            onChangeText={setStudentCode}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Biển số xe vào</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 29A-12345"
            value={plateIn}
            onChangeText={setPlateIn}
            autoCapitalize="characters"
          />

          <Pressable style={styles.primaryButton} onPress={handleCheckin}>
            <Text style={styles.primaryText}>Xác nhận xe vào</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mô phỏng xe ra bãi</Text>

          <Text style={styles.label}>Biển số xe ra</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập biển số xe ra"
            value={plateOut}
            onChangeText={setPlateOut}
            autoCapitalize="characters"
          />

          <Pressable style={styles.primaryButton} onPress={handleCheckout}>
            <Text style={styles.primaryText}>Xác nhận xe ra</Text>
          </Pressable>
        </View>

        {result ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
    paddingBottom: 80,
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 14,
  },
  label: {
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
    marginBottom: 14,
  },
  primaryButton: {
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  resultBox: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  resultText: {
    color: TEXT,
    fontSize: 15,
    fontWeight: "700",
  },
  logoutButton: {
    height: 50,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});