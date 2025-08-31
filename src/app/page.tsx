import styles from "./page.module.css";
import Papa from "papaparse";
import fs from "fs";
import path from "path";
import PassportPicker from "./PassportPicker";

export type PassportRequirement = {
  Passport: string;
  Destination: string;
  Requirement: string;
  ISO2_Code: string;
};

const fileContents = fs.readFileSync(
  path.join(process.cwd(), "src", "data", "passport-index-tidy.csv"),
  "utf8",
);
const requirements = Papa.parse<PassportRequirement>(fileContents, {
  header: true,
}).data;

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <PassportPicker requirements={requirements} />

        <div className={styles.ctas}></div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
