"use client";

import * as React from "react";

import ProjectDialog from "@/components/projects/project-dialog";
import ProjectTable from "@/components/projects/project-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { loadProjects, saveProjects } from "@/lib/storage";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingProject, setEditingProject] = React.useState<Project | undefined>(undefined);
  const { toast } = useToast();

  React.useEffect(() => {
    const loaded = loadProjects();
    setProjects(sortProjects(loaded));
  }, []);

  const sortProjects = (items: Project[]) => {
    return [...items].sort((a, b) => (b.periodStart || "").localeCompare(a.periodStart || ""));
  };

  const handleSave = (project: Project) => {
    setProjects((prev) => {
      const exists = prev.some((item) => item.id === project.id);
      const next = exists
        ? prev.map((item) => (item.id === project.id ? project : item))
        : [...prev, project];
      const sorted = sortProjects(next);
      saveProjects(sorted);
      return sorted;
    });
    setDialogOpen(false);
    setEditingProject(undefined);
    toast({ title: "案件を保存しました" });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    if (!confirm(`案件「${project.title}」を削除しますか？`)) return;
    const next = projects.filter((item) => item.id !== project.id);
    setProjects(next);
    saveProjects(next);
    toast({ title: "案件を削除しました" });
  };

  const openNewDialog = () => {
    setEditingProject(undefined);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">案件履歴</h2>
          <p className="text-sm text-muted-foreground">案件の追加・編集・削除を行います。</p>
        </div>
        <Button onClick={openNewDialog}>案件を追加</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>案件一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectTable projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        project={editingProject}
      />
    </div>
  );
}
