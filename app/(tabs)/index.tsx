import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { ParkoraColors, Radius, Spacing } from "@/constants/parkora-theme";
import { MOCK_PARKINGS, Parking } from "@/data/mock-parkings";

const { width: W, height: H } = Dimensions.get("window");

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColor = (s: Parking["status"]) =>
  s === "available"
    ? ParkoraColors.available
    : s === "low"
      ? ParkoraColors.low
      : ParkoraColors.full;

const statusBg = (s: Parking["status"]) =>
  s === "available"
    ? ParkoraColors.availableLight
    : s === "low"
      ? ParkoraColors.lowLight
      : ParkoraColors.fullLight;

const statusLabel = (s: Parking["status"]) =>
  s === "available" ? "Disponible" : s === "low" ? "Limité" : "Complet";

const statusIcon = (
  s: Parking["status"],
): React.ComponentProps<typeof Ionicons>["name"] =>
  s === "available"
    ? "checkmark-circle"
    : s === "low"
      ? "warning"
      : "close-circle";

// ─── Custom Map Marker ────────────────────────────────────────────────────────
function ParkingMarker({
  parking,
  selected,
  onPress,
}: {
  parking: Parking;
  selected: boolean;
  onPress: () => void;
}) {
  const color = statusColor(parking.status);
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.15 : 1,
      useNativeDriver: true,
      tension: 130,
      friction: 7,
    }).start();
  }, [selected]);

  return (
    <Marker
      coordinate={parking.coordinate}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <Animated.View style={[styles.markerWrapper, { transform: [{ scale }] }]}>
        <View
          style={[
            styles.markerBubble,
            {
              backgroundColor: selected ? color : ParkoraColors.white,
              borderColor: color,
              shadowColor: color,
            },
          ]}
        >
          <Text
            style={[
              styles.markerCount,
              { color: selected ? ParkoraColors.white : color },
            ]}
          >
            {parking.available}
          </Text>
          <Text
            style={[
              styles.markerLabel,
              { color: selected ? ParkoraColors.white : ParkoraColors.stone },
            ]}
          >
            places
          </Text>
        </View>
        {/* Triangle pointer */}
        <View
          style={[
            styles.markerPointer,
            { borderTopColor: selected ? color : ParkoraColors.white },
          ]}
        />
        <View style={[styles.markerPointerBorder, { borderTopColor: color }]} />
      </Animated.View>
    </Marker>
  );
}

