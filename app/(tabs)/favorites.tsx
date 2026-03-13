import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ParkoraColors, Radius, Spacing } from "@/constants/parkora-theme";
import { MOCK_PARKINGS, Parking } from "@/data/mock-parkings";

const statusColor = (s: Parking["status"]) =>
  s === "available"
    ? ParkoraColors.available
    : s === "low"
      ? ParkoraColors.low
      : ParkoraColors.full;

const statusLabel = (s: Parking["status"]) =>
  s === "available" ? "Disponible" : s === "low" ? "Limité" : "Complet";

export default function FavoritesScreen() {
  const [parkings, setParkings] = useState(
    MOCK_PARKINGS.filter((p) => p.isFavorite),
  );

  const removeFav = (id: string) => {
    setParkings((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes Favoris</Text>
          <Text style={styles.sub}>
            {parkings.length} parking{parkings.length !== 1 ? "s" : ""}{" "}
            enregistré{parkings.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="heart" size={20} color={ParkoraColors.forest} />
        </View>
      </View>

      {parkings.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBox}>
            <Ionicons
              name="heart-outline"
              size={42}
              color={ParkoraColors.champagne}
            />
          </View>
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Appuyez sur{" "}
            <Ionicons
              name="heart-outline"
              size={13}
              color={ParkoraColors.stone}
            />{" "}
            sur un parking pour ajouter ici.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: Spacing.md, gap: 14 }}
          showsVerticalScrollIndicator={false}
        >
          {parkings.map((p) => {
            const color = statusColor(p.status);
            const pct =
              p.total > 0 ? Math.round((p.available / p.total) * 100) : 0;
            return (
              <View key={p.id} style={styles.card}>
                <View style={[styles.cardAccent, { backgroundColor: color }]} />
                <View style={styles.cardBody}>
                  <View style={styles.cardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardName}>{p.name}</Text>
                      <View style={styles.addrRow}>
                        <Ionicons
                          name="location-outline"
                          size={11}
                          color={ParkoraColors.stone}
                        />
                        <Text style={styles.cardAddr}>{p.address}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.favBtn}
                      onPress={() => removeFav(p.id)}
                    >
                      <Ionicons name="heart" size={18} color="#C0392B" />
                    </TouchableOpacity>
                  </View>

                  {/* Status row */}
                  <View style={styles.statusRow}>
                    <View
                      style={[styles.badge, { backgroundColor: color + "1A" }]}
                    >
                      <Ionicons
                        name={
                          p.status === "available"
                            ? "checkmark-circle"
                            : p.status === "low"
                              ? "warning"
                              : "close-circle"
                        }
                        size={12}
                        color={color}
                      />
                      <Text style={[styles.badgeText, { color }]}>
                        {statusLabel(p.status)}
                      </Text>
                    </View>
                    <Text style={styles.updated}>{p.lastUpdated}</Text>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Ionicons
                        name="car-outline"
                        size={13}
                        color={ParkoraColors.forest}
                      />
                      <Text style={[styles.statVal, { color }]}>
                        {p.available}
                      </Text>
                      <Text style={styles.statLbl}>libres</Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons
                        name="navigate-outline"
                        size={13}
                        color={ParkoraColors.forest}
                      />
                      <Text style={styles.statVal}>{p.distance}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons
                        name="pricetag-outline"
                        size={13}
                        color={ParkoraColors.forest}
                      />
                      <Text style={styles.statVal}>{p.price}</Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${pct}%` as any, backgroundColor: color },
                      ]}
                    />
                  </View>

                  {/* Action */}
                  <TouchableOpacity
                    style={[styles.navBtn, { backgroundColor: color }]}
                  >
                    <Ionicons
                      name="navigate"
                      size={14}
                      color={ParkoraColors.white}
                    />
                    <Text style={styles.navBtnText}>Y aller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    paddingBottom: 80,
  },
  emptyIconBox: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: ParkoraColors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
  },
  emptyTitle: {
    fontSize: 19,
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
  cardAccent: { height: 4 },
  cardBody: { padding: Spacing.md, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  addrRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  cardAddr: { fontSize: 11, color: ParkoraColors.stone },
  favBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  updated: { fontSize: 10, color: ParkoraColors.silver },
  statsRow: { flexDirection: "row", gap: 16 },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  statVal: {
    fontSize: 13,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
  },
  statLbl: { fontSize: 11, color: ParkoraColors.stone },
  progressBg: {
    height: 5,
    backgroundColor: ParkoraColors.parchment,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 5, borderRadius: 3 },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    height: 42,
    borderRadius: Radius.md,
  },
  navBtnText: { color: ParkoraColors.white, fontSize: 13, fontWeight: "700" },
});
