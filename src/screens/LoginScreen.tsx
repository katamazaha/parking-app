import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const LOGO = require("../../assets/images/hust_logo.png");

type LoginScreenProps = {
  onLoginSuccess: () => void;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [studentCode, setStudentCode] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!studentCode || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã sinh viên và mật khẩu");
      return;
    }

    if (studentCode === "SV001" && password === "123456") {
      onLoginSuccess();
      return;
    }

    Alert.alert("Lỗi", "Sai mã sinh viên hoặc mật khẩu");
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Image source={LOGO} style={styles.logoImage} resizeMode="contain" />

          <Text style={styles.title}>Smart Parking</Text>
          <Text style={styles.subtitle}>Đại học Bách khoa Hà Nội</Text>

          <Text style={styles.label}>Mã sinh viên</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: SV001"
            value={studentCode}
            onChangeText={setStudentCode}
            autoCapitalize="characters"
            returnKeyType="next"
          />

          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="done"
          />

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Pressable>

          <Text style={styles.demoText}>Tài khoản demo: SV001 / 123456</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const PRIMARY = "#C8102E";
const BG = "#FFF5F6";
const BORDER = "#F0D6DB";
const TEXT = "#222222";
const SUBTEXT = "#6B6B6B";

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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  logoImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 6,
    color: TEXT,
  },
  subtitle: {
    fontSize: 15,
    color: PRIMARY,
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: TEXT,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#FFFDFD",
  },
  button: {
    height: 50,
    borderRadius: 12,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  demoText: {
    marginTop: 16,
    textAlign: "center",
    color: SUBTEXT,
  },
});