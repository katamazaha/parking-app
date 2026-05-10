import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { ParkingSession } from "./MainTabs";

type HistoryScreenProps = {
  sessions: ParkingSession[];
};

export default function HistoryScreen({ sessions }: HistoryScreenProps) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Lịch sử gửi xe</Text>
      <Text style={styles.subtitle}>Theo dõi các lượt vào/ra bãi</Text>

      {sessions.map((session) => (
        <View key={session.id} style={styles.card}>
          <Text style={styles.plate}>{session.plateNumber}</Text>
          <Text style={styles.info}>Vào: {session.checkinTime}</Text>
          <Text style={styles.info}>Ra: {session.checkoutTime}</Text>
          <Text style={styles.fee}>Phí: {formatMoney(session.fee)}</Text>
        </View>
      ))}
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
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  plate: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 10,
  },
  info: {
    fontSize: 15,
    color: TEXT,
    marginBottom: 6,
  },
  fee: {
    fontSize: 16,
    fontWeight: "800",
    color: PRIMARY,
    marginTop: 6,
  },
});