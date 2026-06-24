import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Save,
    Edit,
    Plus,
    Wifi,
    Presentation,
    AirVent,
    Brush,
    Volume2,
    Loader2,
    DoorOpen,
    Users,
    Sparkles,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';

import type { RoomListDTO, Device } from '../../utils/types/room';

interface RoomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    editingRoom: RoomListDTO | null;
    formData: any;
    onFormChange: (field: string, value: any) => void;
    saving: boolean;
}

const RoomModal: React.FC<RoomModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingRoom,
    formData,
    onFormChange,
    saving
}) => {
    const deviceLabels: Record<string, string> = {
        PROJECTOR: 'Máy chiếu',
        WIFI: 'WiFi',
        AIR_CONDITIONER: 'Điều hòa',
        WHITEBOARD: 'Bảng trắng',
        SPEAKER: 'Loa'
    };

    const deviceIcons: Record<string, any> = {
        PROJECTOR: Presentation,
        WIFI: Wifi,
        AIR_CONDITIONER: AirVent,
        WHITEBOARD: Brush,
        SPEAKER: Volume2
    };

    const statusOptions = [
        { value: 'ACTIVE', label: 'Hoạt động', color: 'emerald' },
        { value: 'DISABLED', label: 'Vô hiệu hóa', color: 'rose' },
        { value: 'MAINTENANCE', label: 'Bảo trì', color: 'amber' },
    ];

    const handleDeviceToggle = (deviceType: string) => {
        const currentDevices = [...formData.devices];
        const deviceIndex = currentDevices.findIndex((d: Device) => d.type === deviceType);

        if (deviceIndex === -1) {
            currentDevices.push({ type: deviceType } as Device);
        } else {
            currentDevices.splice(deviceIndex, 1);
        }

        onFormChange('devices', currentDevices);
    };

    const isDeviceSelected = (deviceType: string) => {
        return formData.devices.some((d: Device) => d.type === deviceType);
    };

    const getDeviceCount = () => {
        return formData.devices.length;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'emerald';
            case 'DISABLED': return 'rose';
            case 'MAINTENANCE': return 'amber';
            default: return 'gray';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-[580px] max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50"
                    >
                        {/* Decorative gradient header */}
                        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-50/80 via-white to-transparent dark:from-indigo-950/30 dark:via-slate-900/50">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-violet-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                            <div className="relative flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-2xl btn-gradient text-white shadow-lg shadow-indigo-500/25">
                                        {editingRoom ? (
                                            <Edit size={22} className="text-white" />
                                        ) : (
                                            <Plus size={22} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                                            {editingRoom ? 'Chỉnh sửa phòng học' : 'Thêm phòng học mới'}
                                        </h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                            {editingRoom ? 'Cập nhật thông tin phòng học' : 'Thêm phòng học vào hệ thống'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    disabled={saving}
                                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-50"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-200px)] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            <div className="space-y-6">
                                {/* Thông tin cơ bản */}
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                        Thông tin cơ bản
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Tên phòng */}
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                <DoorOpen size={16} className="text-indigo-500" />
                                                Tên phòng <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => onFormChange('name', e.target.value)}
                                                disabled={saving}
                                                className="
                                                    w-full px-4 py-2.5 rounded-xl border-2 
                                                    bg-white dark:bg-slate-800/50
                                                    text-slate-900 dark:text-white text-sm
                                                    transition-all duration-200
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                                                    border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                "
                                                placeholder="VD: P.101 - Tòa 1"
                                            />
                                        </div>

                                        {/* Sức chứa & Trạng thái */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    <Users size={16} className="text-indigo-500" />
                                                    Sức chứa <span className="text-rose-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.seatCapacity}
                                                    onChange={(e) =>
                                                        onFormChange('seatCapacity', parseInt(e.target.value) || 0)
                                                    }
                                                    disabled={saving}
                                                    className="
                                                        w-full px-4 py-2.5 rounded-xl border-2 
                                                        bg-white dark:bg-slate-800/50
                                                        text-slate-900 dark:text-white text-sm
                                                        transition-all duration-200
                                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                                                        border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                    "
                                                />
                                            </div>

                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    <AlertCircle size={16} className="text-indigo-500" />
                                                    Trạng thái
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {statusOptions.map((option) => {
                                                        const isSelected = formData.manualStatus === option.value;

                                                        return (
                                                            <motion.button
                                                                key={option.value}
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => onFormChange('manualStatus', option.value)}
                                                                disabled={saving}
                                                                className={`
                                                                    px-4 py-1.5 rounded-full text-sm font-medium
                                                                    transition-all duration-200
                                                                    ${isSelected
                                                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 dark:shadow-white/10'
                                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                                                    }
                                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                                `}
                                                            >
                                                                {option.label}
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thiết bị */}
                                <div>
                                    <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                                        Thiết bị trong phòng
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {Object.keys(deviceLabels).map((deviceType) => {
                                            const Icon = deviceIcons[deviceType];
                                            const isSelected = isDeviceSelected(deviceType);

                                            return (
                                                <motion.button
                                                    key={deviceType}
                                                    type="button"
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleDeviceToggle(deviceType)}
                                                    disabled={saving}
                                                    className={`
                                                        group flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                                                        ${isSelected
                                                            ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm'
                                                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                        }
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                    `}
                                                >
                                                    <Icon
                                                        size={18}
                                                        className={`transition-colors ${isSelected
                                                            ? 'text-indigo-600 dark:text-indigo-400'
                                                            : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                                            }`}
                                                    />

                                                    <span className={`text-sm font-medium transition-colors ${isSelected
                                                        ? 'text-indigo-700 dark:text-indigo-300'
                                                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                                                        }`}>
                                                        {deviceLabels[deviceType]}
                                                    </span>

                                                    {isSelected && (
                                                        <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-lg shadow-indigo-500/30" />
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
                                        Chọn thiết bị có sẵn trong phòng
                                    </p>
                                </div>

                                {/* Preview Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mt-2 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-violet-50/70 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100/60 dark:border-indigo-800/30"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                                            <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                                            {editingRoom ? 'Thông tin phòng sẽ được cập nhật' : 'Thông tin phòng sẽ được tạo'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <span className="text-indigo-500 dark:text-indigo-400 font-medium min-w-[75px]">Tên phòng</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                                                {formData.name || '---'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <span className="text-indigo-500 dark:text-indigo-400 font-medium min-w-[75px]">Sức chứa</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {formData.seatCapacity || 0} người
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <span className="text-indigo-500 dark:text-indigo-400 font-medium min-w-[75px]">Trạng thái</span>
                                            <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                                                formData.manualStatus === 'ACTIVE'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : formData.manualStatus === 'DISABLED'
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                        : formData.manualStatus === 'MAINTENANCE'
                                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400'
                                            }`}>
                                                {statusOptions.find(s => s.value === formData.manualStatus)?.label || '---'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                                            <span className="text-indigo-500 dark:text-indigo-400 font-medium min-w-[75px]">Thiết bị</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                {getDeviceCount()} thiết bị
                                            </span>
                                        </div>
                                    </div>

                                    {getDeviceCount() > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1.5">
                                            {formData.devices.map((device: Device) => (
                                                <span
                                                    key={device.type}
                                                    className="px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50"
                                                >
                                                    {deviceLabels[device.type] || device.type}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 flex items-center justify-end gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onClose}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy bỏ
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onSave}
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl btn-gradient text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        {editingRoom ? 'Cập nhật' : 'Thêm mới'}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RoomModal;