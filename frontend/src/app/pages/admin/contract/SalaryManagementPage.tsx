// src/app/salary/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { teacherSubjectApi } from '../../../utils/api/teacherSubject.api';
import { SalaryToolbar } from '../../../components/adminComponents/salary/SalaryToolbar';
import { TeacherList } from '../../../components/adminComponents/salary/TeacherList';
import { TeacherAgreementDetail } from '../../../components/adminComponents/salary/TeacherAgreementDetail';
import { SalaryPagination } from '../../../components/adminComponents/salary/SalaryPagination';
import { SalaryAgreementModal } from '../../../components/adminComponents/salary/SalaryAgreementModal';
import type { TeacherSubject, TeacherSubjectRequest } from '../../../utils/types/teacherSubject';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
    TrendingUp, 
    Users, 
    Clock, 
    Sparkles
} from 'lucide-react';

export function SalaryManagementPage() {
    const { setAlert } = useOutletContext<any>();
    const navigate = useNavigate();
    const [agreements, setAgreements] = useState<TeacherSubject[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<number | undefined>();
    const [selectedGrade, setSelectedGrade] = useState<number | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgreement, setEditingAgreement] = useState<TeacherSubject | null>(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [greeting, setGreeting] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const itemsPerPage = 8;

    // Lấy lời chào theo giờ
    const getGreetingByTime = () => {
        const now = new Date();
        const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
        const hour = vietnamTime.getHours();

        if (hour >= 5 && hour < 10) return "Chào buổi sáng";
        if (hour >= 10 && hour < 12) return "Chào buổi trưa";
        if (hour >= 12 && hour < 14) return "Chào buổi chiều";
        if (hour >= 14 && hour < 18) return "Chào buổi chiều tốt lành";
        if (hour >= 18 && hour < 22) return "Chào buổi tối";
        return "Chào buổi đêm";
    };

    const getCurrentVietnamTime = () => {
        const now = new Date();
        const vietnamTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
        return vietnamTime.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        const updateGreetingAndTime = () => {
            setGreeting(getGreetingByTime());
            setCurrentTime(getCurrentVietnamTime());
        };

        updateGreetingAndTime();
        const interval = setInterval(updateGreetingAndTime, 60000);

        return () => clearInterval(interval);
    }, []);

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

    const headerVariants: Variants = {
        hidden: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const contentVariants: Variants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 15,
            },
        },
    };

    const listVariants: Variants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 90,
                damping: 12,
                delay: 0.3,
            },
        },
    };

    // Nhóm các thỏa thuận theo giáo viên
    const getTeacherGroups = useCallback(() => {
        const groups: { [key: number]: { teacherId: number; teacherName: string; teacherAvatar?: string; agreements: TeacherSubject[] } } = {};
        
        (agreements || []).forEach(agreement => {
            if (!groups[agreement.teacherId]) {
                groups[agreement.teacherId] = {
                    teacherId: agreement.teacherId,
                    teacherName: agreement.teacherName,
                    teacherAvatar: agreement.teacherAvatar,
                    agreements: []
                };
            }
            groups[agreement.teacherId].agreements.push(agreement);
        });
        
        return Object.values(groups);
    }, [agreements]);

    const fetchAgreements = useCallback(async () => {
        setLoading(true);
        try {
            const data = await teacherSubjectApi.getAll({
                teacherName: searchQuery || undefined,
                subjectName: undefined,
                grade: selectedGrade,
            });
            let filtered = Array.isArray(data) ? data : [];
            if (selectedSubjectId) {
                filtered = filtered.filter(a => a.subjectId === selectedSubjectId);
            }
            if (searchQuery) {
                filtered = filtered.filter(a =>
                    a.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            setAgreements(filtered);
            setCurrentPage(1);
            if (selectedTeacherId && !filtered.some(a => a.teacherId === selectedTeacherId)) {
                setSelectedTeacherId(null);
            }
        } catch (error: any) {
            console.error('Fetch error:', error);
            setAlert?.({ type: 'error', message: error.response?.data?.message || 'Không thể tải dữ liệu' });
            setAgreements([]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedSubjectId, selectedGrade, setAlert, selectedTeacherId]);

    useEffect(() => {
        fetchAgreements();
    }, [fetchAgreements]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bạn có chắc muốn xóa thỏa thuận này?')) return;
        try {
            const res = await teacherSubjectApi.delete(id);
            if (!res || res.errCode === 0 || res.code === 0 || res.success === true) {
                setAlert?.({ type: 'success', message: 'Xóa thành công' });
                fetchAgreements();
            } else {
                setAlert?.({ type: 'error', message: res?.message || 'Xóa thất bại' });
            }
        } catch (error: any) {
            setAlert?.({ type: 'error', message: error.response?.data?.message || 'Xóa thất bại' });
        }
    };

    const handleAdd = () => {
        setEditingAgreement(null);
        setIsModalOpen(true);
    };

    const handleEdit = (agreement: TeacherSubject) => {
        setEditingAgreement(agreement);
        setIsModalOpen(true);
    };

    const handleSave = async (data: TeacherSubjectRequest) => {
        try {
            let res;
            if (editingAgreement) {
                res = await teacherSubjectApi.update(editingAgreement.id, data);
            } else {
                res = await teacherSubjectApi.create(data);
            }
            if (res.errCode === 0) {
                setAlert?.({ type: 'success', message: editingAgreement ? 'Cập nhật thành công' : 'Thêm thành công' });
                setIsModalOpen(false);
                fetchAgreements();
            } else {
                setAlert?.({ type: 'error', message: res?.message || 'Lưu thất bại' });
            }
        } catch (error: any) {
            setAlert?.({ type: 'error', message: error.response?.data?.message || 'Lưu thất bại' });
        }
    };

    const handleTeacherClick = (teacherId: number) => {
        navigate(`/admin/teacher/${teacherId}`);
    };

    const handleAgreementClick = (agreementId: number) => {
        navigate(`/admin/teacher-subject/${agreementId}`);
    };

    const teacherGroups = getTeacherGroups();
    const paginatedTeachers = teacherGroups.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(teacherGroups.length / itemsPerPage);

    const selectedTeacher = selectedTeacherId 
        ? teacherGroups.find(g => g.teacherId === selectedTeacherId)
        : null;

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen"
        >
            {/* Header Section với gradient và sóng phủ xuống SalaryToolbar */}
            <section className="relative overflow-visible bg-white pb-8"> {/* Tăng pb để sóng kéo dài */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200 opacity-30"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-sky-300 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                
                {/* Gradient phủ xuống thêm phần dưới */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-white/80 pointer-events-none"></div>

                {/* Sóng kéo dài xuống */}
                <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
                    <svg 
                        className="relative w-full h-auto" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 1440 320"
                        preserveAspectRatio="none"
                    >
                        <path 
                            fill="#f3f5f7" 
                            fillOpacity="0.9" 
                            d="M0,320L48,300C96,280,192,240,288,230C384,220,480,240,576,245C672,250,768,240,864,230C960,220,1056,200,1152,190C1248,180,1344,180,1392,180L1440,180L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>

                <motion.div
                    variants={headerVariants}
                    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10"
                >
                    <motion.div
                        variants={contentVariants}
                        className="relative overflow-hidden"
                    >
                        <div className="relative px-6 pt-8 lg:px-8">
                            {/* Phần chào và thời gian */}
                            <div className="w-full flex flex-col space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 px-3 py-1.5">
                                            <Sparkles size={14} className="text-indigo-500" />
                                            <span className="text-indigo-500 text-xs font-medium">Quản trị viên</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full">
                                            <Clock size={14} className="text-gray-500" />
                                            <span className="text-gray-600 text-sm">{currentTime}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold tracking-tight">
                                                {greeting}, <span className="bg-clip-text text-transparent gradient-text">Quản trị viên!</span>
                                            </h1>
                                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                                <span>Chào mừng bạn quay trở lại</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp size={14} className="text-blue-500" />
                                                    Đây là trang quản lý thỏa thuận lương
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Salary Toolbar - Nằm trong vùng gradient và sóng */}
                <div className="relative z-20 mt-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SalaryToolbar
                            searchQuery={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            selectedSubjectId={selectedSubjectId}
                            onSubjectChange={setSelectedSubjectId}
                            selectedGrade={selectedGrade}
                            onGradeChange={setSelectedGrade}
                            onAddAgreement={handleAdd}
                            onClearFilters={() => {
                                setSearchQuery('');
                                setSelectedSubjectId(undefined);
                                setSelectedGrade(undefined);
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <motion.div
                variants={listVariants}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 " 
            >
                {loading ? (
                    <div className="text-center py-20">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Danh sách giáo viên */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <h2 className="font-semibold text-gray-700">
                                        Danh sách giáo viên ({teacherGroups.length})
                                    </h2>
                                </div>
                                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                                    {paginatedTeachers.map((teacher) => (
                                        <TeacherList
                                            key={teacher.teacherId}
                                            teacher={teacher}
                                            isSelected={selectedTeacherId === teacher.teacherId}
                                            onSelect={setSelectedTeacherId}
                                            onTeacherClick={handleTeacherClick}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="p-4 border-t border-gray-100">
                                        <SalaryPagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chi tiết thỏa thuận của giáo viên */}
                        <div className="lg:col-span-2">
                            {selectedTeacher ? (
                                <TeacherAgreementDetail
                                    teacher={selectedTeacher}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onAddAgreement={handleAdd}
                                    onViewAll={() => handleTeacherClick(selectedTeacher.teacherId)}
                                    onAgreementClick={handleAgreementClick}
                                />
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Chọn giáo viên để xem chi tiết</h3>
                                    <p className="text-gray-400 text-sm">Vui lòng chọn một giáo viên từ danh sách bên trái để xem các thỏa thuận lương</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            <SalaryAgreementModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingAgreement}
                isEdit={!!editingAgreement}
            />
        </motion.main>
    );
}