// ─── Bottom Detail Card ───────────────────────────────────────────────────────
function ParkingCard({
  parking,
  onClose,
  onFavorite,
}: {
  parking: Parking;
  onClose: () => void;
  onFavorite: (id: string) => void;
}) {
  const slideY = useRef(new Animated.Value(300)).current;
  const [fav, setFav] = useState(parking.isFavorite);

  useEffect(() => {
    slideY.setValue(300);
    Animated.spring(slideY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 85,
      friction: 12,
    }).start();
  }, [parking.id]);

  const color = statusColor(parking.status);
  const bg = statusBg(parking.status);
  const pct =
    parking.total > 0
      ? Math.round((parking.available / parking.total) * 100)
      : 0;

  const handleFav = () => {
    setFav((v) => !v);
    onFavorite(parking.id);
  };

  return (
    <Animated.View
      style={[styles.card, { transform: [{ translateY: slideY }] }]}
    >
      {/* Handle */}
      <View style={styles.cardHandle} />

      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={styles.cardName}>{parking.name}</Text>
          <View style={styles.cardAddressRow}>
            <Ionicons
              name="location-outline"
              size={12}
              color={ParkoraColors.stone}
            />
            <Text style={styles.cardAddress}>{parking.address}</Text>
          </View>
        </View>
        <View style={styles.cardHeaderActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleFav}>
            <Ionicons
              name={fav ? "heart" : "heart-outline"}
              size={20}
              color={fav ? "#C0392B" : ParkoraColors.stone}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={onClose}>
            <Ionicons name="close" size={18} color={ParkoraColors.stone} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: bg,
            alignSelf: "flex-start",
            marginBottom: Spacing.md,
          },
        ]}
      >
        <Ionicons name={statusIcon(parking.status)} size={13} color={color} />
        <Text style={[styles.statusText, { color }]}>
          {statusLabel(parking.status)}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          {
            icon: "car-outline" as const,
            value: String(parking.available),
            label: "Libres",
          },
          {
            icon: "grid-outline" as const,
            value: String(parking.total),
            label: "Total",
          },
          {
            icon: "navigate-outline" as const,
            value: parking.distance,
            label: "Distance",
          },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={styles.statDiv} />}
            <View style={styles.statItem}>
              <Ionicons name={s.icon} size={16} color={ParkoraColors.forest} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBox}>
        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%` as any, backgroundColor: color },
            ]}
          />
        </View>
        <Text style={[styles.progressLabel, { color }]}>{pct}% disponible</Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnSecondary}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={ParkoraColors.forestDeep}
          />
          <Text style={styles.btnSecondaryText}>Détails</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: color }]}
        >
          <Ionicons name="navigate" size={16} color={ParkoraColors.white} />
          <Text style={styles.btnPrimaryText}>Y aller</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ─── Mini Card (horizontal list) ─────────────────────────────────────────────
function MiniCard({
  parking,
  onPress,
}: {
  parking: Parking;
  onPress: () => void;
}) {
  const color = statusColor(parking.status);
  return (
    <TouchableOpacity
      style={styles.miniCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.miniAccent, { backgroundColor: color }]} />
      <View style={styles.miniContent}>
        <Text style={styles.miniName} numberOfLines={1}>
          {parking.name}
        </Text>
        <View style={styles.miniRow}>
          <Ionicons
            name="location-outline"
            size={10}
            color={ParkoraColors.stone}
          />
          <Text style={styles.miniDist}>{parking.distance}</Text>
        </View>
        <View style={styles.miniBottom}>
          <Text style={[styles.miniAvail, { color }]}>
            {parking.available} libres
          </Text>
          <Text style={styles.miniPrice}>{parking.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SETIF_REGION: Region = {
  latitude: 36.1908,
  longitude: 5.4108,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const headerAnim = useRef(new Animated.Value(0)).current;

  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [parkings, setParkings] = useState(MOCK_PARKINGS);
  const [search, setSearch] = useState("");
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);

  // Request location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationGranted(true);
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        mapRef.current?.animateToRegion(
          {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          },
          800,
        );
      }
    })();
  }, []);

  // Header animation
  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const displayed = search.trim()
    ? parkings.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase()),
      )
    : parkings;

  const handleMarkerPress = (p: Parking) => {
    setSelectedParking((prev) => (prev?.id === p.id ? null : p));
    mapRef.current?.animateToRegion(
      {
        latitude: p.coordinate.latitude - 0.003,
        longitude: p.coordinate.longitude,
        latitudeDelta: 0.014,
        longitudeDelta: 0.014,
      },
      600,
    );
  };

  const handleFavorite = (id: string) => {
    setParkings((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)),
    );
  };

  const centerOnUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion(
        { ...userLocation, latitudeDelta: 0.015, longitudeDelta: 0.015 },
        600,
      );
    }
  };

  const availableCount = parkings.filter((p) => p.status !== "full").length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      {/* ── Real Map ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={SETIF_REGION}
        showsUserLocation={locationGranted}
        showsMyLocationButton={false}
        showsCompass={false}
        customMapStyle={MAP_STYLE}
      >
        {displayed.map((p) => (
          <ParkingMarker
            key={p.id}
            parking={p}
            selected={selectedParking?.id === p.id}
            onPress={() => handleMarkerPress(p)}
          />
        ))}
      </MapView>

      {/* ── Header overlay ── */}
      <Animated.View
        style={[
          styles.headerOverlay,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-24, 0],
                }),
              },
            ],
          },
        ]}
        pointerEvents="box-none"
      >
        <SafeAreaView edges={["top"]} pointerEvents="box-none">
          {/* Title row */}
          <View style={styles.titleRow}>
            <View style={styles.logoRow}>
              <View style={styles.logoMark}>
                <Ionicons name="car" size={16} color={ParkoraColors.cream} />
              </View>
              <View>
                <Text style={styles.logoName}>Parkora</Text>
                <Text style={styles.logoSub}>
                  {availableCount} parkings disponibles
                </Text>
              </View>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={18}
                color={ParkoraColors.mist}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un parking…"
                placeholderTextColor={ParkoraColors.mist}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={ParkoraColors.mist}
                  />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.filterBtn}>
              <Ionicons
                name="options-outline"
                size={20}
                color={ParkoraColors.cream}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* ── Legend chips ── */}
      <View style={styles.legendRow} pointerEvents="none">
        {[
          {
            color: ParkoraColors.available,
            label: "Libre",
            icon: "checkmark-circle" as const,
          },
          {
            color: ParkoraColors.low,
            label: "Limité",
            icon: "warning" as const,
          },
          {
            color: ParkoraColors.full,
            label: "Plein",
            icon: "close-circle" as const,
          },
        ].map((item) => (
          <View key={item.label} style={styles.legendChip}>
            <Ionicons name={item.icon} size={11} color={item.color} />
            <Text style={[styles.legendLabel, { color: item.color }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Center on user button ── */}
      <TouchableOpacity style={styles.locationBtn} onPress={centerOnUser}>
        <Ionicons name="locate" size={20} color={ParkoraColors.forest} />
      </TouchableOpacity>

      {/* ── Bottom: Card or mini list ── */}
      {selectedParking ? (
        <ParkingCard
          parking={selectedParking}
          onClose={() => setSelectedParking(null)}
          onFavorite={handleFavorite}
        />
      ) : (
        <View style={styles.listPanel}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>À proximité</Text>
            <Text style={styles.listCount}>{displayed.length} parkings</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: 12 }}
          >
            {displayed.map((p) => (
              <MiniCard
                key={p.id}
                parking={p}
                onPress={() => handleMarkerPress(p)}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── Old-money custom map style ───────────────────────────────────────────────
const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#EDE6D6" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4A4A4A" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F7F3EC" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#F7F3EC" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#D4C5A0" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#D4C5A0" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#B8D4C8" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#C8DEC4" }],
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#D4C5A0" }],
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ParkoraColors.parchment },
  map: { width: W, flex: 1 },

  // Marker
  markerWrapper: { alignItems: "center" },
  markerBubble: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: "center",
    minWidth: 52,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  markerCount: { fontSize: 15, fontWeight: "800", lineHeight: 18 },
  markerLabel: { fontSize: 9, fontWeight: "500", letterSpacing: 0.2 },
  markerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -1,
  },
  markerPointerBorder: {
    position: "absolute",
    bottom: -1,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 9,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },

  // Header
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: "rgba(247,243,236,0.94)",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.sm,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoMark: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: ParkoraColors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  logoName: {
    fontSize: 20,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
    letterSpacing: 0.3,
  },
  logoSub: { fontSize: 11, color: ParkoraColors.stone, marginTop: 1 },

  searchRow: { flexDirection: "row", gap: 10, paddingBottom: 4 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: ParkoraColors.charcoal,
    fontFamily: "Helvetica Neue",
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: Radius.md,
    backgroundColor: ParkoraColors.forest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: ParkoraColors.forest,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  // Legend
  legendRow: {
    position: "absolute",
    top: Platform.OS === "ios" ? 155 : 130,
    right: Spacing.md,
    flexDirection: "column",
    gap: 6,
  },
  legendChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(247,243,236,0.93)",
    borderRadius: Radius.full,
    paddingHorizontal: 9,
    paddingVertical: 5,
    gap: 5,
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
  },
  legendLabel: { fontSize: 10, fontWeight: "600" },

  // Location button
  locationBtn: {
    position: "absolute",
    right: Spacing.md,
    bottom: 220,
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: ParkoraColors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  // Mini list panel
  listPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ParkoraColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === "ios" ? 28 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 10,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
    letterSpacing: 0.3,
  },
  listCount: { fontSize: 12, color: ParkoraColors.stone },

  // Mini card
  miniCard: {
    width: 148,
    backgroundColor: ParkoraColors.white,
    borderRadius: Radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  miniAccent: { height: 4 },
  miniContent: { padding: 12 },
  miniName: {
    fontSize: 13,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  miniRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 },
  miniDist: { fontSize: 10, color: ParkoraColors.stone },
  miniBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  miniAvail: { fontSize: 13, fontWeight: "700" },
  miniPrice: { fontSize: 10, color: ParkoraColors.stone },

  // Big card
  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ParkoraColors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Platform.OS === "ios" ? 36 : Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  cardHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: ParkoraColors.mist,
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
    gap: 8,
  },
  cardName: {
    fontSize: 19,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
    lineHeight: 24,
  },
  cardAddressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 3,
  },
  cardAddress: { fontSize: 12, color: ParkoraColors.stone },
  cardHeaderActions: { flexDirection: "row", gap: 6 },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: ParkoraColors.parchment,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: ParkoraColors.champagne,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 5,
  },
  statusText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  updatedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  updatedText: { fontSize: 10, color: ParkoraColors.silver },
  statsRow: {
    flexDirection: "row",
    backgroundColor: ParkoraColors.cream,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statValue: {
    fontSize: 15,
    fontWeight: "700",
    color: ParkoraColors.forestDeep,
    fontFamily: "Georgia",
  },
  statLabel: { fontSize: 9, color: ParkoraColors.stone, letterSpacing: 0.3 },
  statDiv: { width: 1, height: 36, backgroundColor: ParkoraColors.champagne },
  progressBox: { marginBottom: Spacing.md, gap: 5 },
  progressBg: {
    height: 6,
    backgroundColor: ParkoraColors.parchment,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 11, textAlign: "right", fontWeight: "600" },
  cardActions: { flexDirection: "row", gap: 12 },
  btnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: ParkoraColors.champagne,
    backgroundColor: ParkoraColors.cream,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: ParkoraColors.forestDeep,
  },
  btnPrimary: {
    flex: 1.6,
    height: 48,
    borderRadius: Radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: ParkoraColors.white,
    letterSpacing: 0.4,
  },
});
