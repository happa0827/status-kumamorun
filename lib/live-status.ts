export type LiveStatusPhase =
  | "lunch"
  | "play"
  | "break"
  | "paused"
  | "reward"
  | "finished"
  | "ended"
  | "idle"
  | "offline";

export type LiveStatusDaily = {
  date: string;
  plays: number;
  failures: number;
};

export type LiveStatus = {
  appRunning: boolean;
  keeping: boolean;
  phase: LiveStatusPhase | string;
  label: string;
  remainingSec: number | null;
  startedAt: number | null;
  duration: number | null;
  running: boolean;
  updatedAt: number;
  startBlocked: boolean;
  blockReason: string | null;
  daily: LiveStatusDaily | null;
};

/** Spec: remaining while running uses startedAt+duration; paused uses remainingSec as-is. */
export function remainingNow(s: LiveStatus | null): number | null {
  if (!s) return null;
  if (s.phase === "paused") return s.remainingSec;
  if (s.startedAt != null && s.duration != null) {
    return Math.max(
      0,
      Math.ceil((s.startedAt + s.duration * 1000 - Date.now()) / 1000),
    );
  }
  return s.remainingSec ?? null;
}

export function formatRemaining(sec: number | null): string {
  if (sec == null) return "--:--";
  const clamped = Math.max(0, Math.floor(sec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function isAppStopped(s: LiveStatus | null): boolean {
  if (!s) return true;
  return s.appRunning === false || s.phase === "offline";
}
