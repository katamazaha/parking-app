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

import { api } from "../services/api";

type TopupScreenProps = {
  balance: number;
  studentCode: string;
  onBack: () => void;
  onTopupRequestCreated: () => void;
};

const AMOUNTS = [10000, 20000, 50000, 100000];

export default function TopupScreen({
  balance,
  studentCode,
  onBack,
  onTopupRequestCreated,
}: TopupScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleTopup = async () => {
    if (!selectedAmount) {
      Alert.alert("Thông báo", "Vui lòng chọn số tiền cần nạp");
      return;
    }

    try {
      const response = await api.post("/topup-requests", {
        studentCode,
        amount: selectedAmount,
      });

      Alert.alert(
        response.data.success ? "Thành công" : "Thất bại",
        response.data.message
      );

      if (response.data.success) {
        onTopupRequestCreated();
      }
    } catch (error: any) {
      Alert.alert(
        "Lỗi kết nối",
        error?.message || "Không thể tạo yêu cầu nạp tiền"
      );
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
        <Text style={styles.title}>Nạp tiền</Text>
        <Text style={styles.subtitle}>
          Tạo yêu cầu nạp tiền, chờ quản lý xác nhận
        </Text>

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
          <Text style={styles.infoTitle}>Quy trình nạp tiền</Text>
          <Text style={styles.infoText}>
            1. Sinh viên tạo yêu cầu nạp tiền
          </Text>
          <Text style={styles.infoText}>
            2. Người quản lý xác nhận giao dịch
          </Text>
          <Text style={styles.infoText}>
            3. Số dư ví sẽ được cộng sau khi xác nhận
          </Text>
        </View>

        <Pressable style={styles.confirmButton} onPress={handleTopup}>
          <Text style={styles.confirmText}>Tạo yêu cầu nạp tiền</Text>
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