

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarX, Plus, Sparkles, FileText, Users } from 'lucide-react';
import { TeacherLeaveHeader } from '../../components/adminComponents/leaves/teacher/TeacherLeaveHeader';
import { TeacherLeaveStats } from '../../components/adminComponents/leaves/teacher/TeacherLeaveStats';
import { SubstituteStats } from '../../components/adminComponents/leaves/teacher/SubstituteStats';
import { TeacherLeaveToolbar } from '../../components/adminComponents/leaves/teacher/TeacherLeaveToolbar';
import { TeacherLeaveTableRow } from '../../components/adminComponents/leaves/teacher/TeacherLeaveTableRow';
import { SubstituteRequestCard, EmptySubstituteRequests } from '../../components/adminComponents/leaves/teacher/SubstituteRequestCard';
import { CreateLeaveModal } from '../../components/adminComponents/leaves/teacher/CreateLeaveModal';
import { LeaveDetailModal } from '../../components/adminComponents/leaves/teacher/LeaveDetailModal';
import { ConfirmSubstituteModal } from '../../components/adminComponents/leaves/teacher/ConfirmSubstituteModal';
import { useTeacherLeave } from '../../hooks/teacher/useTeacherLeave';
import { teacherLeaveApi } from '../../utils/api/teacherLeave.api';
import type { TeacherLeave, ReplacementSession } from '../../utils/types/teacherLeave';

type TabType = 'my-leaves' | 'substitute-requests';

