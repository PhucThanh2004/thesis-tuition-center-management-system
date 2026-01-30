import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const revenueData = [
    { month: 'T1', revenue: 32, students: 180 },
    { month: 'T2', revenue: 28, students: 165 },
    { month: 'T3', revenue: 35, students: 195 },
    { month: 'T4', revenue: 38, students: 210 },
    { month: 'T5', revenue: 42, students: 225 },
    { month: 'T6', revenue: 45, students: 240 }
];

const courseData = [
    { name: 'Toán học', value: 35, color: '#667eea' },
    { name: 'Tiếng Anh', value: 28, color: '#764ba2' },
    { name: 'Vật lý', value: 18, color: '#f093fb' },
    { name: 'Hóa học', value: 12, color: '#f59e0b' },
    { name: 'Khác', value: 7, color: '#10b981' }
];

export function ChartsSection() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Doanh thu & Học viên</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#667eea"
                            strokeWidth={3}
                            name="Doanh thu (M)"
                            dot={{ fill: '#667eea', r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="students"
                            stroke="#f093fb"
                            strokeWidth={3}
                            name="Học viên"
                            dot={{ fill: '#f093fb', r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Course Distribution */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Phân bố khóa học</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={courseData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: PieLabelRenderProps) => {
                                const { name, percent } = props;

                                if (!name || percent === undefined) return null;

                                return `${name} ${(percent * 100).toFixed(0)}%`;
                            }}
                            outerRadius={100}
                            dataKey="value"
                        >
                            {courseData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {courseData.map((course, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: course.color }}
                            />
                            <span className="text-sm text-gray-600">{course.name}: {course.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
