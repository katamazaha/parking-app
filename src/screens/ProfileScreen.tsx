import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type ProfileScreenProps = {
  onLogout: () => void;
  onResetData: () => void;
};

export default function ProfileScreen({
  onLogout,
  onResetData,
}: ProfileScreenProps) {
  const handleResetPress = () => {
    Alert.alert("Reset dữ liệu", "Bạn có chắc muốn reset dữ liệu demo không?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: onResetData,
      },
    ]);
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Tài khoản</Text>
      <Text style={styles.subtitle}>Thông tin sinh viên</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Họ tên</Text>
        <Text style={styles.value}>Nguyễn Văn A</Text>

        <Text style={styles.label}>Mã sinh viên</Text>
        <Text style={styles.value}>SV001</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>sv001@hust.edu.vn</Text>

        <Text style={styles.label}>Trạng thái</Text>
        <Text style={styles.active}>Đang hoạt động</Text>
      </View>

      <Pressable style={styles.resetButton} onPress={handleResetPress}>
        <Text style={styles.resetText}>Reset dữ liệu demo</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </Pressable>
    </ScrollView>
  );
}

const PRIMARY = "#C8102E";
const BG = "#FFF5F6";
const BORDER = "#F0D6DB";
const TEXT = "#222222";
const SUBTEXT = "#666666";

const styles = StyleSheet.create({
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