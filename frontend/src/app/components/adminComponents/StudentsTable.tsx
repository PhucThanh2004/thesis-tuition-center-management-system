import { Search, Filter, MoreVertical, Mail, Phone, Eye } from 'lucide-react';

type StudentStatus = 'active' | 'pending' | 'inactive';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  status: StudentStatus;
  joinDate: string;
  avatar: string;
}

const students: Student[] = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    course: 'Toán 10',
    status: 'active',
    joinDate: '15/01/2025',
    avatar: 'A',
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0907654321',
    course: 'Tiếng Anh',
    status: 'active',
    joinDate: '18/01/2025',
    avatar: 'B',
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@email.com',
    phone: '0912345678',
    course: 'Vật lý 11',
    status: 'pending',
    joinDate: '20/01/2025',
    avatar: 'C',
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@email.com',
    phone: '0923456789',
    course: 'Hóa học',
    status: 'active',
    joinDate: '22/01/2025',
    avatar: 'D',
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@email.com',
    phone: '0934567890',
    course: 'Toán 10',
    status: 'inactive',
    joinDate: '10/01/2025',
    avatar: 'E',
  },
];

const statusColors: Record<StudentStatus, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-700',
};

const statusText: Record<StudentStatus, string> = {
  active: 'Đang học',
  pending: 'Chờ xử lý',
  inactive: 'Ngưng học',
};

export function StudentsTable() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-900">Học viên mới nhất</h3>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Học viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Liên hệ
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Ngày tham gia
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                      style={{
                        background:
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      {student.avatar}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {student.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: #{student.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-3 h-3 mr-2" />
                      {student.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-2" />
                      {student.phone}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {student.course}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[student.status]}`}
                  >
                    {statusText[student.status]}
                  </span>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {student.joinDate}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Hiển thị <b>1–5</b> trong tổng số <b>1,234</b> học viên
        </p>

        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg text-sm">Trước</button>
          <button
            className="px-4 py-2 rounded-lg text-sm text-white"
            style={{
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            1
          </button>
          <button className="px-4 py-2 border rounded-lg text-sm">2</button>
          <button className="px-4 py-2 border rounded-lg text-sm">Sau</button>
        </div>
      </div>
    </div>
  );
}
