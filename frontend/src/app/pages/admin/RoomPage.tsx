import React, { useState, useEffect } from 'react';
import {
  Search,
  MoreVertical,
  Wifi,
  Presentation,
  AirVent,
  Brush,
  CheckCircle,
  AlertCircle,
  Calendar,
  TrendingUp,
  Sparkles,
  ClipboardList,
  Building2,
  Users,
  DoorOpen,
  Activity,
  ChevronRight,
  Grid3x3,
  LayoutList,
  Clock,
  BatteryCharging,
  Eye,
  Zap,
  Plus,
  Trash2,
  Edit,
  Volume2,
  Loader2,
  BarChart3,
  Gauge,
  Circle,
  CircleCheck,
  CircleX,
  Wrench,
  Ban
} from 'lucide-react';
import type { RoomListDTO, Device, DeviceUpdateDTO } from '../../utils/types/room';
import { roomApi } from '../../utils/api/room.api';
import RoomModal from '../../components/adminComponents/RoomModal';
import { useOutletContext } from 'react-router-dom';
import { FadeInWhenVisible } from '../../components/motion/FadeInWhenVisible';

const RoomPage = () => {
  const [classrooms, setClassrooms] = useState<RoomListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomListDTO | null>(null);
  const { setAlert } = useOutletContext<any>();
  const [formData, setFormData] = useState<any>({
    name: '',
    seatCapacity: 30,
    manualStatus: 'ACTIVE',
    status: 'ACTIVE',
    location: '',
    devices: []
  });
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  // Fetch rooms from API
  useEffect(() => {
    fetchRooms();
  }, []);

  // Get greeting and time
  useEffect(() => {
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

    const updateGreetingAndTime = () => {
      setGreeting(getGreetingByTime());
      setCurrentTime(getCurrentVietnamTime());
    };

    updateGreetingAndTime();
    const interval = setInterval(updateGreetingAndTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomApi.getAll();
      if (response.data) {
        setClassrooms(response.data);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Không thể tải danh sách phòng. Vui lòng thử lại sau.';
      setError(errorMessage);
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatus = (room: RoomListDTO) => {
    switch(room.manualStatus) {
        case 'MAINTENANCE':
            return {
                occupied: false,
                available: false,
                disabled: false,
                maintenance: true,
            };
        case 'DISABLED':
            return {
                occupied: false,
                available: false,
                disabled: true,
                maintenance: false,
            };
        case 'ACTIVE':
        default:
            return {
                occupied: room.status === 'ACTIVE',
                available: room.status === 'DISABLED',
                disabled: false,
                maintenance: false,
            };
    }
};

  const getDevices = (devices: Device[]) => {
    return {
      projector: devices.some(d => d.type === 'PROJECTOR'),
      wifi: devices.some(d => d.type === 'WIFI'),
      ac: devices.some(d => d.type === 'AIR_CONDITIONER'),
      whiteboard: devices.some(d => d.type === 'WHITEBOARD'),
      speaker: devices.some(d => d.type === 'SPEAKER')
    };
  };

  const stats = {
    totalRooms: classrooms.length,
    inUse: classrooms.filter(
      r =>
        r.manualStatus === 'ACTIVE' &&
        r.status === 'ACTIVE'
    ).length,
    empty: classrooms.filter(
      r =>
        r.manualStatus === 'ACTIVE' &&
        r.status === 'DISABLED'
    ).length,
    maintenance: classrooms.filter(
      r => r.manualStatus === 'MAINTENANCE'
    ).length,
    disabled: classrooms.filter(
      r => r.manualStatus === 'DISABLED'
    ).length,
    avgOccupancy:
      classrooms.length > 0
        ? Math.round(
          (
            classrooms.filter(
              r =>
                r.manualStatus === 'ACTIVE' &&
                r.status === 'ACTIVE'
            ).length /
            classrooms.length
          ) * 100
        )
        : 0,
  };

  const DeviceIcon = ({
    active,
    icon: Icon,
    label,
  }: {
    active: boolean;
    icon: any;
    label: string;
  }) => {
    const [hovered, setHovered] = useState(false);

    return (
      <div
        className="relative flex items-center justify-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`transition-all duration-200 ${active ? "text-indigo-500" : "text-gray-300"
            }`}
        >
          <Icon size={16} strokeWidth={active ? 2 : 1.5} />
        </span>
        {hovered && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
              {label}
            </div>
          </div>
        )}
      </div>
    );
  };

  const StatusBadge = ({ type, value }: { type: string; value: boolean }) => {
    if (!value) return null;
    const config: Record<string, { color: string; label: string; icon: any }> = {
      available: {
        color: "emerald",
        label: "Trống",
        icon: CheckCircle,
      },
      maintenance: {
        color: "rose",
        label: "Bảo trì",
        icon: AlertCircle,
      },
      occupied: {
        color: "indigo",
        label: "Đang sử dụng",
        icon: Users,
      },
      disabled: {
        color: "gray",
        label: "Vô hiệu hóa",
        icon: AlertCircle,
      },
    };
    const { color, label, icon: Icon } = config[type];
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-600`}>
        <Icon size={12} />
        {label}
      </span>
    );
  };

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = classrooms.filter(room =>
    room.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (room?: RoomListDTO) => {
    if (room) {
      setEditingRoom(room);
      setFormData({
        name: room.name,
        seatCapacity: room.seatCapacity,
        manualStatus: room.manualStatus,
        location: (room as any).location || '',
        devices: room.devices || []
      });
    } else {
      setEditingRoom(null);
      setFormData({
        name: '',
        seatCapacity: 30,
        manualStatus: 'ACTIVE',
        location: '',
        devices: []
      });
    }
    setIsModalOpen(true);
  };

  const syncDevices = async (roomId: number, selectedDevices: Device[]) => {
    try {
      const currentDevicesResponse = await roomApi.getDevices(roomId);
      const currentDevices = currentDevicesResponse.data || [];

      const devicesToDelete = currentDevices.filter(
        current => !selectedDevices.some(selected => selected.type === current.type)
      );

      const devicesToAdd = selectedDevices.filter(
        selected => !currentDevices.some(current => current.type === selected.type)
      );

      for (const device of devicesToDelete) {
        await roomApi.deleteDevice(device.id);
      }

      for (const device of devicesToAdd) {
        await roomApi.addDevice(roomId, device.type);
      }

      console.log(`Synced devices for room ${roomId}: deleted ${devicesToDelete.length}, added ${devicesToAdd.length}`);
    } catch (error) {
      console.error('Error syncing devices:', error);
      throw error;
    }
  };

  const getDeviceUpdates = (currentDevices: Device[], newDevices: Device[]): DeviceUpdateDTO[] => {
    const updates: DeviceUpdateDTO[] = [];

    const devicesToDelete = currentDevices.filter(
      current => !newDevices.some(newDevice => newDevice.type === current.type)
    );

    const devicesToAdd = newDevices.filter(
      newDevice => !currentDevices.some(current => current.type === newDevice.type)
    );

    devicesToDelete.forEach(device => {
      updates.push({
        id: device.id,
        type: device.type,
        action: 'DELETE'
      });
    });

    devicesToAdd.forEach(device => {
      updates.push({
        id: null,
        type: device.type,
        action: 'ADD'
      });
    });

    return updates;
  };

  const handleSaveRoom = async () => {
    if (!formData.name.trim()) {
      alert('Vui lòng điền tên phòng học');
      return;
    }

    if (formData.seatCapacity < 1) {
      alert('Sức chứa phải lớn hơn 0');
      return;
    }

    setSaving(true);
    try {
      const roomData: any = {
        name: formData.name.trim(),
        seatCapacity: formData.seatCapacity,
        manualStatus: formData.manualStatus
      };

      if (editingRoom) {
        const currentDevicesResponse = await roomApi.getDevices(editingRoom.id);
        const currentDevices = currentDevicesResponse.data || [];

        const deviceUpdates = getDeviceUpdates(currentDevices, formData.devices);

        if (deviceUpdates.length > 0) {
          roomData.devices = deviceUpdates;
        }

        await roomApi.update(editingRoom.id, roomData);

        setAlert?.({
          type: "success",
          message: "Cập nhật phòng học thành công",
        });
      } else {
        const createResponse = await roomApi.create(roomData);
        const savedRoom = createResponse.data;

        if (savedRoom && formData.devices.length > 0) {
          for (const device of formData.devices) {
            await roomApi.addDevice(savedRoom.id, device.type);
          }
        }

        setAlert?.({
          type: "success",
          message: "Thêm phòng học mới thành công",
        });
      }

      await fetchRooms();
      setIsModalOpen(false);
      setEditingRoom(null);
    } catch (err: any) {
      console.error('Error saving room:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi lưu phòng học';
      setAlert?.({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng học này? Hành động này không thể hoàn tác.')) {
      try {
        await roomApi.delete(id);
        setAlert?.({
          type: "success",
          message: "Xóa phòng học thành công",
        });
        await fetchRooms();
      } catch (err: any) {
        console.error('Error deleting room:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xóa phòng học';
        setAlert?.({
          type: "error",
          message: errorMessage,
        });
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const getEnergyScore = (roomId: number) => {
    const scores: Record<number, number> = {
      1: 85,
      2: 72,
    };
    return scores[roomId] || 75;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Đang tải danh sách phòng học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/20 p-6 font-sans flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchRooms}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header Section với gradient và viền lượn sóng phía sau */}
      <section className="relative overflow-visible pb-6 bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-300 to-cyan-200 opacity-30"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-r from-sky-300 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

        {/* SVG Waves */}
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

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 z-10">
          <div className="relative overflow-hidden">
            <div className="relative px-6 py-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-1.5">
                      <Sparkles size={14} className="text-indigo-500" />
                      <span className="text-indigo-500 text-xs font-medium">Quản lý phòng học</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-gray-600 text-sm">{currentTime}</span>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-gray-900 text-3xl lg:text-4xl font-bold tracking-tight">
                      {greeting}, <span className="bg-clip-text text-transparent gradient-text">Quản trị viên!</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                      <span>Quản lý toàn bộ phòng học của trung tâm</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-blue-500" />
                        Tổng quan phòng học
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <FadeInWhenVisible delay={0.1}>
            {/* Stats Cards - Sử dụng màu cố định thay vì dynamic */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {/* Tổng số phòng */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:scale-105 transition-transform duration-200">
                      <Building2 className="text-indigo-500" size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Tổng</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.totalRooms}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Phòng học</p>
                </div>
              </div>

              {/* Đang sử dụng */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-emerald-50 group-hover:scale-105 transition-transform duration-200">
                      <Users className="text-emerald-500" size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {stats.totalRooms > 0 ? Math.round((stats.inUse / stats.totalRooms) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.inUse}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Đang sử dụng</p>
                  <div className="mt-1.5 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalRooms > 0 ? (stats.inUse / stats.totalRooms) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Phòng trống */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-amber-50 group-hover:scale-105 transition-transform duration-200">
                      <DoorOpen className="text-amber-500" size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Trống</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.empty}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Phòng trống</p>
                  <div className="mt-1.5 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalRooms > 0 ? (stats.empty / stats.totalRooms) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bảo trì */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-rose-50 group-hover:scale-105 transition-transform duration-200">
                      <Wrench className="text-rose-500" size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Bảo trì</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.maintenance}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Đang bảo trì</p>
                  <div className="mt-1.5 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalRooms > 0 ? (stats.maintenance / stats.totalRooms) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Vô hiệu hóa */}
              <div className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-white/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gray-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:scale-105 transition-transform duration-200">
                      <Ban className="text-gray-500" size={16} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Vô hiệu</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 tracking-tight">{stats.disabled}</p>
                  <p className="text-[10px] text-gray-500 font-medium">Vô hiệu hóa</p>
                  <div className="mt-1.5 w-full h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gray-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalRooms > 0 ? (stats.disabled / stats.totalRooms) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Room Modal */}
        <RoomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRoom}
          editingRoom={editingRoom}
          formData={formData}
          onFormChange={handleInputChange}
          saving={saving}
        />

    {/* Search Bar - Phiên bản nhỏ gọn và đẹp hơn */}
<div className="mb-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
  <div className="relative flex-1 max-w-md group">
    <Search 
      className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
        searchQuery ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
      }`} 
      size={16} 
    />
    <input
      type="text"
      placeholder="Tìm kiếm phòng học..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white/80 backdrop-blur-sm transition-all placeholder:text-gray-400 hover:border-gray-300"
    />
    {searchQuery && (
      <button
        onClick={() => setSearchQuery('')}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-110"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
  <div className="flex gap-2 bg-white/80 backdrop-blur-sm p-1 rounded-xl border border-gray-200 w-fit shadow-sm">
    <button
      onClick={() => setViewMode('table')}
      className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
    >
      <LayoutList size={16} />
    </button>
    <button
      onClick={() => setViewMode('grid')}
      className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
    >
      <Grid3x3 size={16} />
    </button>
  </div>
</div>

        {/* Dynamic View: Table or Grid */}
        {viewMode === 'table' ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    {["ID", "TÊN PHÒNG", "SỨC CHỨA", "THIẾT BỊ", "TRẠNG THÁI", "SỬ DỤNG HIỆN TẠI", ""].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRooms.map((room) => {
                    const status = getRoomStatus(room);
                    const devices = getDevices(room.devices);
                    const currentUsage = room.activeSession;

                    return (
                      <tr key={room.id} className="group hover:bg-indigo-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-400">Room {room.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{room.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-400" />
                            {room.seatCapacity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2.5">
                            <DeviceIcon active={devices.projector} icon={Presentation} label="Máy chiếu" />
                            <DeviceIcon active={devices.wifi} icon={Wifi} label="WiFi" />
                            <DeviceIcon active={devices.ac} icon={AirVent} label="Điều hòa" />
                            <DeviceIcon active={devices.whiteboard} icon={Brush} label="Bảng trắng" />
                            <DeviceIcon active={devices.speaker} icon={Volume2} label="Loa" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1.5">
                            {status.available && (
                              <StatusBadge type="available" value />
                            )}
                            {status.maintenance && (
                              <StatusBadge type="maintenance" value />
                            )}
                            {status.occupied && (
                              <StatusBadge type="occupied" value />
                            )}
                            {status.disabled && (
                              <StatusBadge type="disabled" value />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {currentUsage ? (
                            <div className="space-y-0.5">
                              <div className="font-medium text-gray-800">
                                {currentUsage.subjectName}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <Users size={10} /> {currentUsage.studentCount} sv
                                <Clock size={10} />
                                {currentUsage.startTime} - {currentUsage.endTime}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">----</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenModal(room)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50/30 flex justify-between items-center">
              <span>Hiển thị {filteredRooms.length} trên {classrooms.length} Phòng học</span>
              <button className="text-indigo-500 text-xs font-medium hover:text-indigo-600">Xem tất cả →</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filteredRooms.map((room) => {
              const status = getRoomStatus(room);
              const devices = getDevices(room.devices);
              const currentUsage = room.activeSession;
              const energyScore = getEnergyScore(room.id);

              return (
                <div key={room.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">{room.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {status.available && (
                          <StatusBadge type="available" value />
                        )}
                        {status.occupied && (
                          <StatusBadge type="occupied" value />
                        )}
                        {status.maintenance && (
                          <StatusBadge type="maintenance" value />
                        )}
                        {status.disabled && (
                          <StatusBadge type="disabled" value />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex gap-3">
                        <DeviceIcon active={devices.projector} icon={Presentation} label="Máy chiếu" />
                        <DeviceIcon active={devices.wifi} icon={Wifi} label="WiFi" />
                        <DeviceIcon active={devices.ac} icon={AirVent} label="Điều hòa" />
                        <DeviceIcon active={devices.whiteboard} icon={Brush} label="Bảng trắng" />
                        <DeviceIcon active={devices.speaker} icon={Volume2} label="Loa" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Sức chứa</div>
                        <div className="font-medium text-gray-700">{room.seatCapacity} sv</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                        <Zap size={12} className="text-indigo-400" />
                        Đang diễn ra
                      </div>
                      {currentUsage ? (
                        <>
                          <p className="text-sm font-medium text-gray-800">
                            {currentUsage.subjectName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {currentUsage.startTime} - {currentUsage.endTime}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400 italic">Không có hoạt động</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 text-xs">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${energyScore >= 80 ? 'bg-emerald-500' : energyScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${energyScore}%` }}></div>
                        </div>
                        <span className="text-gray-500">HS {energyScore}%</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenModal(room)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button className="text-indigo-500 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all">
                          Chi tiết <Eye size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-indigo-50/20 rounded-2xl p-6 shadow-sm border border-indigo-100/50">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-indigo-100 rounded-xl"><TrendingUp className="text-indigo-600" size={20} /></div>
              <h2 className="font-semibold text-gray-800 text-lg">Tối ưu cơ sở vật chất</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">Công suất đạt đỉnh từ 10:00 – 14:00. AI đề xuất chuyển lịch bảo trì sang khung giờ 19:00 – 22:00 để tăng 23% hiệu quả sử dụng phòng trong giờ cao điểm.</p>
            <div className="flex gap-8">
              <div>
                <p className="text-xs text-gray-500 font-medium">TRUNG BÌNH NGÀY</p>
                <p className="text-2xl font-bold text-gray-800">82%</p>
                <p className="text-xs text-emerald-600 mt-1">↑ 5% so với tháng trước</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">TIẾT KIỆM NĂNG LƯỢNG</p>
                <p className="text-2xl font-bold text-emerald-600">1.24kWh</p>
                <p className="text-xs text-gray-500 mt-1">/phòng/ngày</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-violet-50/20 rounded-2xl p-6 shadow-sm border border-violet-100/50">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-violet-100 rounded-xl"><Sparkles className="text-violet-600" size={20} /></div>
              <h2 className="font-semibold text-gray-800 text-lg">Sắp xếp lịch thông minh</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">Thuật toán phân bổ động của AI giúp tăng hiệu suất phòng đến <strong className="text-violet-600">20%</strong> và rút ngắn 15% thời gian di chuyển giữa các lớp liên tiếp.</p>
            <button className="bg-indigo-50 text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-indigo-100 hover:shadow-md transition-all duration-200 group">
              <ClipboardList size={16} className="group-hover:scale-110 transition-transform" />
              Phân tích lịch trình bằng AI
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => handleOpenModal()}
          className="relative group w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/30 dark:shadow-indigo-600/40 backdrop-blur-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
          />
          <span className="absolute inset-0 rounded-full border-2 border-indigo-400/60 animate-ping" />
          <Plus
            size={26}
            strokeWidth={2}
            className="relative z-10 mx-auto"
          />
        </button>
      </div>
    </main>
  );
};

export default RoomPage;