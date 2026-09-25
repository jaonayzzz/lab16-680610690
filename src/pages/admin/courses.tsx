// src/routes/admin/courses.tsx (หรือ path ที่ตรงกับโครง route ของคุณ)
import { useState } from "react";
import { Trash2, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { AddCourseDialog } from "@/components/add-course-dialog";

export default function AdminCoursesPage() {
  const { courses, removeCourse, removeInstructor } = useEnrollmentStore();
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      removeCourse(courseToDelete);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
  <div>
    <h1 className="text-xl font-semibold">จัดการวิชาเรียน</h1>
    <p className="text-sm text-muted-foreground">
      {courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาที่หน้า
      "จัดการลงทะเบียน" ทันที
    </p>
  </div>
  <AddCourseDialog />
</div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่มีวิชาเรียนในระบบ
                </TableCell>
              </TableRow>
            )}
            {courses.map((c) => (
              <TableRow key={c.courseCode}>
                <TableCell>{c.courseCode}</TableCell>
                <TableCell>{c.courseTitle}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {!c.instructors || c.instructors.length === 0 ? (
                      <span className="text-sm text-muted-foreground">
                        ยังไม่มีผู้สอน
                      </span>
                    ) : (
                      c.instructors.map((instructor) => (
                        <Badge key={instructor} variant="secondary" className="gap-1">
                          {instructor}
                          <button
                            type="button"
                            onClick={() => removeInstructor(c.courseCode, instructor)}
                            className="rounded-full hover:bg-muted-foreground/20"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog
                    open={courseToDelete === c.courseCode}
                    onOpenChange={(open) => !open && setCourseToDelete(null)}
                  >
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCourseToDelete(c.courseCode)}
                        />
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบวิชา</AlertDialogTitle>
                        <AlertDialogDescription>
                          ต้องการลบวิชา {c.courseCode} — {c.courseTitle} ใช่หรือไม่?
                          การลบนี้จะเอาวิชานี้ออกจากรายการที่นักศึกษาลงทะเบียนไว้ด้วย
                          และไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                          ลบวิชา
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}