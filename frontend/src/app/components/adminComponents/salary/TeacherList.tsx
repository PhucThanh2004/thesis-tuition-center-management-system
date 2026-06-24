// src/app/components/salary/TeacherList.tsx
import React from 'react';
import { User, ChevronRight, ExternalLink, FileText } from 'lucide-react';

interface TeacherListProps {
  teacher: {
    teacherId: number;
    teacherName: string;
    teacherAvatar?: string;
    agreements: any[];
  };
  isSelected: boolean;
  onSelect: (teacherId: number) => void;
  onTeacherClick: (teacherId: number) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({ 
  teacher, 
  isSelected, 
  onSelect,
  onTeacherClick 
}) => {
  return (
    <div 
      className={`group transition-all duration-200 ${
        isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
      }`}
    >
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${
          isSelected ? 'border-r-4 border-blue-500' : ''
        }`}
        onClick={() => onSelect(teacher.teacherId)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 flex-shrink-0 shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-800 truncate text-sm">
              {teacher.teacherName}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <FileText className="w-3 h-3" />
              <span>{teacher.agreements.length} thỏa thuận</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-blue-50 text-blue-600'
          }`}>
            {teacher.agreements.length}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTeacherClick(teacher.teacherId);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100"
            title="Xem chi tiết giáo viên"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          
          <ChevronRight className={`w-4 h-4 transition-all duration-200 ${
            isSelected 
              ? 'rotate-90 text-blue-500' 
              : 'text-gray-300 group-hover:text-gray-500'
          }`} />
        </div>
      </div>
    </div>
  );
};