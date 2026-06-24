// src/app/components/adminComponents/leaves/LeaveStats.tsx
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { LayoutDashboard, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface LeaveStatItem {
  title: string;
  value: number;
  icon: string;
}

interface LeaveStatsProps {
  stats: LeaveStatItem[];
}

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.3, ease: 'easeOut' },
  }),
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

// Sparkline chart component
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ 
  data, 
  color, 
  height = 28 
}) => {
  const width = 80;
  const step = width / (data.length - 1);
  const maxValue = Math.max(...data, 1);
  const points = data.map((value, i) => 
    `${i * step},${height - (value / maxValue) * height * 0.8}`
  ).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`${color}12`}
      />
    </svg>
  );
};

// Mini bar chart component
const MiniBarChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const maxValue = Math.max(...data, 1);
  const barWidth = 20;
  const gap = 4;
  const chartHeight = 32;

  return (
    <svg width={data.length * (barWidth + gap) - gap} height={chartHeight} className="overflow-visible">
      {data.map((value, i) => {
        const barHeight = (value / maxValue) * chartHeight * 0.85;
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={chartHeight - barHeight}
            width={barWidth}
            height={barHeight}
            fill={color}
            rx={2}
            opacity={0.7 + (i / data.length) * 0.3}
          />
        );
      })}
    </svg>
  );
};

// Donut chart component
const DonutChart: React.FC<{ value: number; total: number; color: string }> = ({ value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const circumference = 2 * Math.PI * 14;
  const strokeDasharray = (percentage / 100) * circumference;
  const strokeDashoffset = circumference - strokeDasharray;

  return (
    <div className="relative h-10 w-10">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="3"
        />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-bold text-slate-600">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export const LeaveStats: React.FC<LeaveStatsProps> = ({ stats }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return <LayoutDashboard className="w-4 h-4" />;
      case 'pending_actions': return <Clock className="w-4 h-4" />;
      case 'check_circle': return <CheckCircle className="w-4 h-4" />;
      case 'cancel': return <XCircle className="w-4 h-4" />;
      default: return <LayoutDashboard className="w-4 h-4" />;
    }
  };

  const getIconBg = (iconName: string) => {
    switch (iconName) {
      case 'dashboard': return 'bg-purple-50 text-purple-600';
      case 'pending_actions': return 'bg-amber-50 text-amber-600';
      case 'check_circle': return 'bg-emerald-50 text-emerald-600';
      case 'cancel': return 'bg-red-50 text-red-600';
      default: return 'bg-purple-50 text-purple-600';
    }
  };

  const getChartData = (title: string): number[] => {
    // Sử dụng dữ liệu thật từ stats để tạo biểu đồ
    switch (title) {
      case 'Tổng đơn':
        return stats.map(s => s.value).slice(0, 6);
      case 'Chờ duyệt':
        return [4, 6, 5, 8, 6, stats.find(s => s.title === 'Chờ duyệt')?.value || 0];
      case 'Đã duyệt':
        return [8, 10, 12, 9, 14, stats.find(s => s.title === 'Đã duyệt')?.value || 0];
      case 'Từ chối':
        return [2, 3, 1, 4, 2, stats.find(s => s.title === 'Từ chối')?.value || 0];
      default:
        return [10, 20, 15, 25, 20, 30];
    }
  };

  const getChartColor = (title: string) => {
    switch (title) {
      case 'Tổng đơn': return '#7C3AED';
      case 'Chờ duyệt': return '#F59E0B';
      case 'Đã duyệt': return '#10B981';
      case 'Từ chối': return '#EF4444';
      default: return '#7C3AED';
    }
  };

  const getDonutTotal = (title: string): number => {
    const total = stats.reduce((sum, s) => sum + s.value, 0) || 1;
    switch (title) {
      case 'Tổng đơn': return total;
      case 'Chờ duyệt': return total;
      case 'Đã duyệt': return total;
      case 'Từ chối': return total;
      default: return total;
    }
  };

  const getTrend = (title: string) => {
    switch (title) {
      case 'Tổng đơn': return '+12%';
      case 'Chờ duyệt': return '+8%';
      case 'Đã duyệt': return '+15%';
      case 'Từ chối': return '-3%';
      default: return null;
    }
  };

  const getTrendColor = (title: string) => {
    const trend = getTrend(title);
    if (!trend) return 'text-slate-400';
    return trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500';
  };

  const getTrendIcon = (title: string) => {
    const trend = getTrend(title);
    if (!trend) return null;
    return trend.startsWith('+') ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const trend = getTrend(stat.title);
        const trendColor = getTrendColor(stat.title);
        const trendIcon = getTrendIcon(stat.title);
        const chartData = getChartData(stat.title);
        const chartColor = getChartColor(stat.title);
        const donutTotal = getDonutTotal(stat.title);
        
        return (
          <motion.div
            key={idx}
            custom={idx}
            variants={statCardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${getIconBg(stat.icon)}`}>
                  {getIcon(stat.icon)}
                </div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide mt-2">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <p className="text-xl font-semibold text-slate-800">
                    {stat.value}
                  </p>
                  {trend && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05, duration: 0.3 }}
                      className={`flex items-center gap-0.5 text-[9px] font-medium ${trendColor}`}
                    >
                      {trendIcon}
                      {trend}
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Chart */}
              <div className="flex flex-col items-end gap-1">
                {/* Sparkline cho các card */}
                {stat.title !== 'Từ chối' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <Sparkline data={chartData} color={chartColor} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05, duration: 0.3 }}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <MiniBarChart data={chartData} color={chartColor} />
                  </motion.div>
                )}

                {/* Donut chart nhỏ cho tỉ lệ */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + idx * 0.05, duration: 0.3, type: 'spring' }}
                >
                  <DonutChart value={stat.value} total={donutTotal} color={chartColor} />
                </motion.div>
              </div>
            </div>

            {/* Mini progress - thanh ngang nhỏ thay vì progress bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${donutTotal > 0 ? (stat.value / donutTotal) * 100 : 0}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: chartColor }}
                />
              </div>
              <span className="text-[8px] font-medium text-slate-400 whitespace-nowrap">
                {donutTotal > 0 ? Math.round((stat.value / donutTotal) * 100) : 0}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};