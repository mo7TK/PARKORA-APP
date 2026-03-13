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

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface MenuItem {
  icon: IoniconsName;
  label: string;
  sub: string;
  color?: string;
}

const MENU: MenuItem[] = [
  { icon: "car-outline", label: "Mes véhicules", sub: "1 véhicule enregistré" },
  {
    icon: "notifications-outline",
    label: "Notifications",
    sub: "Places libres, alertes",
  },
  {
    icon: "shield-checkmark-outline",
    label: "Confidentialité",
    sub: "Données & sécurité",
  },
  { icon: "language-outline", label: "Langue", sub: "Français" },
  { icon: "help-circle-outline", label: "Aide & Support", sub: "FAQ, contact" },
  { icon: "star-outline", label: "Évaluer Parkora", sub: "Donnez votre avis" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <TouchableOpacity style={styles.editAvatar}>
              <Ionicons name="camera" size={13} color={ParkoraColors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Ahmed Benali</Text>
          <Text style={styles.email}>ahmed.benali@email.com</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons
              name="create-outline"
              size={14}
              color={ParkoraColors.forestDeep}
            />
            <Text style={styles.editBtnText}>Modifier le profil</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          {[
            { icon: "car" as IoniconsName, value: "23", label: "Visites" },
            { icon: "heart" as IoniconsName, value: "4", label: "Favoris" },
            {
              icon: "time" as IoniconsName,
              value: "18h",
              label: "Temps total",
            },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={styles.statDiv} />}
              <View style={styles.statItem}>
                <Ionicons
                  name={s.icon}
                  size={18}
                  color={ParkoraColors.forest}
                />
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                i < MENU.length - 1 && styles.menuBorder,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconBox}>
                <Ionicons
                  name={item.icon}
                  size={19}
                  color={ParkoraColors.forest}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={ParkoraColors.champagne}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons
            name="log-out-outline"
            size={18}
            color={ParkoraColors.full}
          />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Parkora v1.0.0 · Sétif, Algérie</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ParkoraColors.parchment },
  hero: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    backgroundColor: ParkoraColors.cream,
    borderBottomWidth: 1,
    borderBottomColor: ParkoraColors.champagne,
  },
  avatarWrapper: { position: "relative", marginBottom: Spacing.md },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: ParkoraColors.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: ParkoraColors.champagne,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: ParkoraColors.cream,
    fontFamily: "Georgia",
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ParkoraColors.forest,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: ParkoraColors.white,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  email: {
    fontSize: 13,
    color: ParkoraColors.stone,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: ParkoraColors.champagne,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: ParkoraColors.white,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: ParkoraColors.forestDeep,
  },
  statsCard: {
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
  statItem: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  statLabel: { fontSize: 10, color: ParkoraColors.stone, letterSpacing: 0.3 },
  statDiv: { width: 1, backgroundColor: ParkoraColors.champagne },
  menuCard: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: 14,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ParkoraColors.parchment,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ParkoraColors.availableLight,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { fontSize: 15, fontWeight: "600", color: ParkoraColors.charcoal },
  menuSub: { fontSize: 11, color: ParkoraColors.stone, marginTop: 1 },
  logoutBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: `${ParkoraColors.full}40`,
    borderRadius: Radius.md,
    padding: 14,
    backgroundColor: `${ParkoraColors.full}08`,
  },
  logoutText: { fontSize: 14, fontWeight: "600", color: ParkoraColors.full },
  version: {
    textAlign: "center",
    fontSize: 11,
    color: ParkoraColors.mist,
    marginBottom: Spacing.xl,
  },
});
