"use client";

import { useMemo, useState } from "react";
import { PassportRequirement } from "./page";

export interface PassportPickerProps {
  requirements: PassportRequirement[];
}

export default function PassportPicker({ requirements }: PassportPickerProps) {
  const passports = useMemo(
    () => [...new Set(requirements.map((req) => req.Passport))],
    [requirements],
  );
  const [selectedPassport, setSelectedPassport] = useState(passports[0]);

  return (
    <div className="passport-picker">
      <h1>Passport Picker</h1>
      <select
        className="passport-select"
        value={selectedPassport}
        onChange={(e) => setSelectedPassport(e.target.value)}
      >
        {passports.map((passport, index) => (
          <option key={index} value={passport}>
            {passport}
          </option>
        ))}
      </select>

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
