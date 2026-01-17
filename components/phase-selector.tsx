"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export type PhaseOption = {
  value: string;
  label: string;
};

type PhaseSelectorProps = {
  options: PhaseOption[];
  values: string[];
  onChange: (values: string[]) => void;
};

export default function PhaseSelector({ options, values, onChange }: PhaseSelectorProps) {
  const toggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={values.includes(option.value)}
            onCheckedChange={() => toggle(option.value)}
          />
          <Label>{option.label}</Label>
        </label>
      ))}
    </div>
  );
}
