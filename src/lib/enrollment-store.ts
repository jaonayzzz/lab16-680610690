import { create } from "zustand";
import { persist } from "zustand/middleware";

import { students as initialStudents, courses as initialCourses } from "@/lib/mock-data";
import type { Course, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  enroll: (studentId: string, courseCode: string) => void;
  drop: (studentId: string, courseCode: string) => void;
  removeStudent: (studentId: string) => void;
  removeCourse: (courseCode: string) => void;
  removeInstructor: (courseCode: string, instructor: string) => void;
  addCourse: (courseCode: string, courseTitle: string, instructors: string[]) => void;
};

const STUDENT_ID = "680610690";

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,

      enroll: (studentId, courseCode) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === studentId && !s.enrolledCourses.includes(courseCode)
              ? { ...s, enrolledCourses: [...s.enrolledCourses, courseCode] }
              : s,
          ),
        })),

      drop: (studentId, courseCode) =>
        set((state) => ({
          students: state.students.map((s) =>
            s.studentId === studentId
              ? {
                  ...s,
                  enrolledCourses: s.enrolledCourses.filter((c) => c !== courseCode),
                }
              : s,
          ),
        })),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
        })),
        removeInstructor: (courseCode, instructor) =>
  set((state) => ({
    courses: state.courses.map((c) =>
      c.courseCode === courseCode
        ? {
            ...c,
            instructors: c.instructors?.filter((i) => i !== instructor),
          }
        : c,
    ),
  })),
  addCourse: (courseCode, courseTitle, instructors) =>
  set((state) => ({
    courses: [...state.courses, { courseCode, courseTitle, instructors }],
  })),

      removeCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseCode !== courseCode),
          // cascade: ลบ courseCode นี้ออกจาก enrolledCourses ของทุกคนด้วย
          students: state.students.map((s) => ({
            ...s,
            enrolledCourses: s.enrolledCourses.filter((c) => c !== courseCode),
          })),
        })),
    }),
    {
      name: `lab16-2569-${STUDENT_ID}`, // ← key ใน localStorage
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
  
);