import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const NEW_SITE_URL = "https://kumamorun-project.happa-tech.workers.dev";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">
            くまもーるん ステータスは移転しました
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-6 text-sm">
          <div className="space-y-3">
            <p>
              くまもーるん
              ステータスは、その他の機能と統合された新しいサイトへ移行しました。
            </p>
            <p>
              このページでの状態確認はご利用いただけません。お手数ですが、新しいサイトをご利用ください。
            </p>
          </div>

          <section className="space-y-2 text-left">
            <h2 className="text-foreground text-base font-semibold">
              移行するとできるようになること
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>守れている状態の確認</li>
              <li>くまーる交換所の利用</li>
              <li>アプリのログイン機能</li>
            </ul>
          </section>

          <section className="space-y-2 text-left">
            <h2 className="text-foreground text-base font-semibold">移行方法</h2>
            <ol className="list-decimal space-y-1 pl-5">
              <li>下のボタンから新しいサイトを開きます。</li>
              <li>Googleアカウントでログインします。</li>
              <li>
                アプリからエクスポートしたデータを読み込むと、これまでのデータを復元できます。
              </li>
            </ol>
          </section>

          <p className="font-mono text-xs break-all">{NEW_SITE_URL}</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild size="lg">
            <a href={NEW_SITE_URL}>新しいサイトへ移動する</a>
          </Button>
        </CardFooter>
        <p className="text-muted-foreground -mt-2 px-6 text-right text-xs">
          Happa technology
        </p>
      </Card>
    </main>
  );
}
