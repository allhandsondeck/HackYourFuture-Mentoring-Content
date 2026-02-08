const students = [
  { name: "Alice", grade: 85, subject: "Math" },
  { name: "Bob", grade: 72, subject: "Science" },
  { name: "Charlie", grade: 55, subject: "History" },
];

function getStatus(grade) {
  return grade >= 60 ? "PASS" : "FAIL";
}

function getStudentSummary(name, grade, subject) {
  const status = getStatus(grade);
  const summary = `${name} scored ${grade} in ${subject} - ${status}`;
  console.log(summary);
}

export function logAllStudents() {
  for (const student of students) {
    const { name, grade, subject } = student; // { name: "Alice", grade: 85, subject: "Math" },
    getStudentSummary(name, grade, subject);
  }
}

logAllStudents();
