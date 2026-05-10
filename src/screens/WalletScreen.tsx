import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Transaction } from "./MainTabs";

type WalletScreenProps = {
  balance: number;
  transactions: Transaction[];
  onTopup: () => void;
  onSeeAllTransactions: () => void;
};

export default function WalletScreen({
  balance,
  transactions,
  onTopup,
  onSeeAllTransactions,
}: WalletScreenProps) {
  const recentTransactions = transactions.slice(0, 3);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Ví tài khoản</Text>
      <Text style={styles.subtitle}>Quản lý số dư gửi xe sinh viên</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
        <Text style={styles.balance}>{formatMoney(balance)}</Text>
      </View>

      <Pressable style={styles.topupButton} onPress={onTopup}>
        <Text style={styles.topupText}>Nạp tiền</Text>
      </Pressable>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Giao dịch gần đây</Text>

          <Pressable onPress={onSeeAllTransactions}>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </Pressable>
        </View>

        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionText}>{transaction.title}</Text>
              <Text style={styles.transactionTime}>{transaction.createdAt}</Text>
            </View>

            <Text
              style={[
                styles.amount,
                transaction.amount > 0 ? styles.plus : styles.minus,
              ]}
            >
              {transaction.amount > 0 ? "+" : ""}
              {formatMoney(transaction.amount)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#FFE9EC",
    fontSize: 14,
    marginBottom: 8,
  },
  balance: {
    color: "white",
    fontSize: 34,
    fontWeight: "900",
  },
  topupButton: {
    height: 50,
    backgroundColor: PRIMARY_DARK,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  topupText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "800",
    color: PRIMARY,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E3E6",
    gap: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionText: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT,
  },
  transactionTime: {
    fontSize: 12,
    color: SUBTEXT,
    marginTop: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: "800",
    alignSelf: "center",
  },
  plus: {
    color: PRIMARY,
  },
  minus: {
    color: SUBTEXT,
  },
});