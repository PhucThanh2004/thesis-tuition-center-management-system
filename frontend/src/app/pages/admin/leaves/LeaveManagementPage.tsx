'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { LeaveHeader } from '../../../components/adminComponents/leaves/LeaveHeader';
import { LeaveStats } from '../../../components/adminComponents/leaves/LeaveStats';
import { LeaveToolbar } from '../../../components/adminComponents/leaves/LeaveToolbar';
import { LeaveTable } from '../../../components/adminComponents/leaves/LeaveTable';
import { QuickActions } from '../../../components/adminComponents/leaves/QuickActions';
import { RecentActivities } from '../../../components/adminComponents/leaves/RecentActivities';
import { ProfileCard } from '../../../components/adminComponents/leaves/ProfileCard';
import { teacherLeaveApi } from '../../../utils/api/teacherLeave.api';
import type { TeacherLeave, TeacherLeaveApproveRequest } from '../../../utils/types/teacherLeave';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { LeaveApprovalModal } from '../../../components/adminComponents/leaves/LeaveApprovalModal';

interface LeaveStatItem {
  title: string;
  value: number;
  icon: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: 0.3 },
  },
};

const spinTransition = {
  repeat: Infinity,
  duration: 1,
  ease: "linear" as const,
};

export function LeaveManagementPage() {
  const { setAlert } = useOutletContext<any>();
  const [leaves, setLeaves] = useState<TeacherLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  const [selectedLeaveType, setSelectedLeaveType] = useState('Tất cả');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentViewMode, setCurrentViewMode] = useState<'list' | 'calendar'>('list');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 10 });
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<TeacherLeave | null>(null);
  const navigate = useNavigate();
  const [affectedSessions, setAffectedSessions] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  // Constants mapping
  const statusMap: Record<string, string> = {
    PENDING: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    CANCELLED: 'Đã hủy'
  };
  
  const reverseStatusMap: Record<string, string> = {
    'Tất cả': '',
    'Chờ duyệt': 'PENDING',
    'Đã duyệt': 'APPROVED',
    'Từ chối': 'REJECTED',
    'Đã hủy': 'CANCELLED'
  };

  const leaveTypeMap: Record<string, string> = {
    SICK: 'Nghỉ ốm',
    ANNUAL: 'Nghỉ phép năm',
    UNPAID: 'Nghỉ không lương',
    PERSONAL: 'Việc riêng',
    OTHER: 'Khác'
  };
  
  const reverseLeaveTypeMap: Record<string, string> = {
    'Tất cả': '',
    'Nghỉ ốm': 'SICK',
    'Nghỉ phép năm': 'ANNUAL',
    'Nghỉ không lương': 'UNPAID',
    'Việc riêng': 'PERSONAL',
    'Khác': 'OTHER'
  };

  // ✅ FIX: fetchLeaves - GỬI dateRange lên BE, KHÔNG filter frontend
  const fetchLeaves = useCallback(async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      // Build params để gửi lên BE
      const params: any = { page, size: pageSize };
      
      // Filter theo status (nếu có)
      if (selectedStatus && selectedStatus !== 'Tất cả') {
        params.status = reverseStatusMap[selectedStatus];
      }
      
      // Filter theo leave type (nếu có)
      if (selectedLeaveType && selectedLeaveType !== 'Tất cả') {
        const apiLeaveType = reverseLeaveTypeMap[selectedLeaveType];
        if (apiLeaveType) {
          params.leaveType = apiLeaveType;
        }
      }
      
      // ✅ QUAN TRỌNG: Gửi dateRange lên BE
      if (dateRange.from) {
        params.startDate = dateRange.from;
      }
      if (dateRange.to) {
        params.endDate = dateRange.to;
      }
      
      // Log để debug
      console.log('📤 Fetching leaves with params:', params);
      
      // Gọi API
      const { data, pagination: pag } = await teacherLeaveApi.getAll(params);
      
      console.log('📥 Received from API:', {
        totalItems: pag.totalItems,
        currentPage: pag.currentPage,
        dataCount: data.length
      });
      
      // ✅ KHÔNG filter frontend nữa - dữ liệu đã được lọc từ BE
      let filteredData = [...data];
      
      // CHỈ filter search ở frontend (vì BE không có search)
      if (searchQuery) {
        filteredData = filteredData.filter(l =>
          l.teacherName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setLeaves(filteredData);
      
      // ✅ Cập nhật pagination đúng từ BE
      // Lưu ý: totalItems là từ BE, nhưng nếu có search frontend thì totalItems sẽ sai
      // Giải pháp: Nếu có search, tính lại totalItems từ filteredData
      const finalTotalItems = searchQuery ? filteredData.length : pag.totalItems;
      
      setPagination({
        currentPage: pag.currentPage,
        totalPages: pag.totalPages,
        totalItems: finalTotalItems,
        pageSize,
      });
      
    } catch (error: any) {
      console.error('❌ Fetch error:', error);
      setAlert?.({ type: 'error', message: error.message || 'Không thể tải dữ liệu' });
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedStatus, selectedLeaveType, dateRange, setAlert, reverseStatusMap, reverseLeaveTypeMap]);

  // Hàm xóa tất cả filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('Tất cả');
    setSelectedLeaveType('Tất cả');
    setDateRange({ from: '', to: '' });
  };

  // ✅ useEffect chỉ fetch khi filters thay đổi
  useEffect(() => {
    // Reset về page 1 khi filter thay đổi
    fetchLeaves(1, pagination.pageSize);
  }, [searchQuery, selectedStatus, selectedLeaveType, dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageChange = (page: number) => {
    fetchLeaves(page, pagination.pageSize);
  };

  const handleApprove = async (id: number) => {
    try {
      setModalLoading(true);
      const leave = await teacherLeaveApi.getById(id);
      const sessions = leave.affectedSessions || [];

      setSelectedLeave(leave);
      const mappedSessions = sessions.map((s: any) => ({
        id: s.sessionId,
        sessionId: s.sessionId,
        sessionDate: s.sessionDate,
        startTime: s.startTime,
        endTime: s.endTime,
        subjectName: s.subjectName,
        subjectId: s.subjectId,
      }));
      setAffectedSessions(mappedSessions);
      setApprovalModalOpen(true);
    } catch (error: any) {
      setAlert?.({ type: 'error', message: error.response?.data?.message || 'Không thể tải thông tin đơn nghỉ' });
    } finally {
      setModalLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await teacherLeaveApi.approve(id, { action: 'REJECTED' });
      if (res.errCode === 0) {
        setAlert?.({ type: 'success', message: 'Đã từ chối đơn nghỉ' });
        fetchLeaves(pagination.currentPage, pagination.pageSize);
      } else {
        setAlert?.({ type: 'error', message: res.message || 'Từ chối thất bại' });
      }
    } catch (error: any) {
      setAlert?.({ type: 'error', message: error.response?.data?.message || 'Lỗi từ chối đơn' });
    }
  };

  const handleApprovalSubmit = async (options: {
    approvalType: 'full_leave' | 'flexible';
    replacements: Record<string, string>;
    cancelledSessions: string[];
    comment: string;
  }) => {
    if (!selectedLeave) return;
    setIsSubmitting(true);

    try {
      const cancelErrors: string[] = [];

      if (options.cancelledSessions.length > 0) {
        console.log('Cancelling sessions:', options.cancelledSessions);

        for (const sessionId of options.cancelledSessions) {
          try {
            const numSessionId = Number(sessionId);
            if (isNaN(numSessionId) || numSessionId <= 0) {
              console.error(`Invalid sessionId: ${sessionId}`);
              continue;
            }

            const cancelResult = await teacherLeaveApi.cancelAffectedSession(numSessionId);
            console.log(`Session ${sessionId} cancelled successfully:`, cancelResult);
          } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message;
            if (errorMsg.includes('không tìm thấy') || errorMsg.includes('not found')) {
              console.warn(`Session ${sessionId} already not exists, skipping...`);
            } else {
              console.error(`Failed to cancel session ${sessionId}:`, err);
              cancelErrors.push(`Buổi học ${sessionId}: ${errorMsg}`);
            }
          }
        }
      }

      let replacementsArray: { sessionId: number; replacementTeacherId: number }[] | undefined = undefined;

      if (options.approvalType === 'flexible') {
        const replacementsList = Object.entries(options.replacements)
          .filter(([, teacherId]) => teacherId && teacherId !== '')
          .map(([sessionId, teacherId]) => ({
            sessionId: Number(sessionId),
            replacementTeacherId: Number(teacherId),
          }));

        if (replacementsList.length > 0) {
          replacementsArray = replacementsList;
        }
      }

      let affectType: 'CANCEL' | 'REPLACE' = 'CANCEL';

      if (options.approvalType === 'full_leave') {
        affectType = 'CANCEL';
      } else if (options.approvalType === 'flexible') {
        if (replacementsArray && replacementsArray.length > 0) {
          affectType = 'REPLACE';
        } else {
          affectType = 'CANCEL';
        }
      }

      const payload: any = {
        action: 'APPROVED',
        affectType: affectType,
        comment: options.comment,
      };

      if (replacementsArray && replacementsArray.length > 0) {
        payload.replacements = replacementsArray;
      }

      console.log('Approving leave with payload:', payload);

      const approveRes = await teacherLeaveApi.approve(selectedLeave.id, payload);

      if (approveRes.errCode !== 0) throw new Error(approveRes.message);

      const replacedCount = replacementsArray?.length || 0;
      const cancelledCount = options.cancelledSessions.length;

      let successMessage = '';
      if (options.approvalType === 'full_leave') {
        successMessage = 'Đã duyệt đơn nghỉ và hủy tất cả các buổi học';
      } else if (options.approvalType === 'flexible') {
        if (replacedCount > 0 && cancelledCount > 0) {
          successMessage = `Đã duyệt đơn: ${replacedCount} buổi có GV thay thế, ${cancelledCount} buổi bị hủy`;
        } else if (replacedCount > 0) {
          successMessage = `Đã duyệt đơn và phân công GV thay thế cho ${replacedCount} buổi học`;
        } else {
          successMessage = `Đã duyệt đơn và hủy ${cancelledCount} buổi học`;
        }
      }

      if (cancelErrors.length > 0) {
        successMessage += `\n(Cảnh báo: ${cancelErrors.length} buổi không thể hủy)`;
      }

      setAlert?.({ type: 'success', message: successMessage });
      setApprovalModalOpen(false);
      await fetchLeaves(pagination.currentPage, pagination.pageSize);

    } catch (error: any) {
      console.error('Approval error:', error);
      setAlert?.({ type: 'error', message: error.message || 'Có lỗi xảy ra khi duyệt đơn' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateRequest = () => {
    setAlert?.({ type: 'info', message: 'Tính năng tạo đơn đang phát triển' });
  };

  const handleExport = () => {
    setAlert?.({ type: 'info', message: 'Tính năng xuất Excel đang phát triển' });
  };

  const handleViewDetail = async (id: number) => {
    navigate(`/admin/teacher/leave/${id}`);
  };

  // ✅ Tính stats dựa trên leaves hiện tại (đã được filter từ BE)
  const totalLeaves = leaves.length;
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  const approvedCount = leaves.filter(l => l.status === 'APPROVED').length;
  const rejectedCount = leaves.filter(l => l.status === 'REJECTED').length;
  
  const leaveStatsData: LeaveStatItem[] = [
    { title: 'Tổng đơn', value: totalLeaves, icon: 'dashboard' },
    { title: 'Chờ duyệt', value: pendingCount, icon: 'pending_actions' },
    { title: 'Đã duyệt', value: approvedCount, icon: 'check_circle' },
    { title: 'Từ chối', value: rejectedCount, icon: 'cancel' }
  ];

  const tableLeaves = leaves.map(leave => ({
    id: leave.id.toString(),
    teacherName: leave.teacherName,
    teacherCode: `GV${leave.teacherId}`,
    leaveType: (leaveTypeMap[leave.leaveType] || leave.leaveType) as any,
    startDate: leave.startDate,
    endDate: leave.endDate,
    days: Math.ceil((new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) / (1000 * 3600 * 24)) + 1,
    status: (statusMap[leave.status] || leave.status) as any,
    avatar: undefined,
    department: leave.teacherEmail,
    teacherId: leave.teacherId.toString(),
    createdAt: leave.createdAt,
    description: leave.reason || ''
  }));

  if (modalLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={spinTransition}
            className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-gray-500">Đang tải dữ liệu đơn nghỉ...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="flex">
        <motion.main
          variants={itemVariants}
          className="flex-1 overflow-y-auto px-8 py-10 space-y-8"
        >
          <motion.div variants={itemVariants}>
            <LeaveHeader onCreateRequest={handleCreateRequest} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LeaveStats stats={leaveStatsData} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <LeaveToolbar
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedLeaveType={selectedLeaveType}
              onLeaveTypeChange={setSelectedLeaveType}
              onClearFilters={handleClearFilters}
              onViewModeChange={setCurrentViewMode}
              currentViewMode={currentViewMode}
              statusOptions={['Tất cả', 'Chờ duyệt', 'Đã duyệt', 'Từ chối', 'Đã hủy']}
              leaveTypeOptions={['Tất cả', 'Nghỉ phép năm', 'Nghỉ ốm', 'Việc riêng', 'Nghỉ không lương', 'Khác']}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={spinTransition}
                    className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                  />
                  <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {tableLeaves.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl">
                      <p className="text-gray-500">Không có dữ liệu đơn nghỉ</p>
                    </div>
                  ) : (
                    <>
                      <LeaveTable
                        leaves={tableLeaves}
                        selectedIds={selectedIds.map(String)}
                        onSelectAll={(checked) => {
                          if (checked) setSelectedIds(leaves.map(l => l.id));
                          else setSelectedIds([]);
                        }}
                        onSelectRow={(id, checked) => {
                          const numId = parseInt(id);
                          if (checked) setSelectedIds([...selectedIds, numId]);
                          else setSelectedIds(selectedIds.filter(i => i !== numId));
                        }}
                        onApprove={(id) => handleApprove(parseInt(id))}
                        onReject={(id) => handleReject(parseInt(id))}
                        onViewDetail={(id) => handleViewDetail(Number(id))}
                      />

                      {pagination.totalPages > 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                          className="flex justify-center gap-2 mt-6"
                        >
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            ← Trước
                          </motion.button>
                          <motion.span
                            key={pagination.currentPage}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="px-4 py-2 text-gray-600 font-medium"
                          >
                            {pagination.currentPage} / {pagination.totalPages}
                          </motion.span>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Sau →
                          </motion.button>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.main>

        <motion.aside
          variants={slideInRight}
          className="w-80 bg-white border-l border-gray-200 p-6 space-y-6 hidden lg:block overflow-y-auto"
        >
          <QuickActions onQuickCreate={handleCreateRequest} onExport={handleExport} />
          <RecentActivities activities={[]} onViewAll={() => { }} />
          <ProfileCard userName="Admin Dashboard" userRole="Quản trị viên cấp cao" onLogout={() => { }} />
        </motion.aside>
      </div>

      <LeaveApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        leaveId={selectedLeave?.id ?? 0}
        teacherName={selectedLeave?.teacherName || ''}
        leaveDate={selectedLeave ? `${selectedLeave.startDate} - ${selectedLeave.endDate}` : ''}
        reason={selectedLeave?.reason || ''}
        affectedSessions={affectedSessions}
        onApprove={handleApprovalSubmit}
        onReject={() => {
          if (selectedLeave) {
            handleReject(selectedLeave.id);
          }
        }}
        isSubmitting={isSubmitting}
      />
    </motion.div>
  );
}