import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type TopupScreenProps = {
  balance: number;
  onBack: () => void;
  onTopupSuccess: (amount: number) => void;
};

const AMOUNTS = [10000, 20000, 50000, 100000];

export default function TopupScreen({
  balance,
  onBack,
  onTopupSuccess,
}: TopupScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleTopup = () => {
    if (!selectedAmount) {
      Alert.alert("Thông báo", "Vui lòng chọn số tiền cần nạp");
      return;
    }

    Alert.alert(
      "Nạp tiền thành công",
      `Bạn đã nạp ${formatMoney(selectedAmount)} vào tài khoản`,
      [
        {
          text: "OK",
          onPress: () => onTopupSuccess(selectedAmount),
        },
      ]
    );
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
        <Text style={styles.title}>Nạp tiền</Text>
        <Text style={styles.subtitle}>Chọn số tiền muốn nạp vào ví gửi xe</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text style={styles.balance}>{formatMoney(balance)}</Text>
        </View>

        <Text style={styles.sectionTitle}>Chọn mệnh giá</Text>

        <View style={styles.amountGrid}>
          {AMOUNTS.map((amount) => {
            const isSelected = selectedAmount === amount;

            return (
              <Pressable
                key={amount}
                style={[
                  styles.amountButton,
                  isSelected && styles.amountButtonActive,
                ]}
                onPress={() => setSelectedAmount(amount)}
              >
                <Text
                  style={[
                    styles.amountText,
                    isSelected && styles.amountTextActive,
                  ]}
                >
                  {formatMoney(amount)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Phương thức thanh toán demo</Text>
          <Text style={styles.infoText}>Chuyển khoản / QR thanh toán</Text>
          <Text style={styles.infoText}>Nội dung: NAPTIEN_SV001</Text>
        </View>

        <Pressable style={styles.confirmButton} onPress={handleTopup}>
          <Text style={styles.confirmText}>Xác nhận nạp tiền</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Quay lại</Text>
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
  balanceCard: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
  },
  balanceLabel: {
    color: "#FFE9EC",
    fontSize: 14,
    marginBottom: 8,
  },
  balance: {
    color: "white",
    fontSize: 32,
    fontWeight: "900",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 12,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  amountButton: {
    width: "47%",
    height: 56,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  amountButtonActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },
  amountTextActive: {
    color: "white",
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: SUBTEXT,
    marginBottom: 4,
  },
  confirmButton: {
    height: 52,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  confirmText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  backButton: {
    height: 48,
    backgroundColor: "white",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "800",
  },
});