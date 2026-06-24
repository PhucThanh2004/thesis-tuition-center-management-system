// src/app/pages/admin/TuitionPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import TuitionHeader from '../../components/adminComponents/tuition/TuitionHeader';
import TuitionKPISection from '../../components/adminComponents/tuition/TuitionKPISection';
import TuitionToolbar from '../../components/adminComponents/tuition/TuitionToolbar';
import AIInsightCard from '../../components/adminComponents/tuition/AIInsightCard';
import TuitionTable from '../../components/adminComponents/tuition/TuitionTable';
import type { TuitionCalculationDTO, TuitionStats, TopDebtStudent, TuitionFilterParams } from '../../utils/types/tuition';
import { tuitionApi } from '../../utils/api/tuition.api';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const TuitionPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-3.5 w-80 bg-gray-200 rounded-lg mt-1.5 animate-pulse" />
      </div>
      
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-lg bg-white border border-gray-100 shadow-sm p-4">
            <div className="h-3.5 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* AI Insight Skeleton */}
      <div className="rounded-lg bg-white border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-6 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-1.5 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Toolbar Skeleton */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      {/* Table Skeleton */}
      <div className="rounded-lg bg-white border border-gray-100 shadow-sm p-4 min-h-[400px]">
        <div className="space-y-2.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const TuitionPage: React.FC = () => {
  const { setAlert } = useOutletContext<any>();
  const [invoices, setInvoices] = useState<TuitionCalculationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<TuitionStats>({
    totalInvoices: 0,
    paidCount: 0,
    paidPercentage: 0,
    pendingCount: 0,
    pendingPercentage: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    debtRecoveryRate: 0,
    riskLevel: 'LOW',
    overdueCount: 0,
    totalDebtors: 0,
    totalDebtAmount: 0
  });
  const [topDebtors, setTopDebtors] = useState<TopDebtStudent[]>([]);
  const [forecastRevenue, setForecastRevenue] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const monthOptions = [
    { value: 1, label: 'Tháng 1' }, { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' }, { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' }, { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' }, { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' }, { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' }, { value: 12, label: 'Tháng 12' }
  ];
  const generateYearOptions = (): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };
  const yearOptions = generateYearOptions().sort((a, b) => b - a);
  const gradeOptions = [
    { value: '', label: 'Tất cả các khối' },
    { value: '6', label: 'Khối 6' },
    { value: '7', label: 'Khối 7' },
    { value: '8', label: 'Khối 8' },
    { value: '9', label: 'Khối 9' },
    { value: '10', label: 'Khối 10' },
    { value: '11', label: 'Khối 11' },
    { value: '12', label: 'Khối 12' }
  ];
  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'WAITING_PAYMENT', label: 'Chờ thanh toán' },
    { value: 'PARTIAL_PAID', label: 'Đã thanh toán một phần' },
    { value: 'PAID', label: 'Đã thanh toán' }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: TuitionFilterParams = {
        month: selectedMonth,
        year: selectedYear,
        name: searchTerm || undefined,
        grade: selectedGrade || undefined,
        status: selectedStatus as any || undefined
      };

      const [invoicesData, statsData, topDebtorsData, debtCountData] = await Promise.all([
        tuitionApi.getTuitionList(params),
        tuitionApi.getStats(selectedMonth, selectedYear),
        tuitionApi.getTopDebtors(selectedMonth, selectedYear, 5),
        tuitionApi.countStudentsWithDebt(selectedMonth, selectedYear)
      ]);

      setInvoices(invoicesData);
      setStats({
        ...statsData,
        totalDebtors: debtCountData.totalDebtors,
        totalDebtAmount: debtCountData.totalDebtAmount
      });
      setTopDebtors(topDebtorsData);
      setForecastRevenue(Math.round(statsData.totalRevenue * 1.2));

    } catch (error) {
      console.error('Failed to fetch data:', error);
      setAlert?.({
        type: 'error',
        message: (error as any)?.response?.data?.message || (error as any)?.message || 'Không thể tải dữ liệu học phí'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, searchTerm, selectedGrade, selectedStatus, setAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleCreateInvoice = async () => {
    try {
      setLoading(true);

      const exists = await tuitionApi.checkTuitionExists(selectedMonth, selectedYear);

      if (exists) {
        setAlert?.({
          type: 'warning',
          message: `Học phí tháng ${selectedMonth}/${selectedYear} đã được tạo trước đó.`
        });
        setLoading(false);
        return;
      }

      await tuitionApi.createTuitions(selectedMonth, selectedYear);
      setAlert?.({
        type: 'success',
        message: `Tạo hóa đơn học phí tháng ${selectedMonth}/${selectedYear} thành công!`
      });
      setRefreshTrigger(prev => prev + 1);

    } catch (error) {
      console.error('Failed to create invoices:', error);
      const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || '';

      if (errorMessage.includes('already') || errorMessage.includes('đã tồn tại') || errorMessage.includes('duplicate')) {
        setAlert?.({
          type: 'warning',
          message: `Học phí tháng ${selectedMonth}/${selectedYear} đã được tạo trước đó.`
        });
      } else {
        setAlert?.({
          type: 'error',
          message: errorMessage || 'Không thể tạo hóa đơn'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (tuitionId: number) => {
    const studentId = invoices.find(i => i.tuitionId === tuitionId)?.studentId;
    if (studentId) {
      window.location.href = `/admin/tuition/${studentId}?month=${selectedMonth}&year=${selectedYear}`;
    } else {
      setAlert?.({ type: 'info', message: `Đang phát triển xem chi tiết #${tuitionId}` });
    }
  };

  const handleEdit = async (tuitionId: number) => {
    setAlert?.({ type: 'info', message: `Đang phát triển chỉnh sửa #${tuitionId}` });
  };

  const handlePayment = async (tuitionId: number) => {
    setAlert?.({ type: 'info', message: `Đang phát triển thanh toán #${tuitionId}` });
  };

  const handleCreateFirst = () => handleCreateInvoice();
  const handleFilterClick = () => setShowFilters(!showFilters);
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedStatus('');
    setShowFilters(false);
  };

  if (loading && !stats.totalInvoices && invoices.length === 0) {
    return <TuitionPageSkeleton />;
  }

  return (
    <ProtectedRoute allowedRoles={['R0']}>
      <main className="min-h-screen bg-gray-50">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* 1. Header */}
            <motion.div variants={{ hidden: { opacity: 0, y: -8 }, visible: { opacity: 1, y: 0 } }}>
              <TuitionHeader
                onCreateInvoice={handleCreateInvoice}
                currentMonth={selectedMonth}
                currentYear={selectedYear}
              />
            </motion.div>

            {/* 2. Stats Cards */}
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
              <TuitionKPISection stats={stats} loading={loading} />
            </motion.div>

            {/* 3. AI Insight Card */}
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
              <AIInsightCard
                forecastRevenue={forecastRevenue}
                debtRecoveryRate={stats.debtRecoveryRate}
                riskLevel={stats.riskLevel}
                overdueCount={stats.overdueCount}
                topDebtors={topDebtors}
              />
            </motion.div>

            {/* 4. Toolbar */}
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
              <TuitionToolbar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                selectedGrade={selectedGrade}
                onGradeChange={setSelectedGrade}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                monthOptions={monthOptions}
                yearOptions={yearOptions}
                gradeOptions={gradeOptions}
                statusOptions={statusOptions}
                onFilterClick={handleFilterClick}
                showFilters={showFilters}
                onClearFilters={handleClearFilters}
              />
            </motion.div>

            {/* 5. Main Table */}
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}>
              <TuitionTable
                invoices={invoices}
                loading={loading}
                onView={handleViewDetail}
                onEdit={handleEdit}
                onPayment={handlePayment}
                onCreateFirst={handleCreateFirst}
                month={selectedMonth}
                year={selectedYear}
              />
            </motion.div>

            {/* Refresh Indicator */}
            {refreshTrigger > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="fixed bottom-6 right-6 z-50"
              >
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg shadow-gray-200/50">
                  <RefreshCw className="h-3 w-3 text-indigo-500 animate-spin" style={{ animationDuration: '0.6s' }} />
                  <span className="text-[10px] text-slate-600">Đã cập nhật</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default TuitionPage;