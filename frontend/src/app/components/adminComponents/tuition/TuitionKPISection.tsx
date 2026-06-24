import React from 'react';
import { FileText, CheckCircle, Clock, TrendingUp, Users, DollarSign } from 'lucide-react';
import type { TuitionStats } from '../../../utils/types/tuition';

interface TuitionKPISectionProps {
  stats: TuitionStats;
  loading?: boolean;
}

const TuitionKPISection: React.FC<TuitionKPISectionProps> = ({ stats, loading }) => {
  const formatCurrency = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)}B`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)}M`;
    }
    return amount.toLocaleString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-24 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Card 1: Total Invoices */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            +{stats.revenueGrowth}%
          </span>
        </div>
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Tổng hóa đơn</p>
        <h3 className="text-xl font-bold font-headline mt-0.5 text-gray-900">
          {stats.totalInvoices.toLocaleString()}
        </h3>
      </div>

      {/* Card 2: Paid */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
            <CheckCircle className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {stats.paidPercentage}%
          </span>
        </div>
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Đã thanh toán</p>
        <h3 className="text-xl font-bold font-headline mt-0.5 text-gray-900">
          {stats.paidCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 3: Pending */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {stats.pendingPercentage}%
          </span>
        </div>
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Chờ thanh toán</p>
        <h3 className="text-xl font-bold font-headline mt-0.5 text-gray-900">
          {stats.pendingCount.toLocaleString()}
        </h3>
      </div>

      {/* Card 4: Students with Debt */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-300 group">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-red-50 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          {stats.totalDebtors > 0 && (
            <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              Cần thu hồi
            </span>
          )}
        </div>
        <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider">Học sinh đang nợ</p>
        <h3 className="text-xl font-bold font-headline mt-0.5 text-red-600">
          {stats.totalDebtors.toLocaleString()}
        </h3>
        <p className="text-[10px] text-gray-400 mt-1">
          Tổng nợ: {formatCurrency(stats.totalDebtAmount)} VNĐ
        </p>
      </div>

      {/* Card 5: Total Revenue */}
      <div className="btn-gradient from-indigo-600 to-indigo-700 p-4 rounded-xl shadow-lg shadow-indigo-200 group relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 bg-white/20 rounded-lg text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-indigo-200 text-[10px] font-semibold uppercase tracking-wider">Tổng doanh thu</p>
          <h3 className="text-xl font-bold font-headline mt-0.5 text-white">
            {formatCurrency(stats.totalRevenue)} <span className="text-xs font-normal text-indigo-200">VNĐ</span>
          </h3>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform">
          <TrendingUp className="w-24 h-24 text-white" />
        </div>
      </div>
    </div>
  );
};

export default TuitionKPISection;