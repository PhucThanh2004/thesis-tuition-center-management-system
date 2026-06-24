import { useState, useEffect } from "react";
import {
    Layers,
    PlayCircle,
    CalendarCheck,
    Users,
    Clock,
    Calendar,
    Search,
    ChevronDown,
    BarChart,
    PieChart,
    Loader2,
    Filter,
    X,
    ArrowRight,
    ChevronRight,
    Sparkles,
    TrendingUp,
    Shield,
    MapPin,
    AlertCircle,
} from "lucide-react";
import type { Subject } from "../../utils/types/subject";
import { getImageSrc, getInitials } from "../../utils/helpers";
import { subjectApi, teacherApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { teacherScheduleApi } from "../../utils/api/teacherSchedule.api";
import type { TeacherSchedule as TeacherScheduleType } from "../../utils/types/teacherSchedule";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d';

// Kích hoạt module 3D cho Highcharts
if (typeof Highcharts === 'object') {
    const initialize3d = highcharts3d as any;
    if (typeof initialize3d === 'function') {
        initialize3d(Highcharts);
    } else if (initialize3d && typeof initialize3d.default === 'function') {
        initialize3d.default(Highcharts);
    }
}

const bluePalette = ['#224D7A', '#417BB9', '#A8C7E5', '#7BB0DF'];

// Bảng màu cho các card lớp học
const palettes = [
    { bg: "bg-purple-50", text: "text-violet-600", bar: "bg-violet-500" },
    { bg: "bg-blue-50", text: "text-blue-600", bar: "bg-blue-500" },
    { bg: "bg-emerald-50", text: "text-emerald-600", bar: "bg-emerald-500" },
    { bg: "bg-orange-50", text: "text-orange-600", bar: "bg-orange-500" },
    { bg: "bg-rose-50", text: "text-rose-600", bar: "bg-rose-500" },
];

const formatTime = (start: string, end: string) => `${start.slice(0, 5)} - ${end.slice(0, 5)}`;

const getTimeRemaining = (date: string, time: string) => {
    const now = new Date();
    const sessionDate = new Date(`${date}T${time}`);
    const diffMs = sessionDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours <= 0) return 'Đang diễn ra';
    if (diffHours < 24) return `Còn ${diffHours} giờ`;
    return `Còn ${Math.floor(diffHours / 24)} ngày`;
};

const formatDateFull = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};


interface ClassCardProps {
    subject: Subject;
    palette: { bg: string; text: string; bar: string };
}

