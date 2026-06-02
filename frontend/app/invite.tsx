// Invite friends modal (simple)
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "@/src/api/client";
import { colors, radii } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";

export default function InviteScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (!email.trim()) return;
    setBusy(true);
    try {
      await api.sendInvite(email.trim().toLowerCase());
      setSent(true);
      setTimeout(() => router.back(), 1500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={["#0B1024", "#1B1F3B"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.closeBtn}
            testID="invite-close"
          >
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, paddingHorizontal: 24 }}
        >
          <View style={{ flex: 1 }} />
          <Text style={styles.eyebrow}>UNLOCK MORE</Text>
          <Text style={styles.title}>Invite a friend</Text>
          <Text style={styles.sub}>
            Each invite unlocks a new perk: Trip Score, World Map, Steal, Group Planning,
            Creator profiles.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="friend@email.com"
            placeholderTextColor={colors.textDim}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="invite-email-input"
          />
          {sent ? (
            <Text style={styles.sentText}>Invite sent! ✓</Text>
          ) : null}
          <PrimaryButton
            label={busy ? "Sending..." : "Send Invite"}
            onPress={send}
            disabled={!email.trim() || busy}
            testID="invite-send-button"
          />
          <View style={{ flex: 1 }} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#fff", fontSize: 36, fontWeight: "900", letterSpacing: -0.6, marginTop: 6 },
  sub: { color: colors.textMuted, fontSize: 14, lineHeight: 22, marginTop: 10 },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    color: "#fff",
    fontSize: 15,
    marginTop: 22,
    marginBottom: 14,
  },
  sentText: { color: colors.teal, fontWeight: "800", marginBottom: 10 },
});
