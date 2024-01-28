"use client"

import React, { useEffect, useState } from 'react';
import Topbar from '../components/topbar';
import Bottombar from '../components/bottombar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faDownload, faCog, faBars, faSliders, faSearch } from '@fortawesome/free-solid-svg-icons';
import { TimetableEvent } from './timetableevent_type';
import { fetchDataFromFirebase } from '../../../firebase/firebaseConfig';
import { CourseListData } from './courselist_type';
import firebase from 'firebase/app';
import 'firebase/firestore';



const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']; // 월 ~ 금
const hoursOfDay = Array.from({ length: 13 }, (_, index) => index + 8); // 8시부터 20시까지

export default function TimeTable() {
  const [apiCourseData, setApiCourseData] = useState<CourseListData[]>([]);
  const [timetable, setTimetable] = useState<TimetableEvent[]>([]);
  const [eventIdCounter, setEventIdCounter] = useState<number>(1);
  const [newEvent, setNewEvent] = useState<TimetableEvent>({
    id: 0, // 각 시간표 이벤트의 고유 식별자
    day: 0, // 강의가 있는 요일(월:0, 화:1, 수:2....)
    startHour: 8, // 강의 시작 시간(24시간형식) 
    endHour: 9, // 강의 종료 시간(24시간형식)
    title: '', // 강의 제목
    room: '', // 강의실 이름
    color: '#FF5733', // 강의 이벤트 효과 색
  });
  const [isAddCourseModalOpen, setAddCourseModalOpen] = useState(false);

  const openModal = () => {
    setAddCourseModalOpen(true);
  }

  const closeModal = () => {
    setAddCourseModalOpen(false);
  }

  const addEvent = () => {
    if (newEvent.startHour < 8 || newEvent.endHour > 20) {
      alert('Lectures can only be added from 8:00 to 20:00.');
      return;
    }
    const overlappingEvent = timetable.find(
      (event) =>
        event.day === newEvent.day &&
        ((newEvent.startHour >= event.startHour && newEvent.startHour < event.endHour) ||
          (newEvent.endHour > event.startHour && newEvent.endHour <= event.endHour))
    );
    if (overlappingEvent) {
      alert('There is already a lecture at that time.');
      return;
    }
    const id = eventIdCounter;
    setTimetable([...timetable, { ...newEvent, id }]);
    setEventIdCounter(eventIdCounter + 1);
    setNewEvent({
      id: 0,
      day: 0,
      startHour: 8,
      endHour: 9,
      title: '',
      room: '',
      color: '#FF5733',
    });
  };

  // 강의 추가 함수
  const addCourseToTimetable = (selectedCourse: CourseListData) => {
    const overlappingEvent = timetable.find(
      (event) =>
        event.day === selectedCourse.days[0] &&
        ((parseInt(selectedCourse.startTime.toString().substring(0, 2)) >= event.startHour &&
          parseInt(selectedCourse.startTime.toString().substring(0, 2)) < event.endHour) ||
          (parseInt(selectedCourse.endTime.toString().substring(0, 2)) > event.startHour &&
          parseInt(selectedCourse.endTime.toString().substring(0, 2)) <= event.endHour))
    );
    if (overlappingEvent) {
      alert('There is already a lecture at that time.');
      return;
    }
  
    const id = eventIdCounter;
    const newEvent: TimetableEvent = {
      id,
      day: selectedCourse.days[0], // 요일 배열의 첫 번째 요소를 사용
      startHour: parseInt(selectedCourse.startTime.toString().substring(0, 2)), // 문자열로 변환 후 시간 부분 추출 후 정수로 변환
      endHour: parseInt(selectedCourse.endTime.toString().substring(0, 2)), // 문자열로 변환 후 시간 부분 추출 후 정수로 변환
      title: selectedCourse.course,
      room: selectedCourse.courseRoom,
      color: '#FF5733',
    };
  
    setTimetable([...timetable, newEvent]);
    setEventIdCounter(eventIdCounter + 1);
    closeModal();
  };
  
  
  function handleScroll() {
    console.log('스크롤 발생');
  };
  if(!firebase)
  // 강의 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // firebase에서 데이터를 가져오는 함수를 호출해서 데이터 받아옴
        const data = await fetchDataFromFirebase("courses/1112023/courseListData");
        setApiCourseData(data);
      } catch (error) {
        console.error("데이터 가져오기 오류:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      <Topbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* 시간표 edit Area */}
        <div className='basis-1/2 min-w-[300px] max-w-[600px] md:w-1/2 md:flex-shrink-0 flex flex-col overflow-hidden'>
          <div className="p-2 mt-4 flex flex-row">
            <form className='w-full flex items-center w-full h-full border-2'>
              <select style={{ cursor: 'pointer' }} className='w-full h-full p-2'>
                <option>mytimetable</option>
                <option>t</option>
                <option>t</option>
              </select>
            </form>
            <div className='ml-4'>
              {/* New TimeTable button */}
              <button className='bg-green-500 text-white rounded p-1 text-sm mr-4 h-8 w-full' onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} /> New TimeTable
              </button>
              {/* Add Courses button */}
              <button className='bg-blue-500 text-white rounded p-1 text-sm h-8 mt-1 w-full' onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} /> Add Courses Myself
              </button>
            </div>
          </div>

          {/* 현재 시간표 편집 div */}
          <div className='p-2'>
            <div className='border-2 p-4'>
              <div className='flex items-center'>
                <p className='p-4 text-xl font-bold'>My TimeTable</p>
                <span style={{ cursor: 'pointer' }} className='ml-80'><FontAwesomeIcon icon={faDownload} /></span>
                <span style={{ cursor: 'pointer' }} className='ml-12'><FontAwesomeIcon icon={faCog} /></span>
                <span style={{ cursor: 'pointer' }} className='ml-12'><FontAwesomeIcon icon={faBars} /></span>
              </div>
              <div className='p-4 flex items-center text-sm'>
                {/* 총 학점 */}
                <p>0 credits</p>
                {/* 만든 시간 */}
                <p className='ml-12'>Edited on 2023-XX-XX</p>
              </div>
            </div>

            {/* Course Search div */}
            <div className='mt-4 p-2 border-2 h-full'>
              <div className='p-2 w-full flex items-center'>
                <form className='w-full flex itmes-center'>
                  <input className='p-1 border-2 border-[#F3F4F6] w-full z-0 bg-[#F3F4F6] focus:bg-white' placeholder='Course Search' />
                  <FontAwesomeIcon className='p-1 z-10' icon={faSearch} />
                </form>
                {/* 돋보기 icon 추가할 것 */}
                <button className='ml-4 p-1 bg-main-color text-white w-24'>Filter <FontAwesomeIcon icon={faSliders} /></button>
              </div>

              {/* 데이터들 리스트로 UI 구현 */}
              <div className='mt-8 w-full scroll-smooth min-h-96' onScroll={handleScroll}>
                <ul>
                  {apiCourseData.map((item) => (
                    <li key={item.id} style={{ cursor: 'pointer' }} className="p-2 hover:bg-[#D9D9D9] border-t-2">
                      <div className='flex items-center'>
                        <p className="text-base font-bold">{item.course}</p>
                        <p className='ml-2 text-sm font-light'>{item.courseRoom}</p>
                      </div>
                      <p className="text-sm font-normal">{item.professorName}</p>
                      <div className='flex items-center text-sm mt-8'>
                        <p>{item.type}</p>
                        <p className='ml-8'>{item.grade}</p>
                        <p className='ml-8'>{item.startTime}~{item.endTime}</p>
                        <p className='ml-64'><span>{item.credits}</span> Credits</p>
                      </div>
                      <button className='bg-blue-500 text-white rounded p-1 mt-2' onClick={() => addCourseToTimetable(item)}>
                        Add to Timetable
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 시간표 추가 모달 */}
        {isAddCourseModalOpen && (
          <div className='fixed inset-0 flex items-center justify-center z-50'>
            <div className='modal-overlay fixed inset-0 bg-gray-800 opacity-50'></div>
            <div className='modal-content bg-white p-8 rounded-lg shadow-lg z-10'>
              <label className="text-sm font-semibold mb-2 block">Add Courses Myself</label>
              <select
                className="border rounded p-1 mr-2"
                value={newEvent.day}
                onChange={(e) => setNewEvent({ ...newEvent, day: parseInt(e.target.value) })}
              >
                {daysOfWeek.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
              <span className="mr-2">From</span>
              <input
                type="number"
                className="border rounded p-1 mr-2 w-16"
                value={newEvent.startHour}
                onChange={(e) => setNewEvent({ ...newEvent, startHour: parseInt(e.target.value) })}
              />
              <span className="mr-2">to</span>
              <input
                type="number"
                className="border rounded p-1 mr-2 w-16"
                value={newEvent.endHour}
                onChange={(e) => setNewEvent({ ...newEvent, endHour: parseInt(e.target.value) })}
              />
              <input
                type="text"
                className="border rounded p-1 mr-2 w-32"
                placeholder="Course Name"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
              <input
                type="text"
                className="border rounded p-1 mr-2 w-32"
                placeholder="Room"
                value={newEvent.room}
                onChange={(e) => setNewEvent({ ...newEvent, room: e.target.value })}
              />
              <input
                type="color"
                className="mr-2"
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
              />
              <button className="bg-blue-500 text-white rounded p-1" onClick={addEvent}>
                Add
              </button>
              <button className='modal-close bg-red-500 text-white ml-4 p-1 rounded' onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {/* 새로운 timetable 생성 모달 */}
        {/* 현재 timetable 설정 모달 */}
        {/* 필터 모달 */}
        {/* 시간표 UI */}
        <main className="bg-white p-8 rounded-lg shadow-lg flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th></th>
                {daysOfWeek.map((day, dayIndex) => (
                  <th key={dayIndex} className="min-w-[50px] text-center font-bold border p-2">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hoursOfDay.map((hour, hourIndex) => (
                <tr key={hourIndex}>
                  <td className="text-center font-bold border p-2">{`${hour}:00`}</td>
                  {daysOfWeek.map((day, dayIndex) => {
                    const cellId = `${dayIndex + 1}-${hourIndex + 1}`;
                    const eventsInCell = timetable.filter(
                      (event) => event.day === dayIndex && event.startHour <= hour && event.endHour > hour
                    );

                    return (
                      <td key={dayIndex} id={cellId} className="border p-2 min-w-[100px]" style={{ position: 'relative', width: '150px', height: '100px' }}>
                        {eventsInCell.map((event, index) => (
                          <div
                            key={index}
                            className="p-1"
                            style={{
                              backgroundColor: event.color,
                              position: 'absolute',
                              top: `${(event.startHour - hour) * 100}px`, // 시간 당 100px로 위치 조절 (예: 1시간당 100px)
                              height: `${(event.endHour - event.startHour) * 100}px`, // 시간 간격에 따라 높이 설정
                              left: 0,
                              right: 0,
                              color: '#ffffff', // 텍스트 컬러
                            }}
                          >
                            {event.title} ({event.room})
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <Bottombar />
    </div>
  );
};
