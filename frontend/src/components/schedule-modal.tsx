// Schedule a trip into Upcoming — date picker modal
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const fmt = (d: Date) =>
  d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const ScheduleModal = ({
  visible,
  onClose,
  onConfirm,
  busy,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startISO: string, endISO: string) => void | Promise<void>;
  busy?: boolean;
}) => {
  const today = new Date();
  const inOneWeek = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const inTwoWeeks = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000);
  const [start, setStart] = useState<Date>(inOneWeek);
  const [end, setEnd] = useState<Date>(inTwoWeeks);
  const [editing, setEditing] = useState<null | "start" | "end">(null);

  const isWebOrAndroid = Platform.OS !== "ios";

  // For web/Android show inline picker on tap; for iOS use spinner inline.
  const onChangeStart = (event: any, date?: Date) => {
    if (isWebOrAndroid) setEditing(null);
    if (date) {
      setStart(date);
      if (end < date) {
        const d = new Date(date);
        d.setDate(d.getDate() + 7);
        setEnd(d);
      }
    }
  };
  const onChangeEnd = (event: any, date?: Date) => {
    if (isWebOrAndroid) setEditing(null);
    if (date) setEnd(date);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>SCHEDULE</Text>
              <Text style={styles.title}>Add to Upcoming Trips</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              testID="schedule-close"
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sub}>
            Pick your travel dates. We'll show a live countdown on Home.
          </Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.dateCard, editing === "start" && styles.dateCardActive]}
              onPress={() => setEditing(editing === "start" ? null : "start")}
              testID="schedule-start-button"
            >
              <Text style={styles.dateLabel}>Start</Text>
              <Text style={styles.dateValue}>{fmt(start)}</Text>
            </TouchableOpacity>
            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
            </View>
            <TouchableOpacity
              style={[styles.dateCard, editing === "end" && styles.dateCardActive]}
              onPress={() => setEditing(editing === "end" ? null : "end")}
              testID="schedule-end-button"
            >
              <Text style={styles.dateLabel}>End</Text>
              <Text style={styles.dateValue}>{fmt(end)}</Text>
            </TouchableOpacity>
          </View>

          {editing === "start" ? (
            <DateTimePicker
              value={start}
              mode="date"
              minimumDate={today}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeStart}
              themeVariant="dark"
              testID="schedule-start-picker"
            />
          ) : null}
          {editing === "end" ? (
            <DateTimePicker
              value={end}
              mode="date"
              minimumDate={start}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeEnd}
              themeVariant="dark"
              testID="schedule-end-picker"
            />
          ) : null}

          <View style={{ marginTop: 12 }}>
            <PrimaryButton
              label={busy ? "Saving..." : "Save to Upcoming"}
              onPress={() => onConfirm(toISO(start), toISO(end))}
              disabled={!!busy || end < start}
              testID="schedule-confirm"
              icon={<Ionicons name="airplane" size={14} color="#fff" />}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(7,11,20,0.85)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "900", marginTop: 4 },
  sub: { color: colors.textMuted, fontSize: 13, marginTop: 6 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 16,
  },
  dateCard: {
    flex: 1,
    padding: 16,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateCardActive: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  dateLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateValue: { color: "#fff", fontSize: 16, fontWeight: "800" },
  arrow: { alignItems: "center", justifyContent: "center" },
});
