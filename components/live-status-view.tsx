"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import { getFirebaseAuth, getFirebaseDatabase } from "@/lib/firebase";
import {
  formatRemaining,
  isAppStopped,
  remainingNow,
  type LiveStatus,
} from "@/lib/live-status";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LiveStatusView() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [listenError, setListenError] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState(0);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
      setAuthReady(true);
      if (!next) {
        setStatus(null);
        setListenError(null);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    const db = getFirebaseDatabase();
    const statusRef = ref(db, `users/${user.uid}/liveStatus`);
    const unsub = onValue(
      statusRef,
      (snapshot) => {
        setListenError(null);
        const value = snapshot.val() as LiveStatus | null;
        setStatus(value);
      },
      (error) => {
        setListenError(error.message);
        setStatus(null);
      },
    );

    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const id = window.setInterval(() => {
      setNowTick((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [user]);

  // nowTick forces remainingNow recalculation every second
  void nowTick;

  if (!authReady) {
    return (
      <p className="text-muted-foreground text-sm" aria-live="polite">
        認証状態を確認中…
      </p>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const remaining = remainingNow(status);
  const stopped = isAppStopped(status);
  const keeping = !stopped && status?.keeping === true;
  const failures = status?.daily?.failures ?? null;
  const week = status?.week ?? null;

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle>ライブステータス</CardTitle>
          <CardDescription className="break-all">{user.email}</CardDescription>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => signOut(getFirebaseAuth())}
        >
          ログアウト
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {listenError ? (
          <p className="text-sm text-destructive" role="alert">
            {listenError}
          </p>
        ) : null}

        <div
          className={`rounded-lg border px-4 py-3 text-center text-lg font-semibold ${
            stopped
              ? "border-muted bg-muted/40 text-muted-foreground"
              : keeping
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
          }`}
        >
          {stopped
            ? "アプリ停止"
            : keeping
              ? "守れている"
              : "守れていない"}
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground">残り</dt>
          <dd className="font-mono text-base tabular-nums">
            {formatRemaining(remaining)}
          </dd>

          <dt className="text-muted-foreground">状態</dt>
          <dd>{status?.label || status?.phase || "—"}</dd>

          <dt className="text-muted-foreground">失敗数（当日）</dt>
          <dd>{failures == null ? "—" : failures}</dd>
        </dl>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">直近1週間</h3>
          {week && week.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">日付</th>
                    <th className="px-3 py-2 font-medium">遊び</th>
                    <th className="px-3 py-2 font-medium">失敗</th>
                    <th className="px-3 py-2 font-medium">成功</th>
                  </tr>
                </thead>
                <tbody>
                  {week.map((day) => (
                    <tr key={day.date} className="border-t">
                      <td className="px-3 py-2 font-mono tabular-nums">
                        {day.date}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{day.plays}</td>
                      <td className="px-3 py-2 tabular-nums">{day.failures}</td>
                      <td className="px-3 py-2">
                        {day.success ? "○" : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">—</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
