// Drift Calendar — premium dark date range picker that works on web + native.
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radii } from "@/src/theme";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, 1);
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();
const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const fmtMonth = (d: Date) =>
  d.toLocaleString("en-US", { month: "long", year: "numeric" });

export const RangeCalendar = ({
  start,
  end,
  onChange,
  minDate,
}: {
  start: Date | null;
  end: Date | null;
  onChange: (s: Date | null, e: Date | null) => void;
  minDate?: Date;
}) => {
  const [cursor, setCursor] = useState<Date>(startOfMonth(start ?? new Date()));
  const today = stripTime(new Date());
  const min = minDate ? stripTime(minDate) : today;

  const grid = useMemo(() => {
    // 6 rows × 7 cols starting from Sunday of the first row containing day 1
    const first = startOfMonth(cursor);
    const startWeekday = first.getDay(); // 0..6 (Sun..Sat)
    const startDate = new Date(first);
    startDate.setDate(first.getDate() - startWeekday);
    const out: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      out.push(d);
    }
    return out;
  }, [cursor]);

  const onPickDay = (day: Date) => {
    const d = stripTime(day);
    if (d < min) return;

    if (!start || (start && end)) {
      // Start new range
      onChange(d, null);
      return;
    }
    // Have start, no end yet
    if (d < start) {
      onChange(d, null);
      return;
    }
    onChange(start, d);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setCursor((c) => addMonths(c, -1))}
          style={styles.navBtn}
          testID="cal-prev"
        >
          <Ionicons name="chevron-back" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.monthLabel}>{fmtMonth(cursor)}</Text>
        <TouchableOpacity
          onPress={() => setCursor((c) => addMonths(c, 1))}
          style={styles.navBtn}
          testID="cal-next"
        >
          <Ionicons name="chevron-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map((d, i) => (
          <Text key={i} style={styles.weekText}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {grid.map((day, i) => {
          const d = stripTime(day);
          const inMonth = day.getMonth() === cursor.getMonth();
          const disabled = d < min;
          const isStart = start && sameDay(d, start);
          const isEnd = end && sameDay(d, end);
          const inRange =
            !!start && !!end && d > start && d < end;
          const isEdge = isStart || isEnd;

          return (
            <TouchableOpacity
              key={i}
              onPress={() => onPickDay(day)}
              disabled={disabled}
              style={[
                styles.cell,
                inRange && styles.cellInRange,
                isStart && styles.cellStart,
                isEnd && styles.cellEnd,
              ]}
              testID={`cal-day-${day.toISOString().slice(0, 10)}`}
            >
              <View style={[isEdge && styles.cellActive]}>
                <Text
                  style={[
                    styles.cellText,
                    !inMonth && styles.cellTextOut,
                    disabled && styles.cellTextDisabled,
                    isEdge && styles.cellTextActive,
                    inRange && styles.cellTextInRange,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    padding: 12,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingBottom: 10,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  weekRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  weekText: {
    flex: 1,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cellInRange: { backgroundColor: colors.accentSoft },
  cellStart: {
    backgroundColor: colors.accentSoft,
    borderTopLeftRadius: 999,
    borderBottomLeftRadius: 999,
  },
  cellEnd: {
    backgroundColor: colors.accentSoft,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  cellActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  cellText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  cellTextOut: { color: colors.textDim },
  cellTextDisabled: { color: "rgba(120,130,150,0.3)" },
  cellTextActive: { color: "#fff", fontWeight: "900" },
  cellTextInRange: { color: "#fff" },
});
