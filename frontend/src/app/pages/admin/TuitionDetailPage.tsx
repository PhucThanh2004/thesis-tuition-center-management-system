// src/app/pages/admin/TuitionDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Edit,
  Printer,
  FileText,
  CreditCard,
  TrendingUp,
  Brain,
  Calendar,
  Clock,
  History,
  MessageCircle,
  X,
  Trash2,
  PlusCircle,
  Landmark,
  Wallet,
  AlertCircle,
  User,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { ProtectedRoute } from '../../routes/ProtectedRoute';
import { tuitionApi } from '../../utils/api/tuition.api';
import type { TuitionDetailResponse, TuitionDetailItem } from '../../utils/types/tuition';

interface TuitionDetailData {
  id: number;
  studentName: string;
  studentCode: string;
  grade: string;
  avatar: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'WAITING_PAYMENT';
  totalTuition: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  courses: number;
  aiInsight: string;
  aiPercentage: number;
  attendance: number;
  totalHours: number;
  scholarship: number;
  items: TuitionItem[];
  transactions: Transaction[];
}

interface TuitionItem {
  id: number;
  name: string;
  code: string;
  teacher: string;
  sessions: number;
  unitPrice: number;
  total: number;
  discount?: number;
}

interface Transaction {
  id: number;
  description: string;
  date: string;
  method: string;
  amount: number;
  type: 'income' | 'pending';
}

