import { GameBoy } from "@/components/GameBoy";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#4a5461] p-4">
      <GameBoy />
    </main>
  );
}
