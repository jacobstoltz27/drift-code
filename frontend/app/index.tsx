// Routing splash — decides where to send the user based on auth + onboarding state
import { useEffect } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/api/client";
import { colors, IMG } from "@/src/theme";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/welcome");
    } else if (!user.onboarded) {
      router.replace("/onboarding");
    } else {
      router.replace("/(tabs)/home");
    }
  }, [user, loading, router]);

  return (
    <View style={styles.wrap} testID="splash-screen">
      <Image source={{ uri: IMG.splashHero }} style={StyleSheet.absoluteFillObject} blurRadius={10} />
      <LinearGradient
        colors={["rgba(7,11,20,0.5)", "rgba(7,11,20,0.95)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.center}>
        <Text style={styles.brand}>DRIFT</Text>
        <Text style={styles.tag}>Your Passion Passport</Text>
        <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  brand: {
    color: "#fff",
    fontSize: 56,
    fontWeight: "900",
    letterSpacing: 8,
  },
  tag: { color: colors.textMuted, fontSize: 13, fontWeight: "600", marginTop: 6, letterSpacing: 2 },
});
