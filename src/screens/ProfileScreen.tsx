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
import type { AppStudent, AppUser } from "../types/auth";

type ProfileScreenProps = {
  user: AppUser;
  onLogout: () => void;
  onResetData: () => void;
};

export default function ProfileScreen({
  user,
  onLogout,
  onResetData,
}: ProfileScreenProps) {
  const [student, setStudent] = useState<AppStudent | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const studentCode = user.studentCode || user.username;

  const loadProfile = async () => {
    try {
      const response = await api.get(`/students/${studentCode}`);

      if (response.data.success) {
        setStudent(response.data.student);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin sinh viên");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleResetPress = () => {
    Alert.alert("Đồng bộ dữ liệu", "Bạn có muốn tải lại dữ liệu từ backend không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng bộ",
        onPress: () => {
          loadProfile();
          onResetData();
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin đổi mật khẩu");
      return;
    }

    if (newPassword.trim().length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (oldPassword.trim() === newPassword.trim()) {
      Alert.alert("Lỗi", "Mật khẩu mới không được trùng mật khẩu cũ");
      return;
    }

    try {
      setIsChangingPassword(true);

      const response = await api.patch("/auth/change-password", {
        username: user.username,
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
      });

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );

      if (response.data.success) {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi kết nối",
        error?.message || "Không thể đổi mật khẩu"
      );
    } finally {
      setIsChangingPassword(false);
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
        <Text style={styles.title}>Tài khoản</Text>
        <Text style={styles.subtitle}>Thông tin sinh viên và bảo mật</Text>

        {user.mustChangePassword && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>Cần đổi mật khẩu</Text>
            <Text style={styles.warningText}>
              Tài khoản này được cấp bởi quản lý. Vui lòng đổi mật khẩu mặc định
              để bảo vệ tài khoản.
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>

          <Text style={styles.label}>Họ tên</Text>
          <Text style={styles.value}>{student?.fullName || user.fullName}</Text>

          <Text style={styles.label}>Mã sinh viên</Text>
          <Text style={styles.value}>{studentCode}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{student?.email || "Chưa có dữ liệu"}</Text>

          <Text style={styles.label}>Số dư ví</Text>
          <Text style={styles.value}>
            {student ? formatMoney(student.balance) : "Đang tải..."}
          </Text>

          <Text style={styles.label}>Trạng thái</Text>
          <Text style={student?.status === "locked" ? styles.locked : styles.active}>
            {student?.status === "locked" ? "Đã khóa" : "Đang hoạt động"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đổi mật khẩu</Text>

          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu hiện tại"
            value={oldPassword}
            onChangeText={setOldPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Tối thiểu 6 ký tự"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <Text style={styles.label}>Nhập lại mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <Pressable
            style={[styles.changePasswordButton, isChangingPassword && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={isChangingPassword}
          >
            <Text style={styles.changePasswordText}>
              {isChangingPassword ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.resetButton} onPress={handleResetPress}>
          <Text style={styles.resetText}>Đồng bộ dữ liệu từ backend</Text>
        </Pressable>

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
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: TEXT,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 24,
    color: SUBTEXT,
    fontSize: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 20,
  },
  warningCard: {
    backgroundColor: "#FFF8E6",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F2D58D",
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 14,
    color: SUBTEXT,
    lineHeight: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: TEXT,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: SUBTEXT,
    marginTop: 12,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
  active: {
    fontSize: 18,
    fontWeight: "800",
    color: PRIMARY,
  },
  locked: {
    fontSize: 18,
    fontWeight: "800",
    color: SUBTEXT,
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
  changePasswordButton: {
    height: 50,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  changePasswordText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
  resetButton: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  resetText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: "800",
  },
  logoutButton: {
    height: 50,
    backgroundColor: PRIMARY,
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