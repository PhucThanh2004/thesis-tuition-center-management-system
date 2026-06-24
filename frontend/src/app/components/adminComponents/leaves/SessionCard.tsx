import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    Clock3,
    MapPin,
    UserPlus,
    CheckCircle,
    XCircle,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    History,
    RefreshCw,
    Trash2,
    UserCheck,
    UserX,
    Loader2,
    Send,
    X,
    DollarSign,
    Calendar
} from 'lucide-react';
import type { AffectedSession, AvailableReplacementTeacher } from '../../../utils/types/teacherLeave';
import {
    getSessionStatusConfig,
    formatDisplayTime,
    formatDateTime,
    cleanDisplayName
} from '../../../utils/helpers/sessionStatus';

interface SessionCardProps {
    session: AffectedSession;
    index: number;
    availableTeachers?: AvailableReplacementTeacher[];
    isLoadingTeachers?: boolean;
    isAssigning?: boolean;
    onAssignTeacher: (sessionId: number, teacherId: number, salary?: number) => Promise<void>;
    onCancelSession: (affectedSessionId: number) => Promise<void>;
    onResendRequest?: (affectedSessionId: number) => Promise<void>;
    onCancelAssignment?: (affectedSessionId: number) => Promise<void>;
    onGetAvailableTeachers: (sessionId: number) => Promise<void>;
    onRefresh?: () => void;
}

