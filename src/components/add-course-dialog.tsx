import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiCombobox } from "@/components/multi-combobox";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export function AddCourseDialog() {
  const { courses, addCourse } = useEnrollmentStore();
  const [open, setOpen] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);

  const allInstructors = Array.from(
    new Set(courses.flatMap((c) => c.instructors ?? [])),
  ).sort();

  const normalizedCode = courseCode.trim().toUpperCase();
  const isDuplicate =
    normalizedCode !== "" &&
    courses.some((c) => c.courseCode === normalizedCode);

  const canSubmit = normalizedCode !== "" && courseTitle.trim() !== "" && !isDuplicate;

  const resetForm = () => {
    setCourseCode("");
    setCourseTitle("");
    setInstructors([]);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) resetForm();
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    addCourse(normalizedCode, courseTitle.trim(), instructors);
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
          <DialogDescription>
            วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="courseCode">รหัสวิชา</Label>
            <Input
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className={isDuplicate ? "border-destructive" : ""}
              placeholder="LIS236"
            />
            {isDuplicate && (
              <p className="text-sm text-destructive">
                มีรหัสวิชา {normalizedCode} นี้แล้ว
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="courseTitle">ชื่อวิชา</Label>
            <Input
              id="courseTitle"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="เช่น การแปลวรรณกรรม"
            />
          </div>

          <div className="grid gap-1.5">
            <Label>ผู้สอน</Label>
            <MultiCombobox
              options={allInstructors}
              selected={instructors}
              onChange={setInstructors}
              placeholder="เลือกหรือพิมพ์ชื่อผู้สอน"
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}