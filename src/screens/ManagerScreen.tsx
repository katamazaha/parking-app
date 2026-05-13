import { useEffect, useState } from "react";
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

type ManagerScreenProps = {
  user: AppUser;
  onLogout: () => void;
};

type TopupRequest = {
  id: number;
  studentCode: string;
  amount: number;
  status: "pending" | "success" | "rejected";
  createdAt: string;
  confirmedAt: string | null;
};

const DEFAULT_PASSWORD = "123456";

export default function ManagerScreen({ user, onLogout }: ManagerScreenProps) {
  const [requests, setRequests] = useState<TopupRequest[]>([]);
  const [studentCode, setStudentCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(DEFAULT_PASSWORD);
  const [initialBalance, setInitialBalance] = useState("0");
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  const loadRequests = async () => {
    try {
      const response = await api.get("/topup-requests");
      setRequests(response.data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách yêu cầu nạp tiền");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleCreateStudent = async () => {
    const formattedStudentCode = studentCode.trim().toUpperCase();
    const formattedFullName = fullName.trim();
    const formattedEmail = email.trim().toLowerCase();
    const formattedPassword = password.trim();
    const balance = Number(initialBalance.replace(/[^0-9]/g, "") || 0);

    if (!formattedStudentCode || !formattedFullName || !formattedEmail || !formattedPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin sinh viên");
      return;
    }

    if (!formattedEmail.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    if (formattedPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu ban đầu phải có ít nhất 6 ký tự");
      return;
    }

    if (balance < 0) {
      Alert.alert("Lỗi", "Số dư khởi tạo không hợp lệ");
      return;
    }

    try {
      setIsCreatingStudent(true);

      const response = await api.post("/manager/students", {
        managerUsername: user.username,
        studentCode: formattedStudentCode,
        fullName: formattedFullName,
        email: formattedEmail,
        password: formattedPassword,
        initialBalance: balance,
      });

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );

      if (response.data.success) {
        setStudentCode("");
        setFullName("");
        setEmail("");
        setPassword(DEFAULT_PASSWORD);
        setInitialBalance("0");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi kết nối",
        error?.message || "Không thể cấp tài khoản sinh viên"
      );
    } finally {
      setIsCreatingStudent(false);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      const response = await api.patch(`/topup-requests/${id}/confirm`, {
        managerUsername: user.username,
      });

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );

      loadRequests();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xác nhận giao dịch");
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
          <Text style={styles.title}>Quản lý hệ thống</Text>
          <Text style={styles.subtitle}>{user.fullName}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cấp tài khoản sinh viên</Text>
          <Text style={styles.helpText}>
            Tài khoản đăng nhập sẽ dùng MSSV. Sinh viên có thể đổi mật khẩu ở
            tab Tài khoản sau khi đăng nhập.
          </Text>

          <Text style={styles.label}>Mã sinh viên</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: SV003"
            value={studentCode}
            onChangeText={setStudentCode}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Họ tên</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ tên sinh viên"
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="sv003@hust.edu.vn"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Mật khẩu ban đầu</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Số dư khởi tạo</Text>
          <TextInput
            style={styles.input}
            placeholder="0"
            value={initialBalance}
            onChangeText={setInitialBalance}
            keyboardType="number-pad"
          />

          <Pressable
            style={[styles.createButton, isCreatingStudent && styles.disabledButton]}
            onPress={handleCreateStudent}
            disabled={isCreatingStudent}
          >
            <Text style={styles.createText}>
              {isCreatingStudent ? "Đang cấp tài khoản..." : "Cấp tài khoản sinh viên"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Yêu cầu nạp tiền</Text>
          <Pressable style={styles.reloadButton} onPress={loadRequests}>
            <Text style={styles.reloadText}>Tải lại</Text>
          </Pressable>
        </View>

        {requests.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyText}>Chưa có yêu cầu nạp tiền</Text>
          </View>
        ) : (
          requests.map((request) => (
            <View key={request.id} style={styles.card}>
              <Text style={styles.cardTitle}>Yêu cầu #{request.id}</Text>
              <Text style={styles.info}>MSSV: {request.studentCode}</Text>
              <Text style={styles.info}>Số tiền: {formatMoney(request.amount)}</Text>
              <Text style={styles.info}>Ngày tạo: {formatDateTime(request.createdAt)}</Text>
              <Text style={styles.info}>Trạng thái: {request.status}</Text>

              {request.status === "pending" && (
                <Pressable
                  style={styles.confirmButton}
                  onPress={() => handleConfirm(request.id)}
                >
                  <Text style={styles.confirmText}>Xác nhận nạp tiền</Text>
                </Pressable>
              )}
            </View>
          ))
        )}

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </Pressable>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "900",
    color: TEXT,
  },
  reloadButton: {
    height: 42,
    paddingHorizontal: 18,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reloadText: {
    color: "white",
    fontSize: 14,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: SUBTEXT,
    lineHeight: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: TEXT,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#FFFDFD",
    color: TEXT,
  },
  createButton: {
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  createText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
  info: {
    fontSize: 15,
    color: SUBTEXT,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
  },
  confirmButton: {
    height: 46,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  confirmText: {
    color: "white",
    fontSize: 15,
    fontWeight: "800",
  },
  logoutButton: {
    height: 50,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});