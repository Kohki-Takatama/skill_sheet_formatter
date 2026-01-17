"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "@/components/tag-input";
import PhaseSelector from "@/components/phase-selector";
import { phaseOptions, projectScaleOptions, roles } from "@/lib/sample-data";
import type { Project } from "@/lib/types";

const emptyProject: Project = {
  id: "",
  title: "",
  periodStart: "",
  periodEnd: "",
  scale: "",
  role: "",
  phases: [],
  languages: [],
  tools: [],
  os: [],
  databases: []
};

type ProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (project: Project) => void;
  project?: Project;
};

export default function ProjectDialog({ open, onOpenChange, onSave, project }: ProjectDialogProps) {
  const [draft, setDraft] = React.useState<Project>(project ?? emptyProject);

  React.useEffect(() => {
    setDraft(project ?? emptyProject);
  }, [project]);

  const updateField = (field: keyof Project, value: Project[keyof Project]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const withId = draft.id ? draft : { ...draft, id: crypto.randomUUID() };
    onSave(withId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "案件を編集" : "案件を追加"}</DialogTitle>
          <DialogDescription>案件の情報を入力してください。</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>案件名</Label>
            <Input value={draft.title} onChange={(event) => updateField("title", event.target.value)} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>開始</Label>
              <Input type="date" value={draft.periodStart} onChange={(event) => updateField("periodStart", event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>終了</Label>
              <Input type="date" value={draft.periodEnd} onChange={(event) => updateField("periodEnd", event.target.value)} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>案件規模</Label>
              <Select value={draft.scale} onValueChange={(value) => updateField("scale", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="人数を選択" />
                </SelectTrigger>
                <SelectContent>
                  {projectScaleOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>自身の役割</Label>
              <Select value={draft.role} onValueChange={(value) => updateField("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="役割を選択" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>担当工程</Label>
            <PhaseSelector
              options={phaseOptions.map((option) => ({ value: option, label: option }))}
              values={draft.phases}
              onChange={(values) => updateField("phases", values)}
            />
          </div>

          <div className="space-y-2">
            <Label>使用言語</Label>
            <TagInput label="使用言語" values={draft.languages} onChange={(values) => updateField("languages", values)} />
          </div>

          <div className="space-y-2">
            <Label>使用ライブラリ・FW・ツール</Label>
            <TagInput label="使用ツール" values={draft.tools} onChange={(values) => updateField("tools", values)} />
          </div>

          <div className="space-y-2">
            <Label>使用サーバーOS</Label>
            <TagInput label="使用サーバーOS" values={draft.os} onChange={(values) => updateField("os", values)} />
          </div>

          <div className="space-y-2">
            <Label>使用DB</Label>
            <TagInput label="使用DB" values={draft.databases} onChange={(values) => updateField("databases", values)} />
          </div>

          <div className="space-y-2">
            <Label>技術要約</Label>
            <Textarea
              value={draft.tools.join(" / ")}
              readOnly
              className="bg-muted/40"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            キャンセル
          </Button>
          <Button type="button" onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
