"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TagInputProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
};

export default function TagInput({ label, values, onChange, placeholder }: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(values.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {values.map((tag, index) => (
          <span key={`${tag}-${index}`} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs">
            {tag}
            <button type="button" className="text-muted-foreground" onClick={() => removeTag(index)}>
              ✕
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder ?? label}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="button" variant="secondary" onClick={addTag}>
          追加
        </Button>
      </div>
    </div>
  );
}
