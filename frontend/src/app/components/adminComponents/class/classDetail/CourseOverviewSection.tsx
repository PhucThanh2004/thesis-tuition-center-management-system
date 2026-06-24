// CourseOverviewSection.tsx
import { motion } from "framer-motion";
import { BookOpen, Users, TrendingUp, DollarSign, Calendar, Award } from "lucide-react";
import type { Subject } from "../../../../utils/types/subject";
import { getImageSrc, getInitials } from "../../../../utils/helpers";
import { getSubjectStatusLabel, getSubjectStatusStyle } from "../../../../utils/helpers/subjectStatus";

type Props = {
    subject: Subject | null;
    onEdit?: () => void;
    isTeacher?: boolean; 
};

export const CourseOverviewSection = ({ subject, onEdit, isTeacher = false }: Props) => {
    if (!subject) return <CourseOverviewSkeleton />;

    const courseData = {
        title: subject.name,
        status: subject.status,
        subject: subject.subjectType?.name || "Chưa có",
        subjectLevel: subject.subjectType?.academicLevel?.name || "Chưa có",
        grade: subject.grade,
        teacher: subject.teacherSubjects?.[0]?.teacher?.user?.fullName || "Chưa sắp xếp",
        teacherSpecialty: subject.teacherSubjects?.[0]?.teacher?.specialty || "Chưa có",
        teacherEmail: subject.teacherSubjects?.[0]?.teacher?.user.email,
        enrollment: `${subject.currentStudents}/${subject.maxStudents}`,
        sessionsPerWeek: subject.sessionsPerWeek || 0,
        price: subject.price || 0,
    };

    const teacherImage = getImageSrc(subject.teacherSubjects?.[0]?.teacher?.user?.image);
    const teacherName = courseData.teacher;

    // Mock stats data (replace with real data from API)
    const stats = {
        totalStudents: subject.currentStudents || 0,
        maxStudents: subject.maxStudents || 0,
        progress: 65,
        attendance: 94.2,
        revenue: (subject.price || 0) * (subject.currentStudents || 0) * 4,
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl "
        >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-50/30 to-indigo-50/30 rounded-full blur-3xl -z-0" />

            <div className="relative z-10 p-6">
                {/* HEADER - Giữ nguyên */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div className="flex gap-4">
                        {/* Icon with gradient */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-16 h-16 flex items-center justify-center btn-gradient rounded-2xl shadow-lg"
                        >
                            <BookOpen className="text-white" size={28} />
                        </motion.div>

                        {/* Info */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                                    {courseData.title}
                                </h1>

                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getSubjectStatusStyle(subject?.status)}`}>
                                    {getSubjectStatusLabel(subject?.status)}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Môn:</span> {courseData.subject}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Khối:</span> {courseData.grade}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">Cấp học:</span> {courseData.subjectLevel}
                                </span>
                            </div>

                            {/* Teacher info */}
                            <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-2">
                                    {teacherImage ? (
                                        <img
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                                            src={teacherImage}
                                            alt={teacherName}
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                                            {getInitials(teacherName)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-700">{teacherName}</p>
                                        <p className="text-xs text-slate-400">{courseData.teacherEmail}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Users size={14} />
                                    <span>Sĩ số: {courseData.enrollment}</span>
                                </div>

                                <div className="flex items-center gap-1 text-sm text-slate-500">
                                    <Calendar size={14} />
                                    <span>{courseData.sessionsPerWeek} buổi/tuần</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STATS GRID - Smaller cards with spread out gradients */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    <StatCard
                        label="Tổng học sinh"
                        value={stats.totalStudents.toString()}
                        maxValue={stats.maxStudents}
                        subtext="+12% so với tháng trước"
                        icon={<Users size={14} />}
                        trend="up"
                        color="violet"
                    />
                    <StatCard
                        label="Tiến độ khóa học"
                        value={`${stats.progress}%`}
                        progress={stats.progress}
                        subtext="24/36 bài học"
                        icon={<TrendingUp size={14} />}
                        color="blue"
                    />
                    <StatCard
                        label="Tỷ lệ chuyên cần"
                        value={`${stats.attendance}%`}
                        subtext="+5.2%"
                        icon={<Award size={14} />}
                        trend="up"
                        color="emerald"
                    />
                    <StatCard
                        label="Doanh thu dự kiến"
                        value={`${(stats.revenue / 1000000).toFixed(1)}M`}
                        subtext="VNĐ / tháng"
                        icon={<DollarSign size={14} />}
                        color="amber"
                    />
                </div>
            </div>
        </motion.section>
    );
};

// Stat Card Component - Smaller size, more spread out gradient
const StatCard = ({
    label,
    value,
    maxValue,
    subtext,
    progress,
    icon,
    trend,
    color = "violet",
}: {
    label: string;
    value: string;
    maxValue?: number;
    subtext?: string;
    progress?: number;
    icon?: React.ReactNode;
    trend?: "up" | "down";
    color?: "violet" | "blue" | "emerald" | "amber" | "rose";
}) => {
    const colorClasses = {
        violet: "from-violet-500 to-indigo-500",
        blue: "from-blue-500 to-cyan-500",
        emerald: "from-emerald-500 to-teal-500",
        amber: "from-amber-500 to-orange-500",
        rose: "from-rose-500 to-pink-500",
    };

    const bgColorClasses = {
        violet: "bg-violet-50",
        blue: "bg-blue-50",
        emerald: "bg-emerald-50",
        amber: "bg-amber-50",
        rose: "bg-rose-50",
    };

    const textColorClasses = {
        violet: "text-violet-600",
        blue: "text-blue-600",
        emerald: "text-emerald-600",
        amber: "text-amber-600",
        rose: "text-rose-600",
    };

    const shadowClasses = {
        violet: "shadow-md hover:shadow-violet-100/50",
        blue: "shadow-md hover:shadow-blue-100/50",
        emerald: "shadow-md hover:shadow-emerald-100/50",
        amber: "shadow-md hover:shadow-amber-100/50",
        rose: "shadow-md hover:shadow-rose-100/50",
    };

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className={`group relative overflow-hidden bg-white rounded-xl ${shadowClasses[color]} transition-all duration-300`}
        >
            {/* Spread out decorative gradient background - larger and more prominent */}
            <div className={`absolute -top-8 -right-8 w-32 h-32 ${bgColorClasses[color]} rounded-full blur-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
            <div className={`absolute -bottom-10 -left-10 w-28 h-28 ${bgColorClasses[color]} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
            
            <div className="relative p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                    </span>
                    <div className={`p-1.5 rounded-lg ${bgColorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`${textColorClasses[color]}`}>
                            {icon}
                        </div>
                    </div>
                </div>

                {progress !== undefined ? (
                    <>
                        <div className="mb-0.5">
                            <span className="text-xl font-bold text-slate-800">{value}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full`}
                            />
                        </div>
                        {subtext && (
                            <p className="text-[10px] text-slate-400 font-medium">{subtext}</p>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex items-baseline gap-0.5 mb-1">
                            <span className="text-2xl font-bold text-slate-800">{value}</span>
                            {maxValue !== undefined && (
                                <span className="text-xs text-slate-400 font-medium">/{maxValue}</span>
                            )}
                        </div>
                        {trend ? (
                            <div className="flex items-center gap-1">
                                <span className={`text-[10px] font-bold ${trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
                                    {trend === "up" ? "↑" : "↓"} {subtext}
                                </span>
                            </div>
                        ) : (
                            subtext && <p className="text-[10px] text-slate-400 font-medium">{subtext}</p>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

// Skeleton Loader - Updated for smaller cards
const CourseOverviewSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
        <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl" />
            <div className="flex-1">
                <div className="h-7 w-64 bg-slate-200 rounded mb-2" />
                <div className="h-4 w-48 bg-slate-200 rounded mb-2" />
                <div className="h-10 w-72 bg-slate-200 rounded" />
            </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="p-3 bg-white rounded-xl shadow-md">
                    <div className="h-2 w-16 bg-slate-200 rounded mb-2" />
                    <div className="h-6 w-12 bg-slate-200 rounded" />
                </div>
            ))}
        </div>
    </div>
);

// Helper function
const cn = (...classes: (string | false | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};