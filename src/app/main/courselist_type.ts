export interface CourseListData {
  id: number; // 각 강의의 인덱스 번호
  course: string; // 각 강의 제목
  professorName: string; // 각 강의 교수이름
  courseRoom: string; // 각 강의 강의실
  credits: number; // 각 강의 학점(1, 2, 3학점)
  startTime: number; // 각 강의 시작시간 
  endTime: number; // 각 강의 끝나는 시간
  type: string; // 해당 강의가 교양인지, 전공인지, 그 이외의 종류인지
  grade: number; // 몇학년이 들을 수 있는지, 전학년이면 null
}