// Component hiển thị thông tin chi tiết của một lớp học dạng card
const ClassCard = ({ subject, palette }: ClassCardProps) => {
    const navigate = useNavigate();
    const teacher = subject.teacherSubjects?.[0]?.teacher;
    const teacherImage = getImageSrc(teacher?.user?.image);
    const subjectImage = getImageSrc(subject.image);

    const current = Number(subject.currentStudents) || 0;
    const max = Number(subject.maxStudents) || 0;

    const percent = max > 0
        ? Math.min(100, Math.round((current / max) * 100))
        : 0;

    // Xác định màu sắc cho thanh tiến trình dựa trên tỷ lệ lấp đầy
    const getProgressClass = () => {
        if (percent >= 80) return 'gradient-secondary';
        if (percent >= 50) return 'gradient-primary';
        if (percent >= 30) return 'gradient-accent';
        return 'gradient-danger';
    };

    // Xác định style badge trạng thái lớp học
    const getStatusStyle = () => {
        switch (subject.status) {
            case "active":
                return { bg: "bg-white/95 backdrop-blur-sm text-emerald-600 border-emerald-200", text: "ĐANG HỌC", dot: "bg-emerald-500" };
            case "upcoming":
                return { bg: "bg-white/95 backdrop-blur-sm text-indigo-600 border-indigo-200", text: "SẮP KHAI GIẢNG", dot: "bg-indigo-500" };
            default:
                return { bg: "bg-white/95 backdrop-blur-sm text-slate-500 border-slate-200", text: "KẾT THÚC", dot: "bg-slate-400" };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <div
            onClick={() => navigate(`/teacher/class/${subject.id}`)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer relative"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-indigo-400/15 group-hover:via-purple-400/15 group-hover:to-pink-400/15 transition-all duration-500 rounded-2xl pointer-events-none" />

            {/* Phần ảnh đại diện của lớp */}
            <div className="relative h-28 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                {subjectImage ? (
                    <>
                        <img
                            src={subjectImage}
                            alt={subject.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x150?text=No+Image";
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                        <svg className="w-12 h-12 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Badge trạng thái lớp học */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full ${statusStyle.bg} border shadow-sm`}>
                    <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        <span className="font-bold text-[9px] leading-none tracking-wide">
                            {statusStyle.text}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nội dung thông tin lớp học */}
            <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
                            {subject.name}
                        </h3>
                        {subject.subjectType && (
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {subject.subjectType.name} - {subject.subjectType.academicLevel?.name}
                            </p>
                        )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg bg-gradient-to-r ${palette.bg} shadow-sm flex items-center justify-center ml-2`}>
                        <span className={`font-bold text-[9px] ${palette.text}`}>
                            Khối {subject.grade}
                        </span>
                    </span>
                </div>

                {/* Thông tin giáo viên */}
                <div className="flex items-center gap-2 py-2 border-t border-b border-slate-50 mb-2">
                    <div className="relative">
                        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center font-bold text-white text-[9px] btn-gradient shadow-md shrink-0">
                            {getImageSrc(teacherImage) ? (
                                <img
                                    src={getImageSrc(teacher?.user?.image)!}
                                    alt={teacher?.user?.fullName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        (e.target as HTMLImageElement).parentElement!.innerText = getInitials(teacher?.user?.fullName);
                                    }}
                                />
                            ) : (
                                <span>{getInitials(teacher?.user?.fullName)}</span>
                            )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-[10px] truncate">
                            {teacher?.user?.fullName || "Chưa sắp xếp"}
                        </p>
                        <p className="text-slate-400 text-[9px] truncate">
                            {teacher?.specialty || "Giáo viên"}
                        </p>
                    </div>
                </div>

                {/* Lịch học và học phí */}
                <div className="flex gap-2 mb-3">
                    <div className="flex-1 bg-gradient-to-br from-slate-50 to-white rounded-lg p-1.5 border border-slate-100">
                        <p className="text-slate-400 font-bold text-[8px] mb-0.5 uppercase tracking-wider">LỊCH HỌC</p>
                        <p className="font-medium text-slate-800 text-[10px] flex items-center gap-1">
                            <Clock size={10} className="text-indigo-500" />
                            {subject.sessionsPerWeek} buổi/tuần
                        </p>
                    </div>
                </div>

                {/* Thanh tiến trình sĩ số */}
                <div className="mb-3">
                    <div className="flex justify-between mb-1">
                        <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Sĩ số</span>
                        <span className={`font-bold text-[10px] ${percent === 100 ? "text-emerald-600" : "text-slate-800"}`}>
                            {percent === 100
                                ? `Đầy (${subject.currentStudents}/${subject.maxStudents})`
                                : `${subject.currentStudents}/${subject.maxStudents} (${percent}%)`}
                        </span>
                    </div>
                    <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out group-hover:shadow-md ${getProgressClass()}`}
                            style={{
                                width: `${percent}%`,
                                minWidth: percent > 0 ? '2px' : '0'
                            }}
                        />
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                </div>

                {/* Ghi chú của lớp học */}
                {subject.note && (
                    <div className="p-2 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-lg border border-indigo-100/50">
                        <p className="text-slate-500 font-bold text-[9px] mb-0.5 uppercase tracking-wider">GHI CHÚ</p>
                        <p className="text-slate-600 text-[10px] italic line-clamp-1 group-hover:line-clamp-none transition-all duration-300" title={subject.note}>
                            {subject.note}
                        </p>
                    </div>
                )}

                {!subject.note && (
                    <div className="p-2 bg-slate-50/50 rounded-lg">
                        <p className="text-slate-400 font-bold text-[9px] mb-0.5 uppercase tracking-wider">GHI CHÚ</p>
                        <p className="text-slate-400 text-[10px] italic">Không có ghi chú</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TeacherClassListPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // State cho teacherId 
    const [teacherIdForSchedule, setTeacherIdForSchedule] = useState<number | null>(null);
    const [loadingTeacherId, setLoadingTeacherId] = useState(true);
    const [teacherIdError, setTeacherIdError] = useState<string | null>(null);

    // State quản lý dữ liệu lớp học 
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [stats, setStats] = useState({ all: 0, active: 0, upcoming: 0, ended: 0 });

    // State cho bộ lọc và tìm kiếm
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [levelFilter, setLevelFilter] = useState<string>("");

    // State riêng cho dữ liệu biểu đồ - KHÔNG BỊ ẢNH HƯỞNG BỞI BỘ LỌC
    const [chartData, setChartData] = useState({
        levelData: [] as { name: string; y: number; sliced?: boolean; slicedOffset?: number }[],
        totalSubjectsCount: 0,
        fillRateData: [] as { name: string; value: number; displayValue: string }[]
    });

    // State cho lịch dạy sắp tới
    const [upcomingSchedules, setUpcomingSchedules] = useState<TeacherScheduleType[]>([]);
    const [loadingSchedules, setLoadingSchedules] = useState(false);
    const [upcomingError, setUpcomingError] = useState<string | null>(null);

    const classesPerPage = 12;

    useEffect(() => {
        const fetchTeacherId = async () => {
            if (authLoading) return;

            if (!user) {
                setLoadingTeacherId(false);
                setTeacherIdError("Vui lòng đăng nhập để xem lịch");
                return;
            }

            setLoadingTeacherId(true);
            setTeacherIdError(null);

            try {
                const response = await teacherApi.getTeacherIdByUserId(user.id);
                if (response.teacherId) {
                    setTeacherIdForSchedule(response.teacherId);
                } else {
                    setTeacherIdForSchedule(null);
                    setTeacherIdError(response.message || "Không tìm thấy thông tin giáo viên");
                }
            } catch (error: any) {
                console.error('Lỗi khi lấy teacherId:', error);
                setTeacherIdForSchedule(null);
                setTeacherIdError(error.response?.data?.message || "Có lỗi xảy ra khi lấy thông tin giáo viên");
            } finally {
                setLoadingTeacherId(false);
            }
        };

        fetchTeacherId();
    }, [user, authLoading]);

    const formatDateForApi = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    // fetch danh sách lớp học 
    const fetchSubjects = async () => {
        if (!user?.id) {
            return;
        }
        setLoading(true);
        try {
            const response = await subjectApi.getSubjectsByTeacher(
                user.id,
                currentPage,
                classesPerPage,
                statusFilter || undefined
            );
            if (response.success) {
                setSubjects(response.data);
                setTotalPages(response.totalPages);
                setTotalSubjects(response.total);
                setStats(response.stats);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách lớp học:", error);
        } finally {
            setLoading(false);
        }
    };

    // fetch lịch dạy sắp tới
    const fetchUpcomingSchedules = async () => {

        if (!teacherIdForSchedule) {
            return;
        }

        setLoadingSchedules(true);
        setUpcomingError(null);

        try {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);

            const startDate = formatDateForApi(today);
            const endDate = formatDateForApi(nextWeek);

            const data = await teacherScheduleApi.getSchedule(teacherIdForSchedule, {
                startDate,
                endDate
            });

            // Lọc các session trong tương lai (từ hôm nay trở đi)
            const todayStr = formatDateForApi(today);

            const futureSchedules = data.filter(session => {
                const isFuture = session.sessionDate >= todayStr;
                const isNotCanceled = session.status !== 'canceled';
                const isNotCompleted = session.status !== 'completed';
                const isNotExpired = session.status !== 'expired';

                return isFuture && isNotCanceled && isNotCompleted && isNotExpired;
            });

            // Sắp xếp theo ngày và giờ
            const sorted = futureSchedules.sort((a, b) => {
                if (a.sessionDate !== b.sessionDate) {
                    return a.sessionDate.localeCompare(b.sessionDate);
                }
                return a.startTime.localeCompare(b.startTime);
            });

            const limited = sorted.slice(0, 5);

            setUpcomingSchedules(limited);


        } catch (error) {
            console.error('Lỗi khi tải lịch dạy sắp tới:', error);
            setUpcomingError('Không thể tải lịch dạy');
        } finally {
            setLoadingSchedules(false);
        }
    };

    // Fetch subjects 
    useEffect(() => {
        if (user?.id) {
            fetchSubjects();
        }
    }, [currentPage, statusFilter, user?.id]);

    useEffect(() => {
        if (teacherIdForSchedule) {
            fetchUpcomingSchedules();
        }
    }, [teacherIdForSchedule]);

    const fetchChartData = async () => {
        if (!user?.id) return;
        try {
            const response = await subjectApi.getSubjectsByTeacher(
                user.id,
                1,
                1000,
                undefined
            );

            if (response.success) {
                const allSubjects = response.data;

                const levelMap = new Map<string, number>();
                allSubjects.forEach((sub: Subject) => {
                    const levelName = sub.subjectType?.academicLevel?.name || "Chưa phân cấp";
                    levelMap.set(levelName, (levelMap.get(levelName) || 0) + 1);
                });
                const levelData = Array.from(levelMap.entries()).map(([name, value]) => ({
                    name,
                    y: value,
                    sliced: true,
                    slicedOffset: 12
                }));

                const fillRateData = [...allSubjects]
                    .map((s: Subject) => {
                        const current = Number(s.currentStudents) || 0;
                        const max = Number(s.maxStudents) || 1;
                        const fillRate = Math.round((current / max) * 100);
                        return {
                            name: s.name,
                            value: fillRate,
                            displayValue: `${current}/${max}`
                        };
                    })
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6);

                setChartData({
                    levelData,
                    totalSubjectsCount: allSubjects.length,
                    fillRateData
                });
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        }
    };

    useEffect(() => {
        if (user?.id) {
            fetchChartData();
        }
    }, [user?.id]);

    // Lọc danh sách lớp học theo tìm kiếm và bộ lọc khối
    const filteredSubjects = subjects.filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchLevel = levelFilter ? s.grade === levelFilter : true;
        return matchSearch && matchLevel;
    });

    // Phân trang cho danh sách đã lọc
    const totalFilteredPages = Math.ceil(filteredSubjects.length / classesPerPage);
    const paginatedSubjects = filteredSubjects.slice(
        (currentPage - 1) * classesPerPage,
        currentPage * classesPerPage
    );

    // Dữ liệu cho biểu đồ cột (lấy từ chartData - CỐ ĐỊNH)
    const subjectChartData = chartData.fillRateData;
    const maxFillRate = Math.max(...subjectChartData.map(d => d.value), 100);
    const chartHeight = 160;

    // Các card thống kê nhanh
    const summaryCards = [
        { label: "Lớp đang dạy", value: stats.all, icon: Layers, bgColor: "bg-purple-50", iconColor: "text-purple-600" },
        { label: "Đang hoạt động", value: stats.active, icon: PlayCircle, bgColor: "bg-teal-50", iconColor: "text-teal-600" },
        { label: "Sắp khai giảng", value: stats.upcoming, icon: CalendarCheck, bgColor: "bg-blue-50", iconColor: "text-blue-600" },
        { label: "Đã kết thúc", value: stats.ended, icon: Users, bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    ];

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, levelFilter, statusFilter]);

    // Đếm số bộ lọc đang active
    const getActiveFilterCount = () => {
        let count = 0;
        if (statusFilter) count++;
        if (levelFilter) count++;
        if (searchQuery) count++;
        return count;
    };

    // Xóa tất cả bộ lọc
    const clearAllFilters = () => {
        setStatusFilter("");
        setLevelFilter("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    // Xóa từng bộ lọc cụ thể
    const clearFilter = (key: string) => {
        if (key === 'status') setStatusFilter("");
        if (key === 'level') setLevelFilter("");
        if (key === 'search') setSearchQuery("");
        setCurrentPage(1);
    };

    // Cấu hình biểu đồ tròn 3D
    const pie3dOptions: Highcharts.Options = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            options3d: {
                enabled: true,
                alpha: 60,
                beta: 0
            },
            height: '240px',
            margin: [0, 0, 0, 0]
        },
        title: { text: undefined },
        accessibility: { enabled: false },
        credits: { enabled: false },
        colors: bluePalette,
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                depth: 32,
                dataLabels: {
                    enabled: true,
                    format: '{point.percentage:.0f}%',
                    distance: -30,
                    style: {
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '600',
                        textOutline: 'none'
                    }
                },
                showInLegend: false,
            }
        },
        series: [{
            type: 'pie',
            name: 'Số lượng lớp',
            data: chartData.levelData,
        }],
        tooltip: {
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            borderRadius: 12,
            borderWidth: 0,
            shadow: true,
            style: {
                color: '#f1f5f9',
                fontSize: '11px',
                fontFamily: 'inherit',
                padding: '0px'
            },
            padding: 8,
            useHTML: true,
            formatter: function (this: any) {
                const point = this.point;
                const percentage = point.percentage?.toFixed(1);
                const color = point.color;

                return `
                    <div style="padding: 4px 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <div style="width: 10px; height: 10px; border-radius: 50%; background-color: ${color}; box-shadow: 0 0 0 1px rgba(255,255,255,0.2);"></div>
                            <span style="font-size: 12px; font-weight: 600; color: #ffffff;">${point.name}</span>
                        </div>
                        <div style="display: flex; gap: 12px; margin-top: 4px;">
                            <div>
                                <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Số lớp</span>
                                <div style="font-size: 16px; font-weight: 700; color: #ffffff;">${point.y}</div>
                            </div>
                            <div>
                                <span style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">Tỷ lệ</span>
                                <div style="font-size: 16px; font-weight: 700; color: ${color};">${percentage}%</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    };

    if (authLoading || loadingTeacherId) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (teacherIdError) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center p-8">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Không thể tải lịch dạy</h3>
                <p className="text-gray-600 max-w-md mb-6">{teacherIdError}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                >
                    Thử lại
                </button>
            </div>
        );
    }


    // Main render
    return (
        <main className=" min-h-screen">
            <section className="relative overflow-visible bg-white">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200 opacity-30"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-sky-300 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

                <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0">
                    <svg
                        className="relative w-full h-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 250"
                        preserveAspectRatio="none"
                    >
                        <path
                            fill="#f3f5f7"
                            fillOpacity="0.9"
                            d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,138.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <div className="relative overflow-hidden">
                        <div className="relative px-6 py-6 lg:px-8">
                            {/* Dashboard tổng quan*/}
                            <div className="w-full flex flex-col space-y-6">
                                {/* Phần tiêu đề và tìm kiếm */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-2 px-3 py-1.5">
                                            <Sparkles size={14} className="text-indigo-500" />
                                            <span className="text-indigo-500 text-xs font-medium">Giáo viên</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full">
                                            <Clock size={14} className="text-gray-500" />
                                            <span className="text-gray-600 text-sm">
                                                {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold tracking-tight">
                                                Lớp học của tôi
                                            </h1>
                                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                                                <span>Chào mừng bạn quay trở lại</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="flex items-center gap-1">
                                                    <TrendingUp size={14} className="text-blue-500" />
                                                    Quản lý lớp học của bạn
                                                </span>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Tìm kiếm lớp học..."
                                                    className="peer w-80 pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-xl text-sm text-gray-700 outline-none border border-gray-200 focus:ring-2 focus:ring-indigo-400/50 transition-all placeholder:text-gray-400"
                                                />
                                                <Search
                                                    size={18}
                                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors peer-focus:text-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thống kê nhanh */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Users size={18} className="text-indigo-500" />
                                                <h3 className="font-semibold text-gray-900">Tổng quan nhanh</h3>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-3">
                                            {summaryCards.map((card, idx) => {
                                                const Icon = card.icon;
                                                return (
                                                    <div key={idx} className="p-2.5 bg-gray-50 rounded-xl">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`p-1 rounded-lg ${card.bgColor}`}>
                                                                <Icon size={14} className={card.iconColor} />
                                                            </div>
                                                        </div>
                                                        <p className="text-xl font-bold text-gray-900">
                                                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : card.value}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">{card.label}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-sm border border-white/50 flex flex-col">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="relative">
                                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Trạng thái hệ thống</span>
                                        </div>

                                        <p className="text-gray-900 font-bold text-base mb-1.5">Hoạt động ổn định</p>
                                        <p className="text-sm text-gray-600 leading-relaxed mb-2.5">
                                            Tất cả các dịch vụ đang hoạt động bình thường.
                                        </p>

                                        <div className="mb-2.5">
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                                <span>Hiệu suất hệ thống</span>
                                                <span className="font-medium text-green-600">98%</span>
                                            </div>
                                            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-2 rounded-full w-[98%]"
                                                    style={{ background: 'linear-gradient(to right, #22c55e, #10b981)' }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-auto px-4 py-2 bg-white/80 hover:bg-white rounded-xl text-sm font-medium text-gray-700 transition-all flex items-center justify-center gap-2 group">
                                            <Shield size={14} />
                                            <span>Kiểm tra bảo mật</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần nội dung chính */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        {/* Khu vực biểu đồ  */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Biểu đồ tỷ lệ lấp đầy lớp học */}
                            <div className="lg:col-span-2 flex">
                                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full">
                                    <div className="p-4">
                                        <div className="mb-10">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-indigo-100 rounded-lg shadow-sm">
                                                        <BarChart size={14} className="text-indigo-500" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        Tỷ lệ lấp đầy lớp học
                                                    </h3>
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Hiệu suất tuyển sinh theo từng lớp</p>
                                        </div>

                                        <div className="relative mt-2">
                                            <div className="absolute left-0 right-0 h-full flex flex-col justify-between pointer-events-none">
                                                {[100, 75, 50, 25, 0].map((line) => (
                                                    <div key={line} className="relative">
                                                        <div className="border-t border-slate-100"></div>
                                                        <span className="absolute -left-2 -top-2 text-[9px] text-slate-400">{line}%</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="h-44 flex items-end justify-between gap-2 ml-6">
                                                {subjectChartData.map((subject, idx) => {
                                                    const barHeight = (subject.value / maxFillRate) * chartHeight;
                                                    const isHigh = subject.value >= 80;
                                                    const isMedium = subject.value >= 50 && subject.value < 80;
                                                    const isLow = subject.value < 50;

                                                    let barColor = "from-emerald-500 to-emerald-400";
                                                    let barBg = "bg-emerald-100";
                                                    if (isMedium) {
                                                        barColor = "from-blue-500 to-blue-400";
                                                        barBg = "bg-blue-100";
                                                    } else if (isLow) {
                                                        barColor = "from-amber-500 to-amber-400";
                                                        barBg = "bg-amber-100";
                                                    }

                                                    return (
                                                        <div key={idx} className="flex flex-col items-center flex-1 group">
                                                            <div className="relative w-full flex justify-center">
                                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 w-max max-w-[160px] 
                                                                        bg-slate-800 text-white text-[10px] px-2 py-1 rounded-lg shadow-lg 
                                                                        pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 
                                                                        flex items-center gap-1.5 whitespace-nowrap">
                                                                    <span className="font-semibold">{subject.name}</span>
                                                                    <span className="text-emerald-400">{subject.displayValue}</span>
                                                                    <span>({subject.value}%)</span>
                                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                                                </div>

                                                                <div
                                                                    className={`w-10 rounded-t-lg transition-all duration-500 ease-out cursor-pointer relative overflow-hidden shadow-sm group-hover:shadow-md ${barBg}`}
                                                                    style={{ height: `${Math.max(barHeight, 4)}px` }}
                                                                >
                                                                    <div
                                                                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${barColor} transition-all duration-500`}
                                                                        style={{ height: `${subject.value}%` }}
                                                                    >
                                                                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                                    </div>
                                                                    {subject.value >= 25 && (
                                                                        <span className="absolute bottom-1 left-0 right-0 text-center text-white font-bold text-[9px] drop-shadow-sm z-10">
                                                                            {subject.value}%
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className="mt-1.5 text-[9px] text-slate-500 font-medium truncate w-full text-center px-1">
                                                                {subject.name.length > 10 ? subject.name.slice(0, 8) + '…' : subject.name}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-[8px] text-slate-500">Tốt (≥80%)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="text-[8px] text-slate-500">Trung bình (50-79%)</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <span className="text-[8px] text-slate-500">Cần cải thiện (&lt;50%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Biểu đồ phân bố lớp học theo cấp */}
                            <div className="lg:col-span-1 flex">
                                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden w-full">
                                    <div className="p-4">
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-indigo-100 rounded-lg shadow-sm">
                                                        <PieChart size={14} className="text-indigo-500" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-slate-800">
                                                        Phân bố lớp học
                                                    </h3>
                                                </div>
                                                <div className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    {chartData.totalSubjectsCount} lớp
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">Chi tiết theo cấp học</p>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-full h-[220px]">
                                                {chartData.levelData.length > 0 ? (
                                                    <HighchartsReact highcharts={Highcharts} options={pie3dOptions} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                                                        Đang tải dữ liệu...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần bộ lọc */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-lg shadow-slate-100/50">
                            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm">
                                        <Filter size="16" className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-slate-800 text-base tracking-tight">
                                            Bộ lọc lớp học
                                        </h2>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            Tìm kiếm và lọc danh sách lớp theo tiêu chí
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block mb-1.5 ml-1">
                                        TRẠNG THÁI
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/80 px-3 py-2.5 text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Mọi trạng thái</option>
                                            <option value="active">Đang học</option>
                                            <option value="upcoming">Sắp khai giảng</option>
                                            <option value="ended">Kết thúc</option>
                                        </select>
                                        <ChevronDown size="14" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block mb-1.5 ml-1">
                                        KHỐI LỚP
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={levelFilter}
                                            onChange={(e) => setLevelFilter(e.target.value)}
                                            className="w-full bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/80 px-3 py-2.5 text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all duration-200 cursor-pointer"
                                        >
                                            <option value="">Tất cả khối</option>
                                            {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                                                <option key={grade} value={String(grade)}>Khối {grade}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size="14" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-500 font-medium text-[10px] uppercase tracking-wider block mb-1.5 ml-1">
                                        TÌM KIẾM
                                    </label>
                                    <div className="relative group">
                                        <Search size="14" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Nhập tên lớp..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-white rounded-xl border border-slate-200/80 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hiển thị các bộ lọc đang được áp dụng */}
                            {getActiveFilterCount() > 0 && (
                                <div className="mt-5 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100/80">
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Bộ lọc đang dùng:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {statusFilter && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 rounded-lg text-[10px] font-medium text-indigo-600 border border-indigo-100/50">
                                                {statusFilter === 'active' ? 'Đang học' : statusFilter === 'upcoming' ? 'Sắp khai giảng' : 'Kết thúc'}
                                                <button onClick={() => clearFilter('status')} className="hover:text-indigo-800">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {levelFilter && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 rounded-lg text-[10px] font-medium text-indigo-600 border border-indigo-100/50">
                                                Khối {levelFilter}
                                                <button onClick={() => clearFilter('level')} className="hover:text-indigo-800">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        {searchQuery && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 rounded-lg text-[10px] font-medium text-indigo-600 border border-indigo-100/50">
                                                Tìm kiếm: {searchQuery}
                                                <button onClick={() => clearFilter('search')} className="hover:text-indigo-800">
                                                    <X size={10} />
                                                </button>
                                            </span>
                                        )}
                                        <button
                                            onClick={clearAllFilters}
                                            className="ml-1 text-[10px] text-indigo-400 hover:text-indigo-600 transition-colors font-medium"
                                        >
                                            Đặt lại tất cả
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Số lượng kết quả tìm thấy */}
                            <div className="mt-4 text-right">
                                <span className="text-xs text-slate-500">
                                    Tìm thấy <span className="font-semibold text-indigo-600">{filteredSubjects.length}</span> lớp học
                                </span>
                            </div>
                        </div>

                        {/* Danh sách lớp học dạng grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedSubjects.map((subject, idx) => (
                                        <ClassCard key={subject.id} subject={subject} palette={palettes[idx % palettes.length]} />
                                    ))}
                                </div>

                                {/* Hiển thị khi không tìm thấy lớp nào */}
                                {filteredSubjects.length === 0 && (
                                    <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-100 rounded-full">
                                                <Search size={32} className="text-slate-400" />
                                            </div>
                                            <h3 className="font-semibold text-slate-700">Không tìm thấy lớp học</h3>
                                            <p className="text-sm text-slate-500">Vui lòng thử lại với bộ lọc khác</p>
                                            <button
                                                onClick={clearAllFilters}
                                                className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                                            >
                                                Xóa tất cả bộ lọc
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Phân trang */}
                                {filteredSubjects.length > 0 && totalFilteredPages > 1 && (
                                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {paginatedSubjects.slice(0, 3).map((subject) => {
                                                    const subjectImage = getImageSrc(subject.image);
                                                    return (
                                                        <div
                                                            key={subject.id}
                                                            className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
                                                        >
                                                            {subjectImage ? (
                                                                <img
                                                                    src={subjectImage}
                                                                    alt={subject.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                                                                    <span className="text-[8px] font-bold text-indigo-400">
                                                                        {getInitials(subject.name)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium ml-2">
                                                Hiển thị <span className="text-slate-900 font-bold">{(currentPage - 1) * classesPerPage + 1}–{Math.min(currentPage * classesPerPage, filteredSubjects.length)}</span> trên tổng số <span className="text-slate-900 font-bold">{filteredSubjects.length}</span> lớp học
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(p => p - 1)}
                                                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
                                            >
                                                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                                {Array.from({ length: totalFilteredPages }, (_, i) => i + 1).map(page => {
                                                    const isCurrent = currentPage === page;
                                                    const isEdge = page === 1 || page === totalFilteredPages;
                                                    const isNear = Math.abs(page - currentPage) <= 1;

                                                    if (isEdge || isNear) {
                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => setCurrentPage(page)}
                                                                className={`min-w-[36px] h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${isCurrent
                                                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200"
                                                                    : "text-slate-500 hover:bg-white hover:text-slate-900"
                                                                    }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    }
                                                    if (page === currentPage - 2 || page === currentPage + 2) {
                                                        return <span key={page} className="px-1 text-slate-400 text-xs font-bold">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <button
                                                disabled={currentPage === totalFilteredPages || totalFilteredPages === 0}
                                                onClick={() => setCurrentPage(p => p + 1)}
                                                className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
                                            >
                                                <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Lịch dạy sắp tới */}
                    <aside className="w-full lg:w-80 space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100/80 shadow-lg shadow-slate-200/20 overflow-hidden backdrop-blur-sm">
                            <div className="relative px-5 pt-5 pb-3">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-2xl -z-0" />
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <h2 className="text-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-slate-900">
                                            Lịch dạy sắp tới
                                        </h2>
                                        <p className="text-[10px] text-slate-400 mt-0.5">
                                            {upcomingSchedules.length > 0
                                                ? `${upcomingSchedules.length} buổi trong 7 ngày tới`
                                                : 'Không có buổi học nào'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => navigate('/teacher/schedule')}
                                            className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5 group"
                                        >
                                            Xem tất cả
                                            <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="relative px-3 py-1">
                                <div className="absolute left-[27px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200/60 via-slate-200 to-transparent" />

                                <div className="space-y-2 max-h-[420px] pr-1 overflow-y-auto custom-scrollbar">
                                    {loadingSchedules ? (
                                        <div className="flex justify-center items-center py-8">
                                            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                                        </div>
                                    ) : upcomingError ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                                            <p className="text-sm text-red-500">{upcomingError}</p>
                                            <button
                                                onClick={fetchUpcomingSchedules}
                                                className="mt-2 text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                                            >
                                                Thử lại
                                            </button>
                                        </div>
                                    ) : upcomingSchedules.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                            <p className="text-sm text-slate-400">Không có lịch dạy</p>
                                            <p className="text-[10px] text-slate-300 mt-1">Bạn chưa có buổi học nào trong tuần này</p>
                                        </div>
                                    ) : (
                                        upcomingSchedules.map((schedule, index) => {
                                            const remaining = getTimeRemaining(schedule.sessionDate, schedule.startTime);
                                            const isSoon = remaining.includes('giờ');
                                            const isToday = remaining === 'Đang diễn ra';

                                            let borderGradient = "from-indigo-500 to-purple-500";
                                            let badgeColor = "bg-indigo-50 text-indigo-600";
                                            let iconBg = "bg-indigo-100";

                                            if (isToday) {
                                                borderGradient = "from-emerald-500 to-teal-500";
                                                badgeColor = "bg-emerald-50 text-emerald-600";
                                                iconBg = "bg-emerald-100";
                                            } else if (isSoon) {
                                                borderGradient = "from-amber-500 to-orange-500";
                                                badgeColor = "bg-amber-50 text-amber-600";
                                                iconBg = "bg-amber-100";
                                            }

                                            return (
                                                <div key={schedule.sessionId} className="relative group">
                                                    {/* Timeline dot */}
                                                    <div className="absolute left-[7px] top-5 -translate-x-1/2 z-10">
                                                        <div className={`relative w-2.5 h-2.5 rounded-full ring-4 ring-white shadow-sm ${isToday ? 'bg-emerald-500 animate-pulse' :
                                                            isSoon ? 'bg-amber-500' :
                                                                'bg-indigo-500'
                                                            }`} />
                                                    </div>

                                                    {/* Card nội dung */}
                                                    <div
                                                        onClick={() => navigate(`/teacher/session/${schedule.sessionId}`)}
                                                        className={`ml-6 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer relative overflow-hidden group`}
                                                    >
                                                        {/* Gradient overlay khi hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                            style={{
                                                                background: `linear-gradient(120deg, transparent 30%, ${isToday ? 'rgba(16,185,129,0.05)' :
                                                                    isSoon ? 'rgba(245,158,11,0.05)' :
                                                                        'rgba(99,102,241,0.05)'
                                                                    } 70%)`
                                                            }}
                                                        />

                                                        <div className="flex justify-between items-start gap-2 mb-2">
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-slate-800 text-sm truncate leading-tight">
                                                                    {schedule.subjectName}
                                                                </h4>
                                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                                    {schedule.roomName && (
                                                                        <>
                                                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                                            <div className="flex items-center gap-0.5">
                                                                                <MapPin size={9} className="text-slate-400" />
                                                                                <span className="text-[10px] text-slate-500 truncate">
                                                                                    {schedule.roomName}
                                                                                </span>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${badgeColor} shadow-sm`}>
                                                                {remaining}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 pt-1 border-t border-slate-50">
                                                            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2 py-1 rounded-lg">
                                                                <Clock size={11} className={
                                                                    isToday ? 'text-emerald-500' :
                                                                        isSoon ? 'text-amber-500' :
                                                                            'text-indigo-400'
                                                                } />
                                                                <span className="font-mono text-[11px] font-medium text-slate-700">
                                                                    {formatTime(schedule.startTime, schedule.endTime)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-slate-50/80 px-2 py-1 rounded-lg">
                                                                <Calendar size={11} className="text-slate-400" />
                                                                <span className="text-[11px] text-slate-600 font-medium">
                                                                    {formatDateFull(schedule.sessionDate).slice(0, -5)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Nút điểm danh nếu đang diễn ra */}
                                                        {isToday && (
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/teacher/attendance/${schedule.sessionId}`);
                                                                }}
                                                                className="mt-2 w-full py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[9px] font-semibold rounded-lg transition-all shadow-sm hover:shadow-md"
                                                            >
                                                                Điểm danh ngay
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="mt-2 p-4 border-t border-slate-100/80 bg-gradient-to-r from-slate-50/50 to-transparent">
                                <button
                                    onClick={() => navigate('/teacher/schedule')}
                                    className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1 group"
                                >
                                    <span>Xem tất cả lịch dạy</span>
                                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .gradient-text {
                    background: linear-gradient(to right, #4f46e5, #7c3aed);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .btn-gradient {
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                }
                .gradient-secondary {
                    background: linear-gradient(90deg, #8b5cf6, #6d28d9);
                }
                .gradient-primary {
                    background: linear-gradient(90deg, #3b82f6, #2563eb);
                }
                .gradient-accent {
                    background: linear-gradient(90deg, #f59e0b, #d97706);
                }
                .gradient-danger {
                    background: linear-gradient(90deg, #ef4444, #dc2626);
                }
            `}</style>
        </main>
    );
};