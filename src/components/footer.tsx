interface FooterProps {
  firstName: string;
  lastName: string;
  studentId: string;
}

export function Footer({ firstName, lastName, studentId }: FooterProps) {
  return (
    <p>
      จัดทำโดย {firstName} {lastName} — รหัสนักศึกษา {studentId}
    </p>
  );
}