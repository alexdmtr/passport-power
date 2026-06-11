import { passportList } from "@/lib/passport-data";
import { PassportExplorer } from "@/components/passport/passport-explorer";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-20 sm:px-8 sm:pt-14">
        <PassportExplorer passports={passportList} />
      </main>
      <footer className="text-muted-foreground border-t px-6 py-6 text-center text-[13px]">
        Data from the{" "}
        <a
          href="https://github.com/ilyankou/passport-index-dataset"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary font-medium underline-offset-4 hover:underline"
        >
          Passport Index dataset
        </a>
        . For reference only.
      </footer>
    </div>
  );
}
