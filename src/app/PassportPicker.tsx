"use client";

import { useCallback, useMemo, useState } from "react";
import { PassportRequirement } from "./page";
import * as countryIcons from "country-flag-icons/react/3x2";

export interface PassportPickerProps {
  requirements: PassportRequirement[];
}

export default function PassportPicker({ requirements }: PassportPickerProps) {
  const [filter, setFilter] = useState("");
  const passports = useMemo(
    () => [...new Set(requirements.map((req) => req.Passport))],
    [requirements],
  );
  const filteredPassports = useMemo(
    () =>
      passports.filter((passport) =>
        passport.toLowerCase().includes(filter.toLowerCase()),
      ),
    [passports, filter],
  );
  const countryIcon = useCallback(
    (countryName: string) => {
      const code = requirements
        .find((req) => req.Passport === countryName)
        ?.ISO2_Code?.toUpperCase();

      return code && countryIcons[code as keyof typeof countryIcons]
        ? countryIcons[code as keyof typeof countryIcons]
        : () => null;
    },
    [requirements],
  );
  console.log(passports);

  const [selectedPassport, setSelectedPassport] = useState<string | undefined>(
    undefined,
  );

  return (
    <div className="passport-picker">
      <h1>Passport Picker</h1>
      <input
        type="text"
        placeholder="Type your passport country…"
        style={{
          marginBottom: 16,
          padding: 8,
          fontSize: 16,
          width: "100%",
          maxWidth: 400,
        }}
        autoFocus
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}
      >
        {filteredPassports.map((passport) => {
          const FlagIcon = countryIcon(passport);
          return (
            <button
              key={passport}
              onClick={() => setSelectedPassport(passport)}
              style={{
                border:
                  passport === selectedPassport
                    ? "2px solid #0070f3"
                    : "2px solid transparent",
                borderRadius: 8,
                padding: 4,
                background: "none",
                cursor: "pointer",
                outline: "none",
                boxShadow:
                  passport === selectedPassport ? "0 0 8px #0070f355" : "none",
                transition: "border 0.2s, box-shadow 0.2s",
              }}
              aria-label={passport}
            >
              <FlagIcon style={{ width: 48, height: 32, display: "block" }} />
            </button>
          );
        })}
      </div>
      <ul>
        {selectedPassport &&
          requirements
            .filter((req) => req.Passport === selectedPassport)
            .map((country) => (
              <li key={country.Destination}>
                {country.Destination} - {country.Requirement}
              </li>
            ))}
      </ul>
    </div>
  );
}
