import React, { useEffect, useMemo, useState } from 'react';
import {
    X,
    Plus,
    Delete,
    CloudUpload,
    Link,
    ChevronDown,
    Phone,
    BadgePlus,
    Sparkles,
    BookOpen,
    GraduationCap,
    Users,
    DollarSign,
    Calendar,
    FileText,
    Clock,
    Award,
    CheckCircle,
    AlertCircle,
    CreditCard,
    CalendarDays,
    Clock as ClockIcon,
    BookOpen as BookIcon
} from 'lucide-react';
import { ModalPortal } from '../../../pages/ModalPortal';
import type { TeacherBasic } from '../../../utils/types/teacher';
import { sessionApi, subjectApi, teacherApi } from '../../../utils/api';
import { getImageSrc, getInitials } from '../../../utils/helpers';
import type { SessionOfTeacher } from '../../../utils/types/session';
import type { CreateSubjectRequest, Subject, BillingType, PaymentPlanType } from '../../../utils/types/subject';
import { useOutletContext } from 'react-router-dom';
import type { TeacherSuggestionDTO, TimeSlot } from '../../../utils/types/teacherSuggestion';
import { teacherSuggestionApi } from '../../../utils/api/teacherSuggestion.api';

interface AddClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: "create" | "update";
    initialData?: Subject | null;
    onSubmit?: (data: CreateSubjectRequest) => void;
    onSuccess?: (updated: Subject) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, mode, initialData, onSubmit, onSuccess }) => {
    const { setAlert } = useOutletContext<any>();

    const [formData, setFormData] = useState<CreateSubjectRequest>({
        name: '',
        grade: '',
        price: undefined,
        status: 'active',
        maxStudents: '',
        sessionsPerWeek: '',
        note: '',
        teacherId: undefined,
        image: null,
        billingType: undefined,
        paymentPlanType: undefined,
        installmentCount: undefined
    });

    const [teacherList, setTeacherList] = useState<TeacherBasic[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [schedule, setSchedule] = useState<SessionOfTeacher[]>([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
    const [subjectTypes, setSubjectTypes] = useState<any[]>([]);
    const [selectedSubjectType, setSelectedSubjectType] = useState<number | null>(null);

    // State cho AI suggestions từ backend
    const [aiSuggestions, setAiSuggestions] = useState<TeacherSuggestionDTO[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);

    // Khung giờ mong muốn (có thể tùy chỉnh sau)
    const defaultTimeSlots: TimeSlot[] = [
        { dayOfWeek: 2, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 4, startTime: "18:00", endTime: "21:00" },
        { dayOfWeek: 6, startTime: "18:00", endTime: "21:00" },
    ];

    const selectedTeacherData = teacherList.find(t => t.id === selectedTeacher);

    // Fetch danh sách giáo viên
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoadingTeachers(true);
                const data = await teacherApi.getBasicTeachers();
                setTeacherList(data);
            } catch (err) {
                console.error('Lỗi lấy giáo viên:', err);
            } finally {
                setLoadingTeachers(false);
            }
        };
        fetchTeachers();
    }, []);

    // Fetch gợi ý giáo viên từ backend
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!formData.name || !formData.grade) {
                setAiSuggestions([]);
                return;
            }

            setLoadingSuggestions(true);
            try {
                const suggestions = await teacherSuggestionApi.suggestWithTimeSlots(
                    formData.name,
                    formData.grade,
                    defaultTimeSlots,
                    5
                );

                setAiSuggestions(suggestions);
                setLoadingSuggestions(false);
            } catch (error: any) {
                console.error("=== ERROR SUGGESTION ===");
                console.error(error);

                if (error.response) {
                    console.error("Status:", error.response.status);
                    console.error("Data:", error.response.data);
                }

                setAiSuggestions([]);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [formData.name, formData.grade]);

    // Xử lý khi chọn giáo viên từ gợi ý
    const handleSelectSuggestion = (teacherId: number) => {
        setSelectedTeacher(teacherId);
        setSelectedSuggestion(teacherId);
        handleInputChange('teacherId', teacherId);
    };

    useEffect(() => {
        if (mode === "update" && initialData) {
            setFormData({
                name: initialData.name,
                grade: initialData.grade,
                price: initialData.price,
                status: initialData.status,
                maxStudents: String(initialData.maxStudents),
                sessionsPerWeek: String(initialData.sessionsPerWeek),
                note: initialData.note,
                teacherId: initialData.teacherSubjects?.[0]?.teacher?.id,
                image: null,
                imageUrl: initialData.image || "",
                billingType: initialData.billingType || undefined,
                paymentPlanType: initialData.paymentPlanType || undefined,
                installmentCount: initialData.installmentCount || undefined
            });
            setSelectedTeacher(initialData.teacherSubjects?.[0]?.teacher?.id || null);
            setSelectedSubjectType(initialData.subjectType?.id || null);
            setPreviewImage(initialData.image || null);
        }
    }, [mode, initialData]);

    useEffect(() => {
        if (selectedTeacher === null) return;
        const fetchSchedule = async () => {
            try {
                setLoading(true);
                const startDate = "2026-03-10";
                const endDate = "2026-04-15";
                const data = await sessionApi.getTeacherSchedule(selectedTeacher, startDate, endDate);
                setSchedule(data);
            } catch (err) {
                console.error('Lỗi lấy lịch giáo viên:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [selectedTeacher]);

    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    useEffect(() => {
        const fetchSubjectTypes = async () => {
            try {
                const data = await subjectApi.getSubjectTypes();
                setSubjectTypes(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSubjectTypes();
    }, []);

    const handleInputChange = (field: keyof CreateSubjectRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTeacherSelect = (teacherId: number) => {
        setSelectedTeacher(teacherId);
        setSelectedSuggestion(teacherId);
        handleInputChange('teacherId', teacherId);
    };

    const handleRemoveTeacher = () => {
        setSelectedTeacher(null);
        setSelectedSuggestion(null);
        handleInputChange('teacherId', undefined);
    };

    const handleImageUpload = (file: File) => {
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        handleInputChange('image', file);
        handleInputChange('imageUrl', undefined);
    };

    const handleImageUrlChange = (url: string) => {
        handleInputChange('imageUrl', url);
        handleInputChange('image', null);
        setPreviewImage(url || null);
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        handleInputChange('image', null);
        handleInputChange('imageUrl', '');
    };

    // Xử lý khi thay đổi paymentPlanType
    const handlePaymentPlanChange = (value: PaymentPlanType | undefined) => {
        handleInputChange('paymentPlanType', value);
        if (value === 'FULL') {
            handleInputChange('installmentCount', undefined);
        }
        if (value === 'INSTALLMENT' && !formData.installmentCount) {
            handleInputChange('installmentCount', 3);
        }
    };

    // Tính toán giá hiển thị dựa trên billingType
    const getPriceDisplay = () => {
        if (!formData.price) return '0';
        const price = formData.price;
        if (formData.billingType === 'PER_HOUR') {
            return `${price.toLocaleString()} VNĐ/giờ`;
        } else if (formData.billingType === 'PER_SUBJECT') {
            return `${price.toLocaleString()} VNĐ/môn`;
        }
        return `${price.toLocaleString()} VNĐ`;
    };

    // Lấy label cho billing type
    const getBillingTypeLabel = (type: BillingType | undefined) => {
        if (!type) return 'Chưa chọn';
        return type === 'PER_HOUR' ? 'Theo giờ' : 'Theo môn';
    };

    // Lấy label cho payment plan
    const getPaymentPlanLabel = (type: PaymentPlanType | undefined) => {
        if (!type) return 'Chưa chọn';
        return type === 'FULL' ? 'Trả toàn bộ' : 'Trả góp';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.paymentPlanType === 'INSTALLMENT' && !formData.installmentCount) {
                setAlert?.({
                    type: "error",
                    message: "Vui lòng nhập số kỳ trả góp"
                });
                return;
            }

            if (mode === "update" && initialData) {
                await subjectApi.update(initialData.id, {
                    name: formData.name,
                    grade: formData.grade,
                    price: formData.price,
                    teacherId: formData.teacherId,
                    note: formData.note,
                    subjectTypeId: formData.subjectTypeId,
                    status: formData.status,
                    maxStudents: Number(formData.maxStudents),
                    sessionsPerWeek: Number(formData.sessionsPerWeek),
                    billingType: formData.billingType,
                    paymentPlanType: formData.paymentPlanType,
                    installmentCount: formData.installmentCount
                });
                setAlert?.({
                    type: "success",
                    message: "Cập nhật lớp học thành công"
                });
                onClose();
                if (onSuccess) {
                    onSuccess(initialData);
                }
            } else {
                await subjectApi.create(formData);
                setAlert?.({
                    type: "success",
                    message: "Tạo lớp học thành công"
                });
                onClose();
                if (onSuccess) {
                    onSuccess(formData as any);
                }
            }
        } catch (err: any) {
            const code = err.response?.data?.code;
            if (code === "TEACHER_UNPAID_CHANGE") {
                setAlert?.({
                    type: "error",
                    message: "Không thể đổi giáo viên vì còn nợ lương"
                });
            } else {
                setAlert?.({
                    type: "error",
                    message: "Có lỗi xảy ra, vui lòng thử lại"
                });
            }
        }
    };

    if (!isOpen) return null;

    return (
        <ModalPortal isOpen={isOpen}>
            <div onClick={onClose} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-300"
                    onClick={(e) => e.stopPropagation()}>

                    {/* Modal Header */}
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                                    {mode === "update" ? "Cập nhật lớp học" : "Thêm lớp học mới"}
                                </h3>
                                <p className="text-sm text-slate-400 font-medium mt-0.5">Khởi tạo lộ trình học tập cho học sinh</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-all duration-200">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Modal Content */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Basic Information Section */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Thông tin cơ bản</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Tên môn học */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            Tên môn học <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none placeholder:text-slate-300"
                                            placeholder="VD: Toán học nâng cao"
                                            type="text"
                                            required
                                        />
                                    </div>

                                    {/* Subject Type */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <GraduationCap className="w-3 h-3" />
                                            Loại môn học <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedSubjectType ?? ''}
                                                onChange={(e) => {
                                                    const id = Number(e.target.value);
                                                    setSelectedSubjectType(id);
                                                    handleInputChange('subjectTypeId', id);
                                                }}
                                                className="appearance-none w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none cursor-pointer text-slate-700 pr-10"
                                                required
                                            >
                                                <option value="">Chọn loại môn</option>
                                                {subjectTypes.map((type) => (
                                                    <option key={type.id} value={type.id}>
                                                        {type.name} - {type.academicLevel?.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Khối/lớp */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Khối / Lớp <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.grade}
                                                onChange={(e) => handleInputChange('grade', e.target.value)}
                                                className="appearance-none w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none cursor-pointer text-slate-700 pr-10"
                                                required
                                            >
                                                <option value="">Chọn khối học</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                                                    <option key={grade} value={grade}>Lớp {grade}</option>
                                                ))}
                                                <option value="university">Ôn thi Đại học</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Trạng thái */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Trạng thái vận hành <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="appearance-none w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none cursor-pointer text-slate-700 pr-10"
                                            >
                                                <option value="active">Đang học</option>
                                                <option value="upcoming">Sắp khai giảng</option>
                                                <option value="ended">Đã kết thúc</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Số học sinh tối đa */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Sĩ số tối đa <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            value={formData.maxStudents}
                                            onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none"
                                            placeholder="30"
                                            type="number"
                                            required
                                        />
                                    </div>

                                    {/* Số buổi học/tuần */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Tần suất học (buổi/tuần) <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            value={formData.sessionsPerWeek ?? ''}
                                            onChange={(e) => handleInputChange('sessionsPerWeek', e.target.value)}
                                            className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none"
                                            placeholder="2"
                                            type="number"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* === PHẦN GIÁ VÀ BILLING GỘP CHUNG === */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-slate-100">
                                    {/* Giá và hình thức thanh toán */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            Giá <span className="text-red-400">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                value={formData.price ?? ''}
                                                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                                                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none placeholder:text-slate-300"
                                                placeholder="Nhập giá"
                                                type="number"
                                                min="0"
                                                required
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                                {formData.billingType === 'PER_HOUR' ? 'VNĐ/giờ' : 
                                                 formData.billingType === 'PER_SUBJECT' ? 'VNĐ/môn' : 'VNĐ'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] text-slate-400">Hình thức:</span>
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('billingType', 'PER_HOUR')}
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1 ${
                                                        formData.billingType === 'PER_HOUR'
                                                            ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    <ClockIcon className="w-3 h-3" />
                                                    Theo giờ
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleInputChange('billingType', 'PER_SUBJECT')}
                                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium transition-all flex items-center gap-1 ${
                                                        formData.billingType === 'PER_SUBJECT'
                                                            ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                                                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    <BookIcon className="w-3 h-3" />
                                                    Theo môn
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hình thức trả và số kỳ */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                            <CreditCard className="w-3 h-3" />
                                            Hình thức trả <span className="text-red-400">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentPlanChange('FULL')}
                                                className={`flex-1 h-11 px-3 rounded-xl text-sm font-medium transition-all ${
                                                    formData.paymentPlanType === 'FULL'
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                Trả toàn bộ
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePaymentPlanChange('INSTALLMENT')}
                                                className={`flex-1 h-11 px-3 rounded-xl text-sm font-medium transition-all ${
                                                    formData.paymentPlanType === 'INSTALLMENT'
                                                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                                }`}
                                            >
                                                Trả góp
                                            </button>
                                        </div>
                                        {formData.paymentPlanType === 'INSTALLMENT' && (
                                            <div className="relative mt-1">
                                                <input
                                                    value={formData.installmentCount ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number(e.target.value) : undefined;
                                                        handleInputChange('installmentCount', value);
                                                    }}
                                                    className="w-full h-10 px-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none"
                                                    placeholder="Nhập số kỳ"
                                                    type="number"
                                                    min="1"
                                                    required
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-400">kỳ</span>
                                            </div>
                                        )}
                                        {formData.paymentPlanType === 'FULL' && (
                                            <p className="text-[10px] text-slate-400 px-1">Thanh toán một lần duy nhất</p>
                                        )}
                                        {formData.paymentPlanType === 'INSTALLMENT' && !formData.installmentCount && (
                                            <p className="text-[10px] text-amber-500 px-1">Vui lòng nhập số kỳ trả góp</p>
                                        )}
                                        {formData.paymentPlanType === 'INSTALLMENT' && formData.installmentCount && formData.price && (
                                            <p className="text-[10px] text-green-600 px-1">
                                                Mỗi kỳ: {(formData.price / formData.installmentCount).toLocaleString()} VNĐ
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Hiển thị tổng kết giá */}
                                {formData.price && formData.billingType && (
                                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-700">
                                                {formData.billingType === 'PER_HOUR' ? 'Giá theo giờ' : 'Giá theo môn'}
                                            </span>
                                            <span className="text-lg font-bold text-indigo-700">
                                                {formData.price.toLocaleString()} VNĐ
                                                {formData.billingType === 'PER_HOUR' ? '/giờ' : '/môn'}
                                            </span>
                                        </div>
                                        {formData.paymentPlanType === 'INSTALLMENT' && formData.installmentCount && (
                                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-indigo-200/50">
                                                <span className="text-xs text-slate-500">Chia thành {formData.installmentCount} kỳ</span>
                                                <span className="text-sm font-semibold text-indigo-600">
                                                    {(formData.price / formData.installmentCount).toLocaleString()} VNĐ/kỳ
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Ghi chú */}
                                <div className="flex flex-col gap-2 pt-1">
                                    <label className="text-xs font-semibold text-slate-600 px-1 flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Ghi chú &amp; Lộ trình học tập
                                    </label>
                                    <textarea
                                        value={formData.note}
                                        onChange={(e) => handleInputChange('note', e.target.value)}
                                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none resize-none min-h-[100px]"
                                        placeholder="Nhập các lưu ý về giáo trình, tài liệu tham khảo hoặc lộ trình ôn tập cụ thể cho lớp học này..."
                                    />
                                </div>
                            </section>

                            {/* Instructor & Media Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-slate-100">
                                {/* Teacher Selection */}
                                <section className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
                                            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Giáo viên</h4>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 rounded-full border border-indigo-200 shadow-sm">
                                            <Sparkles className="w-3 h-3" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider">AI Gợi ý</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-5">
                                        {/* AI Suggested Teachers */}
                                        <div className="bg-gradient-to-br from-indigo-50/30 to-white rounded-xl p-4 border border-indigo-100 shadow-sm">
                                            <p className="text-[11px] font-medium text-indigo-500 px-1 mb-3 flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                Đề xuất phù hợp nhất:
                                                {loadingSuggestions && <span className="text-xs text-gray-400 ml-2">Đang tải...</span>}
                                            </p>

                                            {loadingSuggestions ? (
                                                <div className="space-y-1">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="h-5 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                                    ))}
                                                </div>
                                            ) : aiSuggestions.length > 0 ? (
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {aiSuggestions.map((teacher, idx) => (
                                                        <div key={teacher.teacherId} className="relative inline-flex items-center group">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectSuggestion(teacher.teacherId)}
                                                                className={`text-xs font-medium px-2 py-1 rounded-full transition-all whitespace-nowrap ${selectedSuggestion === teacher.teacherId
                                                                        ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                                                                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                                                    }`}
                                                            >
                                                                {teacher.gender ? 'Thầy' : 'Cô'} {teacher.fullName} ({Math.round(teacher.matchScore)}%)
                                                            </button>
                                                            {idx < aiSuggestions.length - 1 && (
                                                                <span className="text-gray-300 text-xs mx-0.5">,</span>
                                                            )}
                                                            
                                                            {/* Tooltip */}
                                                            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute z-50 left-0 top-full mt-2 bg-gray-900 text-white rounded-lg shadow-xl p-3 min-w-[260px] pointer-events-none">
                                                                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                                <div className="space-y-2 text-xs">
                                                                    <div className="flex items-center justify-between border-b border-gray-700 pb-1">
                                                                        <span className="font-semibold text-gray-300">Thông tin chi tiết</span>
                                                                        <span className="text-indigo-300 font-bold">{Math.round(teacher.matchScore)}% phù hợp</span>
                                                                    </div>
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-3 h-3 text-gray-400" />
                                                                            <span className="text-gray-300">Khung trống:</span>
                                                                            <span className="text-white font-medium">{teacher.availableSlots} buổi/tuần</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Users className="w-3 h-3 text-gray-400" />
                                                                            <span className="text-gray-300">Học sinh:</span>
                                                                            <span className="text-white font-medium">{teacher.totalStudents} học sinh</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Award className="w-3 h-3 text-gray-400" />
                                                                            <span className="text-gray-300">Môn đang dạy:</span>
                                                                            <span className="text-white font-medium">{teacher.totalSubjects} môn</span>
                                                                        </div>
                                                                        {teacher.strengths && teacher.strengths.length > 0 && (
                                                                            <div className="pt-1">
                                                                                <div className="text-gray-400 mb-1 text-[10px]">Điểm mạnh:</div>
                                                                                <div className="flex flex-wrap gap-1">
                                                                                    {teacher.strengths.slice(0, 3).map((strength, idx) => (
                                                                                        <span key={idx} className="text-[9px] text-green-300 bg-green-900/50 px-1.5 py-0.5 rounded">
                                                                                            {strength}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {teacher.reason && (
                                                                            <div className="pt-1 border-t border-gray-700 mt-1">
                                                                                <div className="text-gray-400 mb-1 text-[10px]">Lý do đề xuất:</div>
                                                                                <p className="text-gray-300 text-[10px] leading-relaxed italic">
                                                                                    {teacher.reason}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : formData.name && formData.grade ? (
                                                <div className="text-center py-2 text-gray-400 text-xs flex items-center justify-center gap-2">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Không tìm thấy giáo viên phù hợp
                                                </div>
                                            ) : (
                                                <div className="text-center py-2 text-gray-400 text-xs">
                                                    Nhập tên môn và khối lớp để nhận gợi ý
                                                </div>
                                            )}
                                        </div>

                                        {/* Teacher Dropdown */}
                                        <div className="relative">
                                            <select
                                                value={selectedTeacher ?? ''}
                                                onChange={(e) => handleTeacherSelect(Number(e.target.value))}
                                                className="appearance-none w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none cursor-pointer pr-10 text-slate-700"
                                            >
                                                <option value="">
                                                    {loadingTeachers ? 'Đang tải giáo viên...' : 'Chọn giảng viên phụ trách'}
                                                </option>
                                                {teacherList.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {(teacher.gender ? 'Thầy' : 'Cô')} {teacher.fullName} ({teacher.specialty})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 w-4 h-4" />
                                        </div>

                                        {/* Selected Teacher Card */}
                                        {selectedTeacherData && (
                                            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm shrink-0 shadow-sm">
                                                    {getImageSrc(selectedTeacherData.image) ? (
                                                        <img
                                                            src={getImageSrc(selectedTeacherData.image)!}
                                                            alt={selectedTeacherData.fullName}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).parentElement!.innerText = getInitials(selectedTeacherData.fullName);
                                                            }}
                                                        />
                                                    ) : (
                                                        <span>{getInitials(selectedTeacherData.fullName)}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h5 className="text-sm font-semibold text-slate-800">
                                                        {(selectedTeacherData.gender ? 'Thầy' : 'Cô')} {selectedTeacherData.fullName}
                                                    </h5>
                                                    <p className="text-xs text-indigo-500 font-medium mt-0.5">{selectedTeacherData.specialty}</p>
                                                    <div className="flex items-center gap-2 mt-1 text-slate-400">
                                                        <Phone className="w-3 h-3" />
                                                        <span className="text-xs">{selectedTeacherData.phoneNumber}</span>
                                                    </div>
                                                </div>
                                                <button onClick={handleRemoveTeacher} className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200">
                                                    <Delete className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Class Image Section */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
                                        <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider">Ảnh môn học</h4>
                                    </div>

                                    <div className="group relative border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all rounded-xl h-48 flex flex-col items-center justify-center gap-3 cursor-pointer bg-slate-50/50 overflow-hidden">
                                        {previewImage && (
                                            <img src={previewImage} alt="preview" className="absolute inset-0 w-full h-full object-cover z-0" onError={() => setPreviewImage(null)} />
                                        )}
                                        {previewImage && (
                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 z-10 flex items-center justify-center gap-3">
                                                <label className="px-4 py-1.5 bg-white rounded-full text-sm cursor-pointer hover:bg-slate-100 shadow-md border border-slate-200 font-medium text-slate-700 transition-all">
                                                    Đổi ảnh
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                                                </label>
                                                <button type="button" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 shadow-md transition-all">
                                                    Xóa
                                                </button>
                                            </div>
                                        )}
                                        {!previewImage && (
                                            <>
                                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all text-indigo-400 z-10 border border-slate-100">
                                                    <CloudUpload className="w-6 h-6" />
                                                </div>
                                                <div className="text-center z-10">
                                                    <p className="text-sm font-medium text-slate-700">Tải lên ảnh môn học</p>
                                                    <p className="text-[11px] text-slate-400 mt-1">PNG hoặc JPG (Tối đa 2MB)</p>
                                                </div>
                                            </>
                                        )}
                                        {!previewImage && (
                                            <input className="absolute inset-0 opacity-0 cursor-pointer z-20" type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                                        )}
                                    </div>

                                    <div className="relative">
                                        <Link className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                                        <input
                                            value={formData.imageUrl || ''}
                                            onChange={(e) => handleImageUrlChange(e.target.value)}
                                            className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-sm outline-none placeholder:text-slate-300"
                                            placeholder="Hoặc nhập URL ảnh trực tiếp..."
                                            type="text"
                                        />
                                    </div>
                                </section>
                            </div>

                            {/* Modal Footer */}
                            <div className="pt-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 shrink-0">
                                <button type="button" onClick={onClose} className="px-6 h-10 rounded-xl text-sm font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="px-8 h-10 rounded-xl text-sm font-medium text-white btn-gradient hover:from-indigo-700 hover:to-indigo-800 shadow-md hover:shadow-indigo-200/50 transition-all active:scale-95 flex items-center gap-2 group">
                                    <BadgePlus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                                    {mode === "update" ? "Lưu thay đổi" : "Tạo lớp học"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default AddClassModal;