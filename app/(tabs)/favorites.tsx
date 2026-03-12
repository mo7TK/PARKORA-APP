import { ParkoraColors, Radius, Spacing } from "@/constants/parkora-theme";
import { MOCK_PARKINGS } from "@/data/mock-parkings";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAVORITES = MOCK_PARKINGS.filter((p) => ["1", "4"].includes(p.id));

const statusColor = (s: string) =>
  s === "available"
    ? ParkoraColors.available
    : s === "low"
      ? ParkoraColors.low
      : ParkoraColors.full;

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoris</Text>
        <Text style={styles.sub}>{FAVORITES.length} parkings enregistrés</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: Spacing.md, gap: 14 }}
        showsVerticalScrollIndicator={false}
      >
        {FAVORITES.map((p) => (
          <TouchableOpacity key={p.id} style={styles.card} activeOpacity={0.8}>
            <View
              style={[
                styles.accent,
                { backgroundColor: statusColor(p.status) },
              ]}
            />
            <View style={styles.cardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardAddress}>{p.address}</Text>
                <View style={styles.row}>
                  <Text
                    style={[styles.avail, { color: statusColor(p.status) }]}
                  >
                    {p.available} places libres
                  </Text>
                  <Text style={styles.dist}>· {p.distance}</Text>
                </View>
              </View>
              <View style={styles.heart}>
                <Text style={{ fontSize: 20 }}>♥</Text>
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerPrice}>{p.price}</Text>
              <TouchableOpacity style={styles.navBtn}>
                <Text style={styles.navBtnText}>Naviguer →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {FAVORITES.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>♡</Text>
            <Text style={styles.emptyTitle}>Aucun favori</Text>
            <Text style={styles.emptyText}>
              Ajoutez des parkings à vos favoris pour les retrouver rapidement.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ParkoraColors.parchment },
  header: {
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
  sub: {
    fontSize: 12,
    color: ParkoraColors.stone,
    marginTop: 2,
    letterSpacing: 0.3,
  },

  card: {
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  accent: { height: 3 },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  cardAddress: { fontSize: 12, color: ParkoraColors.stone, marginTop: 2 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 },
  avail: { fontSize: 13, fontWeight: "600" },
  dist: { fontSize: 12, color: ParkoraColors.stone },
  heart: { paddingLeft: 12 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: ParkoraColors.parchment,
  },
  footerPrice: { fontSize: 13, color: ParkoraColors.stone },
  navBtn: {
    backgroundColor: ParkoraColors.forest,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.md,
  },
  navBtnText: { color: ParkoraColors.cream, fontSize: 12, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyIcon: { fontSize: 48, color: ParkoraColors.champagne },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  emptyText: {
    fontSize: 13,
    color: ParkoraColors.stone,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
