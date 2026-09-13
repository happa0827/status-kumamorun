import { LiveStatusView } from "@/components/live-status-view";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          くまもーるん ステータス
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          今の守り状態を読み取り専用で表示します
        </p>
      </div>
      <LiveStatusView />
    </main>
  );
}
