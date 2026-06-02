// Welcome / auth entry screen
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/api/client";
import { colors, radii, IMG } from "@/src/theme";
import { PrimaryButton, GhostButton } from "@/src/components/ui";

export default function Welcome() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"intro" | "login" | "register">("intro");
  const [email, setEmail] = useState("demo@drift.app");
  const [password, setPassword] = useState("DriftDemo123!");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setBusy(true);
    try {
      if (mode === "login") {
        await login(email.trim().toLowerCase(), password);
      } else {
        if (!name.trim()) {
          setErr("Name is required");
          setBusy(false);
          return;
        }
        await register(email.trim().toLowerCase(), password, name.trim());
      }
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Image source={{ uri: IMG.splashHero }} style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={["rgba(7,11,20,0.4)", "rgba(7,11,20,0.95)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }} />

            <Text style={styles.brand}>DRIFT</Text>
            <Text style={styles.tag}>Your Passion Passport</Text>
            <Text style={styles.lead}>
              Discover trips. Steal itineraries. Plan with friends.
            </Text>

            {mode === "intro" ? (
              <View style={{ marginTop: 40, gap: 12 }}>
                <PrimaryButton
                  label="Get Started"
                  onPress={() => setMode("register")}
                  testID="welcome-get-started-button"
                />
                <GhostButton
                  label="Log in"
                  onPress={() => setMode("login")}
                  testID="welcome-login-button"
                />
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {mode === "login" ? "Welcome back" : "Create your account"}
                </Text>

                {mode === "register" ? (
                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor={colors.textDim}
                    value={name}
                    onChangeText={setName}
                    testID="auth-name-input"
                  />
                ) : null}

                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={colors.textDim}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  testID="auth-email-input"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={colors.textDim}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  testID="auth-password-input"
                />

                {err ? (
                  <Text style={styles.err} testID="auth-error">
                    {err}
                  </Text>
                ) : null}

                <PrimaryButton
                  label={mode === "login" ? "Log in" : "Create account"}
                  onPress={submit}
                  loading={busy}
                  testID="auth-submit-button"
                />

                <TouchableOpacity
                  onPress={() => setMode(mode === "login" ? "register" : "login")}
                  style={{ alignSelf: "center", paddingVertical: 12 }}
                  testID="auth-toggle-mode"
                >
                  <Text style={styles.toggleText}>
                    {mode === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Log in"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 28 },
  brand: { color: "#fff", fontSize: 56, fontWeight: "900", letterSpacing: 8 },
  tag: { color: colors.textMuted, fontSize: 13, fontWeight: "600", marginTop: 4, letterSpacing: 2 },
  lead: {
    color: colors.text,
    fontSize: 18,
    marginTop: 18,
    lineHeight: 26,
    fontWeight: "600",
  },
  form: {
    marginTop: 32,
    gap: 12,
    backgroundColor: "rgba(7,11,20,0.6)",
    padding: 18,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 4 },
  input: {
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    color: "#fff",
    fontSize: 15,
  },
  err: { color: colors.danger, fontSize: 13, fontWeight: "600" },
  toggleText: { color: colors.accent, fontWeight: "700", fontSize: 13 },
});
