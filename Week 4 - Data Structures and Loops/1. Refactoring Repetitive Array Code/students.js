export function getFirstStudentSummary() {
  const student1Name = "Alice";
  const student1Grade = 85;
  const student1Subject = "Math";
  const student1Status = student1Grade >= 60 ? "PASS" : "FAIL";
  const student1Summary =
    student1Name +
    " scored " +
    student1Grade +
    " in " +
    student1Subject +
    " - " +
    student1Status;
  console.log(student1Summary);
}

export function getSecondStudentSummary() {
  const student2Name = "Bob";
  const student2Grade = 72;
  const student2Subject = "Science";
  const student2Status = student2Grade >= 60 ? "PASS" : "FAIL";
  const student2Summary =
    student2Name +
    " scored " +
    student2Grade +
    " in " +
    student2Subject +
    " - " +
    student2Status;
  console.log(student2Summary);
}

export function getThirdStudentSummary() {
  const student3Name = "Charlie";
  const student3Grade = 55;
  const student3Subject = "History";
  const student3Status = student3Grade >= 60 ? "PASS" : "FAIL";
  const student3Summary =
    student3Name +
    " scored " +
    student3Grade +
    " in " +
    student3Subject +
    " - " +
    student3Status;
  console.log(student3Summary);
}

export function logAllStudents() {
  getFirstStudentSummary();
  getSecondStudentSummary();
  getThirdStudentSummary();
}
