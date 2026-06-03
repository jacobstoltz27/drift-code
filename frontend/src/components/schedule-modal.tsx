// Schedule a trip into Upcoming — premium native calendar
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/src/theme";
import { PrimaryButton } from "@/src/components/ui";
import { RangeCalendar } from "@/src/components/calendar";

const toISO = (d: Date) => d.toISOString().slice(0, 10);
const fmt = (d: Date | null) =>
  d
    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Pick a date";

const parseISO = (s?: string | null): Date | null => {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
};

export const ScheduleModal = ({
  visible,
  onClose,
  onConfirm,
  busy,
  initialStart,
  initialEnd,
  title = "Add to Upcoming Trips",
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startISO: string, endISO: string) => void | Promise<void>;
  busy?: boolean;
  initialStart?: string | null;
  initialEnd?: string | null;
  title?: string;
}) => {
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  // Reset selection whenever modal opens
  useEffect(() => {
    if (visible) {
      setStart(parseISO(initialStart));
      setEnd(parseISO(initialEnd));
    }
  }, [visible, initialStart, initialEnd]);

  const days = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1) : 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <SafeAreaView edges={["bottom"]} style={styles.sheet}>
          <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
            <View style={styles.header}>
              <View>
                <Text style={styles.eyebrow}>SCHEDULE</Text>
                <Text style={styles.title}>{title}</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                testID="schedule-close"
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={styles.dateChip}>
                <Text style={styles.dateLabel}>START</Text>
                <Text style={styles.dateValue}>{fmt(start)}</Text>
              </View>
              <View style={styles.arrow}>
                <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
              </View>
              <View style={styles.dateChip}>
                <Text style={styles.dateLabel}>END</Text>
                <Text style={styles.dateValue}>{fmt(end)}</Text>
              </View>
            </View>

            {start && end ? (
              <View style={styles.summary}>
                <Ionicons name="airplane" size={14} color={colors.accent} />
                <Text style={styles.summaryText}>
                  {days} {days === 1 ? "day" : "days"} · live countdown will appear on Home
                </Text>
              </View>
            ) : (
              <View style={styles.summary}>
                <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.summaryText, { color: colors.textMuted }]}>
                  Tap a start date, then an end date.
                </Text>
              </View>
            )}

            <View style={{ marginTop: 14 }}>
              <RangeCalendar start={start} end={end} onChange={(s, e) => { setStart(s); setEnd(e); }} />
            </View>

            <View style={{ marginTop: 14 }}>
              <PrimaryButton
                label={busy ? "Saving..." : "Save to Upcoming"}
                onPress={() => start && end && onConfirm(toISO(start), toISO(end))}
                disabled={!start || !end || !!busy}
                testID="schedule-confirm"
                icon={<Ionicons name="airplane" size={14} color="#fff" />}
              />
            </View>
          </ScrollView>
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
    maxHeight: "92%",
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
  dateChip: {
    flex: 1,
    padding: 14,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateValue: { color: "#fff", fontSize: 15, fontWeight: "800" },
  arrow: { alignItems: "center", justifyContent: "center" },
  summary: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
  },
  summaryText: { color: colors.text, fontSize: 12, fontWeight: "700", flex: 1 },
});