export const TuitionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TuitionDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [editData, setEditData] = useState<{
    items: TuitionItem[];
    scholarship: number;
  }>({ items: [], scholarship: 0 });
  useEffect(() => {
    if (id) {
      fetchTuitionDetail();
    }
  }, [id]);

  const handleOpenEditModal = () => {
    if (data) {
      setEditData({
        items: data.items.map(item => ({ ...item })),
        scholarship: data.scholarship
      });
      setShowEditModal(true);
    }
  };

  const fetchTuitionDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(window.location.search);
      const studentId = parseInt(id || '0');
      const month = parseInt(params.get('month') || new Date().getMonth().toString());
      const year = parseInt(params.get('year') || new Date().getFullYear().toString());

      console.log('📤 Fetching detail for:', { studentId, month, year });

      const response = await tuitionApi.getTuitionDetail(studentId, month, year);
      console.log('📊 API Response:', response);

      if (!response) {
        setError(`Không tìm thấy học phí của học sinh ID ${studentId} trong tháng ${month}/${year}`);
        setLoading(false);
        return;
      }

      const transformedData: TuitionDetailData = {
        id: response.id || 0,
        studentName: response.student?.userInfo?.fullName || response.studentName || 'Học sinh',
        studentCode: response.studentCode || `#SCH${response.student?.id || response.studentId || studentId}`,
        grade: response.student?.grade || '',
        avatar: response.student?.userInfo?.image || '',
        status: mapStatus(response.status || 'WAITING_PAYMENT'),
        totalTuition: response.totalAmount || 0,
        paidAmount: response.paidAmount || 0,
        remainingAmount: response.remainingAmount || 0,
        dueDate: response.dueDate || new Date(response.createdAt || Date.now()).toLocaleDateString('vi-VN'),
        courses: response.details?.length || 0,
        aiInsight: generateAIInsight(response),
        aiPercentage: calculateAIPercentage(response),
        attendance: 94,
        totalHours: calculateTotalHours(response.details),
        scholarship: response.details?.reduce((sum, d) => sum + (d.totalMoney || 0) * 0.2, 0) || 0,
        items: response.details?.map((d, index) => ({
          id: d.id || index,
          name: d.subject?.name || d.subjectName || `Môn học ${index + 1}`,
          code: d.subject?.id?.toString() || d.subjectCode || '',
          teacher: d.teacher || '',
          sessions: d.attendedSessions || d.sessions || 0,
          unitPrice: d.unitPrice || (d.totalMoney || 0) / (d.attendedSessions || 1),
          total: d.totalMoney || d.amount || 0,
          discount: d.discount || 0,
        })) || [],
        transactions: []
      };

      setData(transformedData);

    } catch (err) {
      console.error('❌ Failed to fetch tuition detail:', err);
      setError('Không thể tải thông tin học phí. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const mapStatus = (status: string): 'PAID' | 'PARTIAL' | 'PENDING' | 'WAITING_PAYMENT' => {
    if (status === 'PAID') return 'PAID';
    if (status === 'PARTIAL_PAID') return 'PARTIAL';
    return 'PENDING';
  };

  const calculateTotalHours = (details?: TuitionDetailItem[]): number => {
    return details?.reduce((sum, d) => sum + (d.totalHours || 0), 0) || 0;
  };

  const calculateAIPercentage = (response: TuitionDetailResponse): number => {
    if (!response.details || response.details.length === 0) return 0;
    const maxAmount = Math.max(...response.details.map(d => d.totalMoney || 0));
    const maxIndex = response.details.findIndex(d => (d.totalMoney || 0) === maxAmount);
    return maxIndex >= 0 ? 65 : 50; 
  };

  const generateAIInsight = (response: TuitionDetailResponse): string => {
    if (!response.details || response.details.length === 0) {
      return 'Chưa có dữ liệu để phân tích.';
    }
    const total = response.totalAmount || 0;
    const paid = response.paidAmount || 0;
    const remaining = response.remainingAmount || 0;
    const paidPercent = total > 0 ? Math.round((paid / total) * 100) : 0;

    if (remaining <= 0) {
      return 'Học sinh đã hoàn thành thanh toán toàn bộ học phí. Xuất sắc!';
    }
    if (paidPercent >= 50) {
      return `Học sinh đã thanh toán ${paidPercent}% học phí. Còn ${(remaining / 1000000).toFixed(1)}M cần thu hồi.`;
    }
    return `Học sinh mới thanh toán ${paidPercent}% học phí. Cần đẩy mạnh thu hồi ${(remaining / 1000000).toFixed(1)}M còn lại.`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return {
          label: 'Đã thanh toán',
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
      case 'PARTIAL':
        return {
          label: 'Một phần',
          className: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      default:
        return {
          label: 'Chờ thanh toán',
          className: 'bg-red-100 text-red-700 border-red-200'
        };
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    const amount = parseInt(paymentAmount.replace(/\D/g, ''));
    if (amount <= 0) {
      alert('Vui lòng nhập số tiền thanh toán!');
      return;
    }
    if (amount > data.remainingAmount) {
      alert(`Số tiền không được vượt quá số dư nợ (${formatCurrency(data.remainingAmount)})`);
      return;
    }

    setShowPaymentModal(false);
    setShowLoadingOverlay(true);

    try {
      await tuitionApi.payTuition(data.id, amount);
      await fetchTuitionDetail();
      alert(`✅ Thanh toán thành công ${formatCurrency(amount)}!`);
      setPaymentAmount('');
    } catch (err) {
      console.error('Payment failed:', err);
      alert('❌ Thanh toán thất bại. Vui lòng thử lại!');
    } finally {
      setShowLoadingOverlay(false);
    }
  };


  const handleEdit = async () => {
    if (!data) return;

    try {
      setShowLoadingOverlay(true);

      // Lấy danh sách detail IDs cần cập nhật
      const updatePromises = editData.items.map((item, index) => {
        const originalItem = data.items[index];
        if (!originalItem) return null;

        // Kiểm tra xem có thay đổi không
        const hasChanged =
          item.sessions !== originalItem.sessions ||
          item.unitPrice !== originalItem.unitPrice ||
          item.total !== originalItem.total ||
          item.discount !== originalItem.discount;

        if (!hasChanged) return null;

        // Gọi API update cho từng detail
        return tuitionApi.updateTuitionDetail({
          detailId: originalItem.id,
          attendedSessions: item.sessions,
          totalMoney: item.total,
          note: `Cập nhật số buổi: ${item.sessions}, đơn giá: ${item.unitPrice}`
        });
      }).filter(Boolean);

      // Nếu không có thay đổi
      if (updatePromises.length === 0) {
        setShowEditModal(false);
        setShowLoadingOverlay(false);
        alert('Không có thay đổi nào được thực hiện.');
        return;
      }

      // Thực hiện tất cả cập nhật
      await Promise.all(updatePromises);

      // Cập nhật lại dữ liệu
      await fetchTuitionDetail();

      setShowEditModal(false);
      alert('✅ Cập nhật học phí thành công!');

    } catch (err) {
      console.error('❌ Failed to update tuition:', err);
      alert('❌ Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
      setShowLoadingOverlay(false);
    }
  };

  const handleEditItemChange = (index: number, field: keyof TuitionItem, value: any) => {
    setEditData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };

      if (field === 'sessions' || field === 'unitPrice') {
        const sessions = field === 'sessions' ? value : newItems[index].sessions;
        const unitPrice = field === 'unitPrice' ? value : newItems[index].unitPrice;
        newItems[index].total = sessions * unitPrice;
      }
      return { ...prev, items: newItems };
    });
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['R0']}>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-500">Đang tải thông tin học phí...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !data) {
    return (
      <ProtectedRoute allowedRoles={['R0']}>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy dữ liệu</h2>
            <p className="text-slate-500">{error || 'Không tìm thấy thông tin học phí'}</p>
            <button
              onClick={() => navigate('/admin/tuition')}
              className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statusBadge = getStatusBadge(data.status);
  const subtotal = data.items.reduce((sum, item) => sum + item.total, 0);
  const totalAfterDiscount = subtotal - data.scholarship;

  return (
    <ProtectedRoute allowedRoles={['R0']}>
      <main className="min-h-screen bg-slate-50 pb-20">
        <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
          {/* Header Section */}
          <header className="bg-white/80 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-6">
              <div className="relative">
                {data.avatar ? (
                  <img
                    src={data.avatar}
                    alt={data.studentName}
                    className="w-20 h-20 rounded-full border-2 border-purple-500/20 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-500/20 shadow-lg">
                    <User className="w-10 h-10 text-purple-600" />
                  </div>
                )}
                <div className={`absolute bottom-0 right-0 w-5 h-5 border-2 border-white rounded-full ${data.status === 'PAID' ? 'bg-emerald-500' : data.status === 'PARTIAL' ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">{data.studentName}</h1>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase tracking-wider ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </div>
                <p className="text-slate-500 font-medium mt-1">
                  ID: {data.studentCode} • Lớp {data.grade}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenEditModal}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-all flex items-center gap-2 border border-slate-200 shadow-sm"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-all flex items-center gap-2 border border-slate-200 shadow-sm">
                <Printer className="w-4 h-4" />
                In
              </button>
              <button className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition-all flex items-center gap-2 border border-slate-200 shadow-sm">
                <FileText className="w-4 h-4" />
                Xuất PDF
              </button>
              {data.status !== 'PAID' && (
                <button
                  onClick={() => {
                    setPaymentAmount(data.remainingAmount.toString());
                    setShowPaymentModal(true);
                  }}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <CreditCard className="w-4 h-4" />
                  Thanh toán ngay
                </button>
              )}
            </div>
          </header>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80 shadow-soft relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Landmark className="w-12 h-12 text-slate-900" />
              </div>
              <p className="text-slate-500 text-sm font-semibold">Tổng học phí</p>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">{formatCurrency(data.totalTuition)}</h2>
              <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% so với học kỳ trước
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80 shadow-soft relative overflow-hidden group">
              <p className="text-slate-500 text-sm font-semibold">Đã thanh toán</p>
              <h2 className="text-3xl font-bold mt-2 text-purple-600">{formatCurrency(data.paidAmount)}</h2>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${data.totalTuition > 0 ? (data.paidAmount / data.totalTuition) * 100 : 0}%` }}></div>
                </div>
                <span className="text-xs font-bold text-slate-600">
                  {data.totalTuition > 0 ? Math.round((data.paidAmount / data.totalTuition) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80 shadow-soft relative overflow-hidden group border-l-4 border-l-orange-400">
              <p className="text-slate-500 text-sm font-semibold">Còn phải thu</p>
              <h2 className="text-3xl font-bold mt-2 text-orange-600">{formatCurrency(data.remainingAmount)}</h2>
              <p className="mt-4 text-xs text-slate-500 font-medium">Hạn chót: {data.dueDate}</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200/80 shadow-soft relative overflow-hidden group">
              <p className="text-slate-500 text-sm font-semibold">Số môn học</p>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">{data.courses}</h2>
              <div className="mt-4 flex -space-x-2">
                {data.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="w-6 h-6 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-[10px] font-bold text-purple-600">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                ))}
                {data.courses > 3 && (
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] text-slate-600">
                    +{data.courses - 3}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* AI Insight */}
              <section className="bg-purple-50/30 backdrop-blur-sm rounded-xl p-6 border border-purple-200/30 shadow-lg shadow-purple-500/5 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full"></div>
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-slate-900">AI Tuition Insights</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {data.aiInsight}
                    </p>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-600 text-[10px] font-bold rounded border border-purple-500/20">
                        XU HƯỚNG TĂNG
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded border border-blue-200">
                        TIỀM NĂNG HỌC BỔNG
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-slate-200" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8" />
                        <circle className="text-purple-600 transition-all duration-1000" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - data.aiPercentage / 100)} strokeLinecap="round" strokeWidth="8" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">
                        {data.aiPercentage}% AI
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Invoice Detail Table */}
              <section className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-200/80 shadow-soft">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                  <h3 className="font-bold text-slate-900">Chi tiết học phần</h3>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Học kỳ 1 - 2023</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-bold">Môn học / Nội dung</th>
                        <th className="px-6 py-4 font-bold">Số buổi</th>
                        <th className="px-6 py-4 font-bold">Đơn giá</th>
                        <th className="px-6 py-4 font-bold text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {data.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{item.name}</div>
                            <div className="text-xs text-slate-500">
                              Mã MH: {item.code} {item.teacher && `| GV: ${item.teacher}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-700">{item.sessions}</td>
                          <td className="px-6 py-4 text-slate-700">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50">
                      <tr>
                        <td className="px-6 py-4 text-right font-medium text-slate-500" colSpan={3}>Tạm tính:</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(subtotal)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-right font-medium text-slate-500" colSpan={3}>Giảm trừ học bổng:</td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">- {formatCurrency(data.scholarship)}</td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-6 py-6 text-right font-bold text-lg text-slate-900" colSpan={3}>Tổng cộng:</td>
                        <td className="px-6 py-6 text-right font-bold text-2xl text-purple-600">{formatCurrency(totalAfterDiscount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Overview Cards */}
              <section className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Chuyên cần</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">{data.attendance}%</div>
                  <div className="text-[10px] text-slate-500 font-medium">24/26 buổi học</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200/80 shadow-soft">
                  <div className="flex items-center gap-2 mb-2 text-purple-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Giờ học</span>
                  </div>
                  <div className="text-xl font-bold text-slate-900">{data.totalHours}h</div>
                  <div className="text-[10px] text-slate-500 font-medium">Tích lũy tháng 10</div>
                </div>
              </section>

              {/* Payment Timeline */}
              <section className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/80 shadow-soft">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Lịch sử giao dịch
                </h3>
                <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                  {data.transactions.length > 0 ? (
                    data.transactions.map((tx) => (
                      <div key={tx.id} className="relative pl-8 group">
                        <div className={`absolute left-0 top-1.5 w-[24px] h-[24px] rounded-full border-4 border-white z-10 shadow-sm ${tx.type === 'income' ? 'bg-emerald-500' : 'bg-slate-200 group-hover:bg-purple-600 transition-colors'}`}></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`font-bold text-sm ${tx.type === 'pending' ? 'text-slate-400 group-hover:text-slate-900 transition-colors' : 'text-slate-900'}`}>
                              {tx.description}
                            </p>
                            <p className="text-xs text-slate-500">{tx.date}</p>
                          </div>
                          <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                            {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500 text-sm">Chưa có giao dịch nào</div>
                  )}
                </div>
                <button className="w-full mt-8 py-2 text-xs font-bold text-purple-600 border border-purple-500/20 rounded-lg hover:bg-purple-50/50 transition-all">
                  Xem tất cả giao dịch
                </button>
              </section>

              {/* Support Card */}
              <section className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-purple-500/5 bg-gradient-to-br from-purple-50/30 to-white shadow-soft">
                <p className="text-sm font-bold text-slate-900 mb-4">Cần hỗ trợ về tài chính?</p>
                <div className="flex gap-4">
                  <div className="flex-1 text-xs text-slate-500 leading-relaxed font-medium">
                    Liên hệ phòng kế toán để được hướng dẫn trả góp hoặc miễn giảm học phí.
                  </div>
                  <button className="bg-white border border-slate-200 p-2 rounded-lg text-slate-600 hover:text-purple-600 transition-colors shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">Xác nhận thanh toán</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="p-6 space-y-6" onSubmit={handlePayment}>
                {/* Thông tin học sinh */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Học sinh:</span>
                    <span className="font-medium text-slate-900">{data.studentName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Mã số:</span>
                    <span className="font-medium text-slate-900">{data.studentCode}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Lớp:</span>
                    <span className="font-medium text-slate-900">Lớp {data.grade}</span>
                  </div>
                </div>

                {/* Số tiền */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Số tiền thanh toán
                  </label>
                  <div className="relative">
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                      type="text"
                      value={new Intl.NumberFormat('vi-VN').format(parseInt(paymentAmount.replace(/\D/g, '')) || 0)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setPaymentAmount(value);
                      }}
                      placeholder="Nhập số tiền..."
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">VNĐ</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-orange-600 font-semibold">
                      * Số tiền tối đa: {formatCurrency(data.remainingAmount)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(data.remainingAmount.toString())}
                      className="text-[10px] text-purple-600 font-semibold hover:underline"
                    >
                      Thanh toán toàn bộ
                    </button>
                  </div>
                </div>

                {/* Phương thức thanh toán - Chỉ hiển thị thông tin */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    Phương thức thanh toán
                  </label>
                  <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Xác nhận qua admin
                      </span>
                      <span className="text-xs text-slate-400">(Ghi nhận thanh toán)</span>
                    </div>
                  </div>
                </div>

                {/* Nút xác nhận */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 hover:bg-purple-700 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    <CheckCircle className="w-5 h-5 inline mr-2" />
                    Xác nhận thanh toán
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <h3 className="text-xl font-bold text-slate-900">Điều chỉnh học phí học viên</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500">
                        <th className="px-4 py-3 font-bold uppercase text-[11px] tracking-wider">Tên mục</th>
                        <th className="px-4 py-3 font-bold uppercase text-[11px] tracking-wider">Số buổi</th>
                        <th className="px-4 py-3 font-bold uppercase text-[11px] tracking-wider">Đơn giá</th>
                        <th className="px-4 py-3 font-bold uppercase text-[11px] tracking-wider">Thành tiền</th>
                        <th className="px-4 py-3 font-bold uppercase text-[11px] tracking-wider text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {editData.items.map((item, index) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3">
                            <input
                              className="bg-transparent border-none focus:ring-0 w-full p-0 text-slate-900 font-medium"
                              type="text"
                              value={item.name}
                              onChange={(e) => handleEditItemChange(index, 'name', e.target.value)}
                              readOnly
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 w-20 text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                              type="number"
                              value={item.sessions}
                              onChange={(e) => handleEditItemChange(index, 'sessions', parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 w-28 text-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleEditItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              className="bg-transparent border border-slate-200 rounded-lg px-2 py-1 w-28 text-slate-900 font-bold text-purple-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all"
                              type="number"
                              value={item.total}
                              onChange={(e) => handleEditItemChange(index, 'total', parseInt(e.target.value) || 0)}
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3 text-right text-red-500">
                            <button
                              className="hover:text-red-700 transition-colors"
                              title="Xóa mục này (chưa hỗ trợ)"
                            >
                              <Trash2 className="w-5 h-5 opacity-50 cursor-not-allowed" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50/50">
                      <tr>
                        <td className="px-4 py-3 text-right font-medium text-slate-500" colSpan={3}>
                          Tạm tính:
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {formatCurrency(editData.items.reduce((sum, item) => sum + (item.total || 0), 0))}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-right font-medium text-slate-500" colSpan={3}>
                          Giảm trừ học bổng:
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          - {formatCurrency(editData.scholarship)}
                        </td>
                      </tr>
                      <tr className="border-t border-slate-200">
                        <td className="px-4 py-3 text-right font-bold text-lg text-slate-900" colSpan={3}>
                          Tổng cộng:
                        </td>
                        <td className="px-4 py-3 font-bold text-2xl text-purple-600">
                          {formatCurrency(editData.items.reduce((sum, item) => sum + (item.total || 0), 0) - editData.scholarship)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <button
                  className="mt-4 flex items-center gap-2 text-purple-600 text-sm font-bold hover:opacity-80 transition-all opacity-50 cursor-not-allowed"
                  disabled
                >
                  <PlusCircle className="w-5 h-5" />
                  Thêm mục mới (chưa hỗ trợ)
                </button>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 flex-shrink-0">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleEdit}
                  className="px-8 py-2 bg-purple-600 text-white rounded-lg font-bold shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {showLoadingOverlay && (
          <div className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-purple-500/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold animate-pulse text-slate-900">Đang xử lý giao dịch...</h2>
            <p className="text-slate-500 mt-2 font-medium">Vui lòng không đóng trình duyệt</p>
          </div>
        )}
      </main>
    </ProtectedRoute>
  );
};

export default TuitionDetailPage;