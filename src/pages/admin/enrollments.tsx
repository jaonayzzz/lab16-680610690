import { useState } from "react";
import { PlusCircle } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { MultiCombobox, type ComboboxOption } from "@/components/multi-combobox";

type Option = { value: string; label: string };

function OptionSelect({
  id,
  options,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(v) => onChange(v as string)}
    >
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function AdminEnrollmentsPage() {
  const { students, courses, enroll } = useEnrollmentStore();

  const [formStudents, setFormStudents] = useState<string[]>([]);
  const [formCourse, setFormCourse] = useState<string | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [mode, setMode] = useState<"course" | "student">("course");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");

  const studentOptions: Option[] = students.map((s) => ({
    value: s.studentId,
    label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
  }));
  const courseOptions: Option[] = courses.map((c) => ({
    value: c.courseCode,
    label: `${c.courseCode} — ${c.courseTitle}`,
  }));

    const availableStudents: ComboboxOption[] = formCourse
    ? students
        .filter((s) => !s.enrolledCourses.includes(formCourse))
        .map((s) => ({
          value: s.studentId,
          label: `${s.studentId} — ${s.firstName} ${s.lastName}`,
          badgeLabel: `${s.firstName} ${s.lastName}`, // badge โชว์แค่ชื่อ
        }))
    : [];
  // วิชาที่นักศึกษาที่เลือกยังไม่ได้ลงทะเบียน
  {/*const selectedStudent = students.find((s) => s.studentId === formStudent);

  const availableCourseOptions = courseOptions.filter(
    (c) => !selectedStudent?.enrolledCourses.includes(c.value)
  );*/}

  const handleEnroll = () => {
    if (!formCourse || formStudents.length === 0) return;
    formStudents.forEach((studentId) => enroll(studentId, formCourse));
    setEnrollDialogOpen(false);
  };

  const handleEnrollDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setFormCourse(null);
      setFormStudents([]);
    }
  };

  const handleCourseChange = (v: string) => {
    setFormCourse(v);
    setFormStudents([]);
  };


  const enrollmentRows = students.flatMap((s) =>
  s.enrolledCourses.map((courseCode) => ({
    studentId: s.studentId,
    courseCode,
  }))
);

const rows = enrollmentRows.filter((e) =>
  mode === "course"
    ? filterCourse === "all" || e.courseCode === filterCourse
    : filterStudent === "all" || e.studentId === filterStudent
);

  const nameOf = (studentId: string) => {
    const s = students.find((x) => x.studentId === studentId);
    return s ? `${s.firstName} ${s.lastName}` : "-";
  };
  const titleOf = (courseId: string) =>
    courses.find((c) => c.courseCode === courseId)?.courseTitle ?? "-";
  const countOf = (courseCode: string) =>
  enrollmentRows.filter((e) => e.courseCode === courseCode).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">จัดการการลงทะเบียน</h1>
        <p className="text-sm text-muted-foreground">
          Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
        </p>
      </div>

      <Dialog open={enrollDialogOpen} onOpenChange={handleEnrollDialogOpenChange}>
  <DialogTrigger render={<Button />}>
    <PlusCircle className="h-4 w-4" />
    ลงทะเบียนให้นักศึกษา
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
      <DialogDescription>
        เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน)
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="formCourse">วิชา</Label>
        <OptionSelect
          id="formCourse"
          options={courseOptions}
          value={formCourse}
          placeholder="เลือกวิชา"
          onChange={handleCourseChange}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="formStudents">นักศึกษา</Label>
        <MultiCombobox
          options={availableStudents}
          selected={formStudents}
          onChange={setFormStudents}
          disabled={!formCourse}
          disabledPlaceholder="เลือกวิชาก่อน"
          placeholder="เลือกนักศึกษา"
          allowCustom={false} // ห้ามพิมพ์เพิ่มชื่อใหม่ — เลือกจากรายชื่อที่มีเท่านั้น
        />
      </div>
    </div>
    <DialogFooter>
      <Button
        disabled={!formCourse || formStudents.length === 0}
        onClick={handleEnroll}
      >
        <PlusCircle className="h-4 w-4" />
        ลงทะเบียน
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      <Tabs
        value={mode}
        onValueChange={(v) => setMode(v as "course" | "student")}
      >
        <TabsList>
          <TabsTrigger value="course">ค้นหาตามวิชา</TabsTrigger>
          <TabsTrigger value="student">ค้นหาตามนักศึกษา</TabsTrigger>
        </TabsList>
        <TabsContent value="course" className="pt-2">
          <OptionSelect
            id="filterCourse"
            options={[{ value: "all", label: "ทุกวิชา" }, ...courseOptions]}
            value={filterCourse}
            onChange={setFilterCourse}
          />
        </TabsContent>
        <TabsContent value="student" className="pt-2">
          <OptionSelect
            id="filterStudent"
            options={[{ value: "all", label: "ทุกคน" }, ...studentOptions]}
            value={filterStudent}
            onChange={setFilterStudent}
          />
        </TabsContent>
      </Tabs>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              
              <TableHead>รหัสวิชา</TableHead>
              <TableHead>ชื่อวิชา</TableHead>
              <TableHead>จำนวนผู้ลงทะเบียน</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-20 text-center text-muted-foreground"
                >
                  ไม่พบข้อมูลการลงทะเบียน
                </TableCell>
              </TableRow>
            )}
            {rows.map((e) => (
              <TableRow key={`${e.studentId}-${e.courseCode}`}>
                
                <TableCell>{e.courseCode}</TableCell>
                <TableCell>
                  {titleOf(e.courseCode)}</TableCell>
                <TableCell>{countOf(e.courseCode)}</TableCell>
                <TableCell>{nameOf(e.studentId)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
