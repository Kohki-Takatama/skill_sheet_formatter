"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { loadProfile, saveProfile } from "@/lib/storage";
import { ratingOptions, skillCategories } from "@/lib/sample-data";
import type { Profile } from "@/lib/types";

const emptyProfile: Profile = {
  birthDate: "",
  gender: "",
  nationality: "",
  nearestStation: "",
  education: "",
  certifications: [],
  skillSummary: "",
  skills: {}
};

function calculateAge(birthDate: string) {
  if (!birthDate) return "-";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age.toString();
}

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<Profile>(emptyProfile);
  const [certInput, setCertInput] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const updateProfile = (field: keyof Profile, value: Profile[keyof Profile]) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateSkillRating = (category: string, skill: string, rating: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: {
          ...prev.skills[category],
          [skill]: rating as Profile["skills"][string][string]
        }
      }
    }));
  };

  const addCertification = () => {
    if (!certInput.trim()) return;
    updateProfile("certifications", [...profile.certifications, certInput.trim()]);
    setCertInput("");
  };

  const removeCertification = (index: number) => {
    updateProfile(
      "certifications",
      profile.certifications.filter((_, idx) => idx !== index)
    );
  };

  const handleSave = () => {
    saveProfile(profile);
    toast({ title: "プロフィールを保存しました" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">プロフィール</h2>
        <p className="text-sm text-muted-foreground">固定情報とスキルをまとめて更新できます。</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>固定情報</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>誕生年月日</Label>
              <Input
                type="date"
                value={profile.birthDate}
                onChange={(event) => updateProfile("birthDate", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>年齢</Label>
              <Input value={calculateAge(profile.birthDate)} readOnly />
            </div>
            <div className="space-y-2">
              <Label>性別</Label>
              <Input
                value={profile.gender}
                onChange={(event) => updateProfile("gender", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>国籍</Label>
              <Input
                value={profile.nationality}
                onChange={(event) => updateProfile("nationality", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>最寄り駅</Label>
              <Input
                value={profile.nearestStation}
                onChange={(event) => updateProfile("nearestStation", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>最終学歴</Label>
              <Input
                value={profile.education}
                onChange={(event) => updateProfile("education", event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>資格</Label>
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert, idx) => (
                <div key={`${cert}-${idx}`} className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1 text-sm">
                  <span>{cert}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => removeCertification(idx)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="資格名を入力"
                value={certInput}
                onChange={(event) => setCertInput(event.target.value)}
              />
              <Button type="button" variant="secondary" onClick={addCertification}>
                追加
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>スキル棚卸し</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillCategories.map((category) => (
            <div key={category.name} className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">{category.name}</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {category.items.map((skill) => (
                  <div key={skill} className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2">
                    <span className="text-sm font-medium">{skill}</span>
                    <Select
                      value={profile.skills?.[category.name]?.[skill] ?? "未設定"}
                      onValueChange={(value) => updateSkillRating(category.name, skill, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="評価" />
                      </SelectTrigger>
                      <SelectContent>
                        {ratingOptions.map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {rating}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>スキル要約</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={5}
            value={profile.skillSummary}
            onChange={(event) => updateProfile("skillSummary", event.target.value)}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>保存</Button>
      </div>
    </div>
  );
}
