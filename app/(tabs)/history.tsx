import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ParkoraColors, Radius, Spacing } from "@/constants/parkora-theme";

interface HistoryItem {
  id: string;
  name: string;
  address: string;
  date: string;
  duration: string;
  cost: string;
  spotsFound: number;
}

const HISTORY: HistoryItem[] = [
  {
    id: "1",
    name: "Parking 8 Mai 1945",
    address: "Place du 8 Mai 1945, Sétif",
    date: "Aujourd'hui, 09:15",
    duration: "2h 30min",
    cost: "50 DA",
    spotsFound: 12,
  },
  {
    id: "2",
    name: "Parking Aïn Fouara",
    address: "Rue Aïn Fouara, Centre-ville",
    date: "Hier, 14:40",
    duration: "1h 15min",
    cost: "20 DA",
    spotsFound: 3,
  },
  {
    id: "3",
    name: "Parking Rue de France",
    address: "Rue de France, Sétif",
    date: "9 Mars, 11:00",
    duration: "3h 00min",
    cost: "60 DA",
    spotsFound: 22,
  },
  {
    id: "4",
    name: "Parking Hôtel de Ville",
    address: "Hôtel de Ville, Centre",
    date: "7 Mars, 16:20",
    duration: "45min",
    cost: "Gratuit",
    spotsFound: 8,
  },
  {
    id: "5",
    name: "Parking Marché Central",
    address: "Marché Central, Sétif",
    date: "4 Mars, 08:55",
    duration: "1h 00min",
    cost: "20 DA",
    spotsFound: 5,
  },
];

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Historique</Text>
          <Text style={styles.sub}>Vos dernières visites</Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="time" size={20} color={ParkoraColors.forest} />
        </View>
      </View>

      {/* Stats summary */}
      <View style={styles.summaryCard}>
        {[
          {
            icon: "car" as const,
            value: String(HISTORY.length),
            label: "Visites",
          },
          { icon: "time-outline" as const, value: "8h 30", label: "Total" },
          {
            icon: "checkmark-circle-outline" as const,
            value: "50",
            label: "Places trouvées",
          },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={styles.summaryDiv} />}
            <View style={styles.summaryItem}>
              <Ionicons name={s.icon} size={18} color={ParkoraColors.forest} />
              <Text style={styles.summaryValue}>{s.value}</Text>
              <Text style={styles.summaryLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Ce mois-ci</Text>

        {HISTORY.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="car" size={20} color={ParkoraColors.forest} />
              </View>
              <View style={styles.timeline} />
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <View style={styles.addrRow}>
                <Ionicons
                  name="location-outline"
                  size={11}
                  color={ParkoraColors.stone}
                />
                <Text style={styles.cardAddr}>{item.address}</Text>
              </View>
              <View style={styles.chipsRow}>
                <View style={styles.chip}>
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color={ParkoraColors.slate}
                  />
                  <Text style={styles.chipText}>{item.duration}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons
                    name="pricetag-outline"
                    size={11}
                    color={ParkoraColors.slate}
                  />
                  <Text style={styles.chipText}>{item.cost}</Text>
                </View>
                <View style={[styles.chip, styles.chipGreen]}>
                  <Ionicons
                    name="checkmark-circle"
                    size={11}
                    color={ParkoraColors.available}
                  />
                  <Text
                    style={[
                      styles.chipText,
                      { color: ParkoraColors.available },
                    ]}
                  >
                    {item.spotsFound} trouvées
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ParkoraColors.parchment },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: ParkoraColors.cream,
    borderBottomWidth: 1,
    borderBottomColor: ParkoraColors.champagne,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  sub: { fontSize: 12, color: ParkoraColors.stone, marginTop: 2 },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: ParkoraColors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
  },
  summaryCard: {
    flexDirection: "row",
    margin: Spacing.md,
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: "center", gap: 4 },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  summaryLabel: {
    fontSize: 10,
    color: ParkoraColors.stone,
    letterSpacing: 0.3,
  },
  summaryDiv: { width: 1, backgroundColor: ParkoraColors.champagne },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: ParkoraColors.stone,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: { alignItems: "center", paddingTop: 2 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ParkoraColors.availableLight,
    alignItems: "center",
    justifyContent: "center",
  },
  timeline: {
    flex: 1,
    width: 1,
    backgroundColor: ParkoraColors.champagne,
    marginTop: 6,
  },
  cardContent: { flex: 1, gap: 6 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
    flex: 1,
  },
  cardDate: { fontSize: 10, color: ParkoraColors.silver, marginLeft: 8 },
  addrRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardAddr: { fontSize: 11, color: ParkoraColors.stone },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: ParkoraColors.parchment,
    borderRadius: Radius.full,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipGreen: { backgroundColor: ParkoraColors.availableLight },
  chipText: { fontSize: 11, color: ParkoraColors.slate, fontWeight: "500" },
});