export const SessionCard = ({
    session,
    index,
    availableTeachers = [],
    isLoadingTeachers = false,
    isAssigning = false,
    onAssignTeacher,
    onCancelSession,
    onResendRequest,
    onCancelAssignment,
    onGetAvailableTeachers,
    onRefresh,
}: SessionCardProps) => {
    const [showHistory, setShowHistory] = useState(false);
    const [showTeacherSelect, setShowTeacherSelect] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedSalary, setSelectedSalary] = useState<string>('');

    const statusConfig = getSessionStatusConfig(session.status);
    const StatusIcon = statusConfig.icon;

    const cleanReplacementTeacher = cleanDisplayName(session.replacementTeacherName || '');
    const cleanSubjectName = cleanDisplayName(session.subjectName || '');
    const cleanRoomName = cleanDisplayName(session.roomName || '');
    const cleanClassName = cleanDisplayName(session.className || '');

    const sessionDate = new Date(session.sessionDate);
    const dayOfWeek = sessionDate.toLocaleDateString('vi-VN', { weekday: 'short' });
    const dayNumber = sessionDate.getDate();

    useEffect(() => {
        if (session.status === 'ASSIGNED' || session.status === 'RESOLVED' || session.status === 'DECLINED') {
            setShowTeacherSelect(false);
            setSelectedTeacherId(null);
            setSelectedSalary('');
        }
    }, [session.status]);

    const handleTeacherSelect = (teacherId: number) => {
        setSelectedTeacherId(teacherId);
        const teacher = availableTeachers.find(t => t.teacherId === teacherId);
        if (teacher?.defaultSalary) {
            setSelectedSalary(teacher.defaultSalary.toString());
        } else {
            setSelectedSalary('');
        }
    };

    const handleAssign = async () => {
        if (!selectedTeacherId) return;
        const salary = selectedSalary ? Number(selectedSalary) : undefined;
        await onAssignTeacher(session.affectedSessionId || session.id, selectedTeacherId, salary);
        setShowTeacherSelect(false);
        setSelectedTeacherId(null);
        setSelectedSalary('');
    };

    const handleGetTeachers = async () => {
        const sessionId = session.affectedSessionId || session.id;
        if (!sessionId) {
            console.error('❌ Cannot fetch teachers: session ID is missing');
            return;
        }
        await onGetAvailableTeachers(sessionId);
        setShowTeacherSelect(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const handleResendRequest = async () => {
        if (!onResendRequest) return;
        const sessionId = session.affectedSessionId || session.id;
        await onResendRequest(sessionId);
    };

    const handleCancelAssignment = async () => {
        if (!onCancelAssignment) return;
        const sessionId = session.affectedSessionId || session.id;
        if (confirm('Bạn có chắc chắn muốn hủy phân công này?')) {
            await onCancelAssignment(sessionId);
        }
    };

    const renderTeacherSelection = () => (
        <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <UserPlus size={12} className="text-purple-500" />
                Chọn giáo viên dạy thay
            </p>
            {isLoadingTeachers ? (
                <div className="flex items-center justify-center py-3">
                    <Loader2 size={18} className="animate-spin text-purple-500" />
                </div>
            ) : availableTeachers.length > 0 ? (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-1.5">
                        {availableTeachers.map((teacher) => (
                            <motion.label
                                key={teacher.teacherId}
                                whileHover={{ scale: 1.01 }}
                                className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                                    selectedTeacherId === teacher.teacherId
                                        ? 'border-purple-400 bg-purple-50'
                                        : 'border-slate-200 hover:border-purple-200'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`teacher-${session.sessionId}`}
                                    value={teacher.teacherId}
                                    checked={selectedTeacherId === teacher.teacherId}
                                    onChange={() => handleTeacherSelect(teacher.teacherId)}
                                    className="w-3.5 h-3.5 text-purple-600 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700">{teacher.teacherName}</p>
                                    <p className="text-[10px] text-slate-400">{teacher.teacherEmail}</p>
                                </div>
                                {teacher.defaultSalary && (
                                    <div className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                        <DollarSign size={10} />
                                        {formatCurrency(teacher.defaultSalary)}đ
                                    </div>
                                )}
                            </motion.label>
                        ))}
                    </div>

                    {selectedTeacherId && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200"
                        >
                            <DollarSign size={15} className="text-slate-400" />
                            <div className="flex-1">
                                <label className="text-[10px] font-medium text-slate-500">Lương dạy thay (VNĐ)</label>
                                <input
                                    type="number"
                                    value={selectedSalary}
                                    onChange={(e) => setSelectedSalary(e.target.value)}
                                    placeholder="Nhập lương..."
                                    className="w-full mt-0.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-purple-400 focus:border-purple-400 transition-all"
                                />
                            </div>
                            <span className="text-[10px] text-slate-400">/ buổi</span>
                        </motion.div>
                    )}

                    <div className="flex justify-end gap-1.5 mt-2">
                        <button
                            onClick={() => {
                                setShowTeacherSelect(false);
                                setSelectedTeacherId(null);
                                setSelectedSalary('');
                            }}
                            className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAssign}
                            disabled={!selectedTeacherId || isAssigning}
                            className="px-3.5 py-1 rounded-lg bg-purple-600 text-white text-xs font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                        >
                            {isAssigning ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                            Xác nhận
                        </motion.button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-3 text-xs text-slate-400">
                    Không có giáo viên khả dụng
                </div>
            )}
        </div>
    );

    const renderActionArea = () => {
        switch (session.status) {
            case 'PENDING':
                if (showTeacherSelect) {
                    return renderTeacherSelection();
                }
                return (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleGetTeachers}
                        disabled={isAssigning}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-medium flex items-center gap-1.5 hover:bg-purple-700 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isAssigning ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                        Chọn GV thay
                    </motion.button>
                );

            case 'ASSIGNED':
                return (
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 animate-pulse">
                            <Loader2 size={10} className="animate-spin text-blue-500" />
                            <span className="text-[10px] font-medium text-blue-600">Đã gửi yêu cầu</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                            Đang chờ <span className="font-medium text-slate-600">{cleanReplacementTeacher}</span>
                        </p>
                        <div className="flex gap-1.5 mt-0.5">
                            <button
                                onClick={onRefresh}
                                className="text-[10px] text-emerald-500 hover:text-emerald-600 flex items-center gap-0.5 transition-colors"
                            >
                                <RefreshCw size={9} />
                                Kiểm tra
                            </button>
                            <button
                                onClick={handleResendRequest}
                                className="text-[10px] text-blue-500 hover:text-blue-600 flex items-center gap-0.5 transition-colors"
                            >
                                <RefreshCw size={9} />
                                Gửi lại
                            </button>
                            <button
                                onClick={handleCancelAssignment}
                                className="text-[10px] text-red-400 hover:text-red-500 flex items-center gap-0.5 transition-colors"
                            >
                                <X size={9} />
                                Hủy
                            </button>
                        </div>
                    </div>
                );

            case 'DECLINED':
                if (showTeacherSelect) {
                    return renderTeacherSelection();
                }
                return (
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 self-end">
                            <XCircle size={10} className="text-red-500" />
                            <span className="text-[10px] font-medium text-red-600">
                                {cleanReplacementTeacher} từ chối
                            </span>
                        </div>
                        {session.declineReason && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50/80 p-1.5 rounded-lg border border-red-100 max-w-[220px]"
                            >
                                <p className="text-[10px] text-red-500 italic">"{session.declineReason}"</p>
                            </motion.div>
                        )}
                        <div className="flex gap-1.5 justify-end">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleGetTeachers}
                                className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-medium flex items-center gap-1 hover:bg-purple-700 transition-all"
                            >
                                <RefreshCw size={10} />
                                Chọn GV khác
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onCancelSession(session.affectedSessionId || session.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-600 text-[10px] font-medium flex items-center gap-1 hover:bg-slate-300 transition-all"
                            >
                                <Trash2 size={10} />
                                Hủy buổi
                            </motion.button>
                        </div>
                    </div>
                );

            case 'RESOLVED':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50">
                        <CheckCircle size={12} className="text-emerald-500" />
                        <span className="text-[10px] font-medium text-emerald-600">
                            {cleanReplacementTeacher} đã nhận dạy
                        </span>
                    </div>
                );

            case 'SKIPPED':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100">
                        <XCircle size={12} className="text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-400">Đã hủy</span>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ x: 2 }}
            className={`bg-white rounded-xl overflow-hidden border-l-3 transition-all shadow-sm hover:shadow-md ${statusConfig.border}`}
            style={{ borderLeftColor: `var(--${statusConfig.iconColor.replace('text-', '')})` }}
        >
            <div className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    {/* Left: Date & Subject Info */}
                    <div className="flex items-center gap-3.5">
                        <div className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0 ${statusConfig.bg}`}>
                            <span className={`text-[9px] font-medium uppercase ${statusConfig.iconColor}`}>{dayOfWeek}</span>
                            <span className={`text-lg font-bold ${statusConfig.iconColor}`}>{dayNumber}</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="font-semibold text-slate-800 text-base">{cleanSubjectName}</p>
                                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium ${statusConfig.badgeColor}`}>
                                    <StatusIcon size={9} />
                                    {statusConfig.label}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1.5">
                                <span className="flex items-center gap-1">
                                    <Clock3 size={11} className="text-purple-400" />
                                    {formatDisplayTime(session.startTime)} - {formatDisplayTime(session.endTime)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={11} className="text-purple-400" />
                                    {cleanRoomName}
                                </span>
                                {cleanClassName && cleanClassName !== 'Chưa cập nhật' && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                        Lớp: {cleanClassName}
                                    </span>
                                )}
                            </div>

                            {(session.status === 'ASSIGNED' || session.status === 'DECLINED' || session.status === 'RESOLVED') && (
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center">
                                        <UserCheck size={10} className="text-purple-600" />
                                    </div>
                                    <span className="text-[11px] text-slate-500">
                                        GV: <span className="font-medium text-slate-700">{cleanReplacementTeacher}</span>
                                    </span>
                                    {session.replacementSalary && (
                                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                            <DollarSign size={9} />
                                            {formatCurrency(session.replacementSalary)}đ
                                        </span>
                                    )}
                                    {session.assignedAt && (
                                        <span className="text-[9px] text-slate-400">
                                            {formatDateTime(session.assignedAt)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Action Area */}
                    <div className="flex-shrink-0">
                        {renderActionArea()}
                    </div>
                </div>

                {/* Timeline / History Section */}
                {session.sessionHistory && session.sessionHistory.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <History size={11} />
                            Lịch sử
                            {showHistory ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                        </button>

                        <AnimatePresence>
                            {showHistory && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-2 space-y-1.5"
                                >
                                    {session.sessionHistory.map((history, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-[10px]">
                                            <div className="w-14 text-slate-400 flex-shrink-0">
                                                {formatDateTime(history.createdAt).split(' ')[1]}
                                            </div>
                                            <div className="flex-1">
                                                <span className="font-medium text-slate-600">{history.actorName}</span>
                                                <span className="text-slate-400">
                                                    {' '}{history.action === 'ASSIGNED' ? 'đã phân công' :
                                                        history.action === 'ACCEPTED' ? 'đã nhận dạy' :
                                                            history.action === 'DECLINED' ? 'đã từ chối' :
                                                                history.action === 'REASSIGNED' ? 'đã phân công lại' :
                                                                    'đã hủy'}
                                                </span>
                                                {history.action === 'ASSIGNED' && history.newTeacherName && (
                                                    <span className="text-slate-500"> cho {history.newTeacherName}</span>
                                                )}
                                                {history.note && (
                                                    <p className="text-slate-400 italic mt-0.5">"{history.note}"</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </motion.div>
    );
};