export const TeacherLeaveManagementPage = () => {
  const {
    leaves,
    loading: leavesLoading,
    pagination,
    pendingCount,
    previewSessions,
    previewLoading,
    fetchLeaves,
    createLeave,
    cancelLeave,
    previewAffectedSessions,
    getLeaveDetail,
  } = useTeacherLeave();

  // State cho dạy thay - SỬ DỤNG API MỚI
  const [substituteRequests, setSubstituteRequests] = useState<ReplacementSession[]>([]);
  const [substituteLoading, setSubstituteLoading] = useState(false);
  const [substitutePendingCount, setSubstitutePendingCount] = useState(0);
  const [substituteAcceptedCount, setSubstituteAcceptedCount] = useState(0);

  // State chung
  const [activeTab, setActiveTab] = useState<TabType>('my-leaves');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedLeaveDetail, setSelectedLeaveDetail] = useState<TeacherLeave | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedSubstitute, setSelectedSubstitute] = useState<ReplacementSession | null>(null);
  const [confirmAction, setConfirmAction] = useState<'accept' | 'reject'>('accept');
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Tính toán thống kê đơn nghỉ
  const totalLeaves = leaves.length;
  const totalPending = leaves.filter(l => l.status === 'PENDING').length;
  const totalApproved = leaves.filter(l => l.status === 'APPROVED').length;
  const totalAffectedSessions = leaves.reduce((sum, l) => sum + (l.affectedSessions?.length || 0), 0);

  // Lấy danh sách yêu cầu dạy thay - SỬ DỤNG API getReplacementSessions
  const fetchSubstituteRequests = useCallback(async () => {
    setSubstituteLoading(true);

    try {
      console.log('Fetching replacement sessions from API...');
      const sessions = await teacherLeaveApi.getReplacementSessions();
      console.log('Replacement sessions received:', sessions);

      // Đếm số lượng theo status
      const pending = sessions.filter(s => s.status === 'PENDING').length;
      const accepted = sessions.filter(s => s.status === 'ACCEPTED').length;

      setSubstituteRequests(sessions);
      setSubstitutePendingCount(pending);
      setSubstituteAcceptedCount(accepted);
    } catch (error) {
      console.error('Fetch replacement sessions error:', error);
      setSubstituteRequests([]);
      setSubstitutePendingCount(0);
      setSubstituteAcceptedCount(0);
    } finally {
      setSubstituteLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'substitute-requests') {
      fetchSubstituteRequests();
    }
  }, [activeTab, fetchSubstituteRequests]);

  // Handlers
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    fetchLeaves(1, statusFilter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    fetchLeaves(1, status);
  };

  const handleViewDetail = async (id: number) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const detail = await getLeaveDetail(id);
      setSelectedLeaveDetail(detail);
    } catch (error) {
      console.error('Get detail error:', error);
      setSelectedLeaveDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn nghỉ này không?')) {
      await cancelLeave(id);
    }
  };

  const handleCreateLeave = async (data: any) => {
    await createLeave(data);
  };

  const handlePreviewSessions = async (data: any) => {
    return await previewAffectedSessions(data);
  };
  // Handlers cho dạy thay
  const handleAcceptSubstitute = (affectedSessionId: number) => {
    console.log('Accept clicked with affectedSessionId:', affectedSessionId);
    const request = substituteRequests.find(r => {
      const id = r.affectedSessionId || r.id;
      return id === affectedSessionId;
    });
    if (request) {
      setSelectedSubstitute(request);
      setConfirmAction('accept');
      setIsConfirmModalOpen(true);
    } else {
      console.error('Request not found for affectedSessionId:', affectedSessionId);
    }
  };

  const handleRejectSubstitute = (affectedSessionId: number) => {
    console.log('Reject clicked with affectedSessionId:', affectedSessionId);
    const request = substituteRequests.find(r => {
      const id = r.affectedSessionId || r.id;
      return id === affectedSessionId;
    });
    if (request) {
      setSelectedSubstitute(request);
      setConfirmAction('reject');
      setIsConfirmModalOpen(true);
    } else {
      console.error('Request not found for affectedSessionId:', affectedSessionId);
    }
  };

  const handleConfirmSubstitute = async () => {
    if (!selectedSubstitute) {
      console.error('No selected substitute');
      return;
    }

    // Lấy affectedSessionId từ selectedSubstitute
    const affectedSessionId = selectedSubstitute.affectedSessionId || selectedSubstitute.id;

    if (!affectedSessionId) {
      console.error('affectedSessionId is undefined', selectedSubstitute);
      alert('Không tìm thấy ID của yêu cầu dạy thay');
      return;
    }

    console.log('Confirming with affectedSessionId:', affectedSessionId);

    setConfirmLoading(true);
    try {
      const responseAction = confirmAction === 'accept' ? 'ACCEPTED' : 'REJECTED';

      const response = await teacherLeaveApi.replacementResponse(affectedSessionId, responseAction);

      if (response.errCode === 0) {
        await fetchSubstituteRequests();
        setIsConfirmModalOpen(false);
        setSelectedSubstitute(null);
      } else {
        alert(response.message || 'Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } catch (error) {
      console.error('Response error:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleViewSubstituteDetail = async (affectedSessionId: number) => {
    console.log('View substitute detail:', affectedSessionId);
    // TODO: Mở modal chi tiết dạy thay
  };

  // Tính thu nhập tạm tính (giả sử 300k/buổi)
  const totalIncome = substituteAcceptedCount * 300000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <TeacherLeaveHeader pendingCount={pendingCount + substitutePendingCount} />

        {/* Create Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 btn-gradient from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-200 transition-all"
          >
            <Sparkles size={18} />
            Tạo đơn nghỉ
            <Plus size={16} />
          </motion.button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('my-leaves')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'my-leaves'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
          >
            <FileText size={18} />
            Đơn nghỉ của tôi
            {totalPending > 0 && activeTab !== 'my-leaves' && (
              <span className="bg-purple-100 text-purple-600 text-xs px-1.5 py-0.5 rounded-full">
                {totalPending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('substitute-requests')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'substitute-requests'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
          >
            <Users size={18} />
            Dạy thay được phân công
            {substitutePendingCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">
                {substitutePendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content - My Leaves */}
        {activeTab === 'my-leaves' && (
          <>
            {/* Stats for Leave */}
            <TeacherLeaveStats
              total={totalLeaves}
              pending={totalPending}
              approved={totalApproved}
              affectedSessions={totalAffectedSessions}
            />

            {/* Toolbar */}
            <TeacherLeaveToolbar
              onSearch={handleSearch}
              onStatusChange={handleStatusChange}
              searchValue={searchKeyword}
              statusValue={statusFilter}
            />

            {/* Leave List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  📋 Danh sách đơn nghỉ
                  {pagination.totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({pagination.totalItems} đơn)
                    </span>
                  )}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {leavesLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl p-12 text-center"
                  >
                    <div className="inline-block rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600 animate-spin" />
                    <p className="mt-3 text-gray-500">Đang tải dữ liệu...</p>
                  </motion.div>
                ) : leaves.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl p-12 text-center border border-gray-100"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <CalendarX size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">Chưa có đơn nghỉ nào</p>
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="mt-3 text-purple-600 text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Tạo đơn nghỉ đầu tiên
                      <Plus size={14} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <AnimatePresence>
                      {leaves.map((leave, index) => (
                        <motion.div
                          key={leave.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TeacherLeaveTableRow
                            leave={leave}
                            onViewDetail={handleViewDetail}
                            onCancel={handleCancel}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <button
                    onClick={() => fetchLeaves(pagination.currentPage - 1, statusFilter)}
                    disabled={pagination.currentPage === 1}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Trước
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchLeaves(pagination.currentPage + 1, statusFilter)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sau →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab Content - Substitute Requests */}
        {activeTab === 'substitute-requests' && (
          <>
            {/* Stats for Substitute */}
            <SubstituteStats
              pending={substitutePendingCount}
              accepted={substituteAcceptedCount}
              income={totalIncome}
            />

            {/* Substitute List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  🎓 Yêu cầu dạy thay
                  {substituteRequests.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({substituteRequests.length} yêu cầu)
                    </span>
                  )}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {substituteLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-xl p-12 text-center"
                  >
                    <div className="inline-block rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600 animate-spin" />
                    <p className="mt-3 text-gray-500">Đang tải dữ liệu...</p>
                  </motion.div>
                ) : substituteRequests.length === 0 ? (
                  <EmptySubstituteRequests />
                ) : (
                  <motion.div
                    key="substitute-list"  // Thêm key cho motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <AnimatePresence mode="wait">
                      {substituteRequests.map((request, index) => (
                        <motion.div
                          key={request.affectedSessionId || request.id || `substitute-${index}`}  // Đảm bảo key có giá trị
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <SubstituteRequestCard
                            request={request}
                            onAccept={handleAcceptSubstitute}
                            onReject={handleRejectSubstitute}
                            onViewDetail={handleViewSubstituteDetail}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Modals */}
        <CreateLeaveModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateLeave}
          onPreview={handlePreviewSessions}
          previewSessions={previewSessions}
          previewLoading={previewLoading}
        />

        <LeaveDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedLeaveDetail(null);
          }}
          leave={selectedLeaveDetail}
          loading={detailLoading}
        />

        <ConfirmSubstituteModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setSelectedSubstitute(null);
          }}
          onConfirm={handleConfirmSubstitute}
          request={selectedSubstitute}
          action={confirmAction}
          loading={confirmLoading}
        />
      </div>
    </div>
  );
};