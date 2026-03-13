import { HapticTab } from "@/components/haptic-tab";
import { ParkoraColors } from "@/constants/parkora-theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  nameActive,
  label,
  focused,
}: {
  name: IoniconsName;
  nameActive: IoniconsName;
  label: string;
  focused: boolean;
}) {
  return (
    <View style={styles.tabIcon}>
      <Ionicons
        name={focused ? nameActive : name}
        size={22}
        color={focused ? ParkoraColors.forest : ParkoraColors.mist}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? ParkoraColors.forest : ParkoraColors.mist },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: ParkoraColors.white,
          borderTopColor: ParkoraColors.champagne,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 82 : 62,
          paddingBottom: Platform.OS === "ios" ? 24 : 6,
          paddingTop: 8,
          elevation: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.07,
          shadowRadius: 10,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="map-outline"
              nameActive="map"
              label="Carte"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="heart-outline"
              nameActive="heart"
              label="Favoris"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="time-outline"
              nameActive="time"
              label="Historique"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="person-outline"
              nameActive="person"
              label="Profil"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: { alignItems: "center", gap: 3 },
  tabLabel: {
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
