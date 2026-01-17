"use client";

import * as React from "react";
import { jsPDF } from "jspdf";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { loadProfile, loadProjects } from "@/lib/storage";
import type { Profile, Project } from "@/lib/types";

const MAX_SELECTION = 5;

const formatPeriod = (start: string, end: string) => {
  if (!start && !end) return "-";
  return `${start || "-"} 〜 ${end || "-"}`;
};

const calculateAge = (birthDate: string) => {
  if (!birthDate) return "-";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age.toString();
};

export default function OutputPage() {
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const loadedProfile = loadProfile();
    const loadedProjects = loadProjects().sort((a, b) => (b.periodStart || "").localeCompare(a.periodStart || ""));
    setProfile(loadedProfile);
    setProjects(loadedProjects);
    setSelectedIds(loadedProjects.slice(0, MAX_SELECTION).map((project) => project.id));
  }, []);

  const toggleProject = (projectId: string) => {
    if (selectedIds.includes(projectId)) {
      setSelectedIds(selectedIds.filter((id) => id !== projectId));
      return;
    }
    if (selectedIds.length >= MAX_SELECTION) {
      toast({ title: "最大5件まで選択できます", description: "選択数を減らしてから追加してください。" });
      return;
    }
    setSelectedIds([...selectedIds, projectId]);
  };

  const selectedProjects = projects.filter((project) => selectedIds.includes(project.id));

  const handleCopySkills = async () => {
    if (!profile) return;
    const lines = Object.entries(profile.skills).flatMap(([category, skills]) => {
      return [
        `【${category}】`,
        ...Object.entries(skills).map(([skill, rating]) => `${skill} - ${rating}`)
      ];
    });
    await navigator.clipboard.writeText(lines.join("\n"));
    toast({ title: "スキル一覧をコピーしました" });
  };

  const handleExportPdf = () => {
    if (!profile) return;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    let y = 15;

    doc.setFontSize(16);
    doc.text("スキルシート", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(`誕生年月日: ${profile.birthDate} (年齢: ${calculateAge(profile.birthDate)})`, 14, y);
    y += 6;
    doc.text(`性別: ${profile.gender}`, 14, y);
    y += 6;
    doc.text(`国籍: ${profile.nationality}`, 14, y);
    y += 6;
    doc.text(`最寄り駅: ${profile.nearestStation}`, 14, y);
    y += 6;
    doc.text(`最終学歴: ${profile.education}`, 14, y);
    y += 8;

    doc.setFontSize(12);
    doc.text("スキル要約", 14, y);
    y += 6;
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(profile.skillSummary || "-", 180);
    doc.text(summaryLines, 14, y);
    y += summaryLines.length * 5 + 4;

    doc.setFontSize(12);
    doc.text("スキル棚卸し", 14, y);
    y += 6;
    doc.setFontSize(10);
    Object.entries(profile.skills).forEach(([category, skills]) => {
      doc.text(`【${category}】`, 14, y);
      y += 5;
      Object.entries(skills).forEach(([skill, rating]) => {
        doc.text(`${skill}: ${rating}`, 18, y);
        y += 4.5;
        if (y > 270) {
          doc.addPage();
          y = 15;
        }
      });
      y += 3;
    });

    if (y > 250) {
      doc.addPage();
      y = 15;
    }
    doc.setFontSize(12);
    doc.text("案件履歴（選択分）", 14, y);
    y += 6;
    doc.setFontSize(10);
    selectedProjects.forEach((project) => {
      doc.text(`・${project.title}`, 14, y);
      y += 4.5;
      doc.text(`期間: ${formatPeriod(project.periodStart, project.periodEnd)}`, 18, y);
      y += 4.5;
      doc.text(`規模: ${project.scale} / 役割: ${project.role}`, 18, y);
      y += 4.5;
      doc.text(`工程: ${project.phases.join(" / ")}`, 18, y);
      y += 4.5;
      doc.text(`技術: ${[...project.languages, ...project.tools].join(" / ")}`, 18, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 15;
      }
    });

    doc.save("skill-sheet.pdf");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">出力センター</h2>
        <p className="text-sm text-muted-foreground">PDF出力やスキル一覧コピーを行います。</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>案件選択</CardTitle>
          <span className="text-sm text-muted-foreground">選択中 {selectedIds.length} / {MAX_SELECTION}</span>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">選択</TableHead>
                <TableHead>案件名</TableHead>
                <TableHead>期間</TableHead>
                <TableHead>役割</TableHead>
                <TableHead>技術</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>{formatPeriod(project.periodStart, project.periodEnd)}</TableCell>
                  <TableCell>{project.role}</TableCell>
                  <TableCell>{[...project.languages, ...project.tools].slice(0, 3).join(" / ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleExportPdf}>PDF出力（スキルシート）</Button>
        <Button variant="secondary" onClick={handleCopySkills}>
          スキル一覧をコピー
        </Button>
      </div>
    </div>
  );
}
