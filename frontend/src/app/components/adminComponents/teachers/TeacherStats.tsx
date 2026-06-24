// src/app/components/teachers/TeacherStats.tsx
import React from 'react';
import { TrendingUp, TrendingDown, Users, UserPlus, UserCheck, BarChart3, Activity } from 'lucide-react';

export interface TeacherStat {
  title: string;
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  subText?: string;
  chartData?: number[];
  icon?: React.ReactNode;
  type?: 'default' | 'gender' | 'status';
}

interface TeacherStatsProps {
  stats: TeacherStat[];
}

const TeacherStats: React.FC<TeacherStatsProps> = ({ stats }) => {
  // Map icons based on title
  const getIcon = (title: string) => {
    switch (title) {
      case 'Tổng giáo viên': return <Users className="w-5 h-5" />;
      case 'Mới trong tháng': return <UserPlus className="w-5 h-5" />;
      case 'Đang hoạt động': return <UserCheck className="w-5 h-5" />;
      case 'Phân bố giới tính': return <BarChart3 className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getColorClasses = (title: string) => {
    const colors: Record<string, { bg: string; text: string; gradient: string; iconBg: string; border: string }> = {
      'Tổng giáo viên': {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        gradient: 'from-indigo-400 via-purple-400 to-pink-400',
        iconBg: 'from-indigo-50 to-purple-50',
        border: 'border-indigo-100'
      },
      'Mới trong tháng': {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        gradient: 'from-emerald-400 to-teal-400',
        iconBg: 'from-emerald-50 to-teal-50',
        border: 'border-emerald-100'
      },
      'Đang hoạt động': {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        gradient: 'from-blue-400 to-cyan-400',
        iconBg: 'from-blue-50 to-cyan-50',
        border: 'border-blue-100'
      },
      'Phân bố giới tính': {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        gradient: 'from-purple-400 via-pink-400 to-rose-400',
        iconBg: 'from-purple-50 to-pink-50',
        border: 'border-purple-100'
      }
    };
    return colors[title] || colors['Tổng giáo viên'];
  };

  // Render Gender Card (giống hệt StudentStats)
  const renderGenderCard = (stat: TeacherStat) => {
    const colors = getColorClasses(stat.title);
    // Parse value like "45 | 59"
    const parts = typeof stat.value === 'string' ? stat.value.split(' | ') : ['0', '0'];
    const maleCount = parseInt(parts[0]) || 0;
    const femaleCount = parseInt(parts[1]) || 0;
    const total = maleCount + femaleCount;
    const malePercentage = total > 0 ? Math.round((maleCount / total) * 100) : 0;
    const femalePercentage = total > 0 ? Math.round((femaleCount / total) * 100) : 0;

    return (
      <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-start justify-between flex-1">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-600">Nam</span>
                <span className="text-base font-bold text-blue-600">{maleCount}</span>
              </div>
              <div className="w-px h-5 bg-gray-200"></div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-gray-600">Nữ</span>
                <span className="text-base font-bold text-pink-600">{femaleCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${malePercentage}%` }}></div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 mt-0.5">
              <Activity size={10} />
              <span>Tỷ lệ {malePercentage}% - {femalePercentage}%</span>
            </div>
          </div>
          <div className={`p-2 bg-gradient-to-br ${colors.iconBg} rounded-xl shadow-sm flex-shrink-0 ml-2`}>
            <BarChart3 className={`w-4 h-4 ${colors.text}`} />
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    );
  };

  // Render Status Card (Đang hoạt động)
  const renderStatusCard = (stat: TeacherStat) => {
    const colors = getColorClasses(stat.title);
    const percentage = stat.chartData && stat.chartData.length > 0 ? stat.chartData[0] : 0;

    return (
      <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex items-start justify-between flex-1">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            
            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full btn-gradient rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">{stat.subText || `${Math.round(percentage)}%`}</p>
            </div>
          </div>
          
          {/* Icon */}
          <div className={`p-2 bg-gradient-to-br ${colors.iconBg} rounded-xl shadow-sm flex-shrink-0 ml-2`}>
            <div className={colors.text}>{getIcon(stat.title)}</div>
          </div>
        </div>
        
        {/* Gradient underline on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    );
  };

  // Render Default Card
  const renderDefaultCard = (stat: TeacherStat) => {
    const colors = getColorClasses(stat.title);
    const trendValue = stat.trend || 0;
    const showTrend = stat.trend !== undefined && stat.trend !== null && stat.trend !== 0;

    return (
      <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full flex flex-col">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${
          stat.title === 'Tổng giáo viên' ? 'from-indigo-500/5 to-purple-500/5' : 'from-emerald-500/5 to-teal-500/5'
        } rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}></div>
        
        <div className="relative z-10 flex items-start justify-between flex-1">
          <div className="space-y-1 flex-1">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            {showTrend && (
              <div className={`flex items-center gap-1 text-[10px] ${trendValue >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {trendValue >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                <span>{Math.abs(trendValue)}% so với tháng trước</span>
              </div>
            )}
            {stat.subText && !showTrend && (
              <div className="text-[10px] text-gray-500">{stat.subText}</div>
            )}
          </div>
          
          {/* Icon */}
          <div className={`p-2 bg-gradient-to-br ${colors.iconBg} rounded-xl shadow-sm flex-shrink-0 ml-2`}>
            <div className={colors.text}>{getIcon(stat.title)}</div>
          </div>
        </div>
        
        {/* Gradient underline on hover */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      </div>
    );
  };

  // Determine which card type to render
  const renderCard = (stat: TeacherStat) => {
    if (stat.type === 'gender') {
      return renderGenderCard(stat);
    }
    if (stat.type === 'status') {
      return renderStatusCard(stat);
    }
    return renderDefaultCard(stat);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="h-full">
          {renderCard(stat)}
        </div>
      ))}
    </div>
  );
};

export default TeacherStats;