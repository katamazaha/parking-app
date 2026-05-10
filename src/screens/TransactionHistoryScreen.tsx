import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { Transaction } from "./MainTabs";

type TransactionHistoryScreenProps = {
  transactions: Transaction[];
};

export default function TransactionHistoryScreen({
  transactions,
}: TransactionHistoryScreenProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Lịch sử giao dịch</Text>
      <Text style={styles.subtitle}>Theo dõi các giao dịch ví gửi xe</Text>

      <View style={styles.card}>
        {transactions.map((transaction) => {
          const isTopup = transaction.amount > 0;

          return (
            <View key={transaction.id} style={styles.item}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{transaction.title}</Text>
                <Text style={styles.itemTime}>{transaction.createdAt}</Text>
                <Text style={styles.itemType}>
                  {transaction.type === "topup"
                    ? "Nạp tiền vào ví"
                    : "Thanh toán phí gửi xe"}
                </Text>
              </View>

              <Text style={[styles.amount, isTopup ? styles.plus : styles.minus]}>
                {isTopup ? "+" : ""}
                {formatMoney(transaction.amount)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function formatMoney(value: number) {
  return value.toLocaleString("vi-VN") + "đ";
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
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E3E6",
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },
  itemTime: {
    fontSize: 13,
    color: SUBTEXT,
    marginTop: 4,
  },
  itemType: {
    fontSize: 13,
    color: SUBTEXT,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: "900",
    alignSelf: "center",
  },
  plus: {
    color: PRIMARY,
  },
  minus: {
    color: SUBTEXT,
  },
});