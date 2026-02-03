
import { useState } from 'react';
import { ClassDetail } from '../../components/adminComponents/class/ClassDetail';
import { ClassDashboard } from '../../components/adminComponents/class/ClassDashboard';
export interface Student {
    id: string;
    name: string;
    phone: string;
    parentPhone: string;
    grade: string;
    status: 'active' | 'inactive';
}

export interface Schedule {
    day: string;
    startTime: string;
    endTime: string;
}

export interface Class {
    id: string;
    name: string;
    subject: string;
    grade: string;
    teacher: string;
    teacherPhone: string;
    schedule: Schedule[];
    studentCount: number;
    maxStudents: number;
    startDate: string;
    fee: number;
    room: string;
    status: 'active' | 'upcoming' | 'completed';
    students?: Student[];
    imageUrl?: string;
}

export function ClassListPage() {
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
     return (
    <div className="min-h-screen bg-gray-50">
      {selectedClass ? (
        <ClassDetail 
          classData={selectedClass} 
          onBack={() => setSelectedClass(null)}
        />
      ) : (
        <ClassDashboard onSelectClass={setSelectedClass} />
      )}
    </div>
  );
}