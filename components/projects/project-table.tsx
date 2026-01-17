"use client";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Project } from "@/lib/types";

const formatPeriod = (start: string, end: string) => {
  if (!start && !end) return "-";
  return `${start || "-"} 〜 ${end || "-"}`;
};

type ProjectTableProps = {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
};

export default function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>案件名</TableHead>
          <TableHead>期間</TableHead>
          <TableHead>規模</TableHead>
          <TableHead>役割</TableHead>
          <TableHead>主要技術</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>{formatPeriod(project.periodStart, project.periodEnd)}</TableCell>
            <TableCell>{project.scale}</TableCell>
            <TableCell>{project.role}</TableCell>
            <TableCell>{[...project.languages, ...project.tools].slice(0, 3).join(" / ")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(project)}>
                  編集
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(project)}>
                  削除
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
