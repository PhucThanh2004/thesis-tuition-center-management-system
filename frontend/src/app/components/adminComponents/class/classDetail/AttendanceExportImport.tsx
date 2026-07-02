import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Download,
    Upload,
    FileSpreadsheet,
    FileText,
    X,
    CheckCircle,
    AlertCircle,
    Loader2,
    FileDown,
    FileUp,
    ChevronDown,
    AlertTriangle
} from 'lucide-react'
import clsx from 'clsx'
import { attendanceApi } from '../../../../utils/api/attendance.api'
import type { ImportResult, ExportFormat } from '../../../../utils/types/attendance'

interface AttendanceExportImportProps {
    subjectId: number
    subjectName?: string
    onImportSuccess?: (result: ImportResult) => void
    onImportError?: (error: string) => void
    onExportSuccess?: () => void
    onExportError?: (error: string) => void
    className?: string
}

export const AttendanceExportImport: React.FC<AttendanceExportImportProps> = ({
    subjectId,
    subjectName,
    onImportSuccess,
    onImportError,
    onExportSuccess,
    onExportError,
    className
}) => {
    // ==================== STATE QUẢN LÝ ====================
    const [showExportOptions, setShowExportOptions] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [exportFormat, setExportFormat] = useState<ExportFormat>('excel')
    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [useDateRange, setUseDateRange] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [importResult, setImportResult] = useState<ImportResult | null>(null)
    const [importFormat, setImportFormat] = useState<ExportFormat>('excel')
    const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
    const [exportWarning, setExportWarning] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // ==================== XỬ LÝ EXPORT ====================

    const handleExport = async () => {
        // Kiểm tra khoảng thời gian hợp lệ trước khi export
        if (useDateRange && startDate && endDate) {
            // Ngày bắt đầu phải trước ngày kết thúc
            if (new Date(startDate) > new Date(endDate)) {
                setExportWarning('Ngày bắt đầu phải nhỏ hơn ngày kết thúc')
                return
            }

            // Giới hạn khoảng thời gian tối đa 1 năm để tránh file quá lớn
            const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            if (diffDays > 365) {
                setExportWarning('Khoảng thời gian không được vượt quá 1 năm')
                return
            }
        }

        setIsExporting(true)
        setExportWarning(null)

        try {
            const blob = await attendanceApi.exportAttendanceBySubject(
                subjectId,
                useDateRange && startDate ? startDate : undefined,
                useDateRange && endDate ? endDate : undefined,
                exportFormat
            )

            // Kiểm tra file có dữ liệu không (file Excel rỗng thường rất nhỏ)
            if (blob.size < 500) {
                setExportWarning('Không tìm thấy buổi học nào trong khoảng thời gian đã chọn')
                return
            }

            // Tạo tên file theo format và khoảng thời gian
            const extension = exportFormat === 'excel' ? 'xlsx' : 'csv'
            const dateStr = useDateRange && startDate && endDate
                ? `_${startDate}_to_${endDate}`
                : ''
            const filename = `attendance_subject_${subjectId}${dateStr}.${extension}`

            // Tạo link download và tự động tải file
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            onExportSuccess?.()
            setShowExportOptions(false)
        } catch (error: any) {
            // Bắt lỗi từ backend và hiển thị thân thiện
            const errorMessage = error?.response?.data?.message || error?.message || 'Export thất bại'

            // Nếu là lỗi không có dữ liệu thì hiển thị cảnh báo thay vì báo lỗi
            if (errorMessage.toLowerCase().includes('không có dữ liệu') ||
                errorMessage.toLowerCase().includes('no data') ||
                errorMessage.toLowerCase().includes('empty')) {
                setExportWarning('Không tìm thấy buổi học nào trong khoảng thời gian đã chọn')
            } else {
                onExportError?.(errorMessage)
            }
        } finally {
            setIsExporting(false)
        }
    }

    // ==================== XỬ LÝ IMPORT ====================

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setImportResult(null)
        }
    }

    const handleImport = async () => {
        if (!selectedFile) {
            alert('Vui lòng chọn file để import')
            return
        }

        setIsImporting(true)
        setImportResult(null)

        try {
            const result = await attendanceApi.importAttendance(selectedFile, importFormat)

            // Kiểm tra dữ liệu trả về hợp lệ
            if (!result || typeof result !== 'object') {
                throw new Error('Dữ liệu trả về không hợp lệ')
            }

            // Đảm bảo tất cả các trường đều có giá trị mặc định
            const safeResult: ImportResult = {
                successCount: result.successCount ?? 0,
                errorCount: result.errorCount ?? 0,
                totalRecords: result.totalRecords ?? 0,
                message: result.message || 'Import hoàn tất',
                status: result.status || (result.errorCount > 0 ? 'partial_success' : 'success'),
                errors: Array.isArray(result.errors) ? result.errors : []
            }

            setImportResult(safeResult)

            // Gọi callback khi import thành công (dù có lỗi hay không)
            if (safeResult.status === 'success' || safeResult.status === 'partial_success') {
                onImportSuccess?.(safeResult)
            }

            // Nếu toàn bộ đều lỗi thì báo lỗi
            if (safeResult.errorCount > 0 && safeResult.successCount === 0) {
                const errorMessages = safeResult.errors.map(e => e.errorMessage).join(', ')
                onImportError?.(`Import thất bại: ${errorMessages}`)
            }

        } catch (error) {
            console.error('Lỗi import:', error)

            const message = error instanceof Error ? error.message : 'Import thất bại'

            setImportResult({
                successCount: 0,
                errorCount: 1,
                totalRecords: 0,
                message: message,
                status: 'error',
                errors: [{
                    rowNumber: 0,
                    data: null as any,
                    errorMessage: message
                }]
            })

            onImportError?.(message)

        } finally {
            setIsImporting(false)
        }
    }

    // ==================== TẢI TEMPLATE ====================

    const handleDownloadTemplate = async () => {
        setIsDownloadingTemplate(true)
        try {
            const blob = await attendanceApi.downloadImportTemplate(importFormat)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `attendance_import_template.${importFormat === 'excel' ? 'xlsx' : 'csv'}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Lỗi tải template:', error)
        } finally {
            setIsDownloadingTemplate(false)
        }
    }

    // ==================== RESET VÀ ĐÓNG DIALOG ====================

    const resetImport = () => {
        setSelectedFile(null)
        setImportResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const closeImportDialog = () => {
        setShowImportDialog(false)
        resetImport()
    }

    // ==================== RENDER UI ====================

    return (
        <div className={clsx("flex items-center gap-2", className)}>
            {/* ====== NÚT EXPORT ====== */}
            <div className="relative">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowExportOptions(!showExportOptions)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900/50 transition-all border border-green-200 dark:border-green-800"
                >
                    <FileDown size={16} />
                    <span>Export</span>
                    <ChevronDown size={14} className={clsx(
                        "transition-transform duration-200",
                        showExportOptions && "rotate-180"
                    )} />
                </motion.button>

                {/* ====== POPUP TÙY CHỌN EXPORT ====== */}
                <AnimatePresence>
                    {showExportOptions && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                        >
                            <div className="p-4 space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Tùy chọn export
                                    </h4>
                                    <button
                                        onClick={() => {
                                            setShowExportOptions(false)
                                            setExportWarning(null)
                                        }}
                                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <X size={14} className="text-gray-400" />
                                    </button>
                                </div>

                                {/* Chọn định dạng file */}
                                <div>
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">
                                        Định dạng file
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setExportFormat('excel')}
                                            className={clsx(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                                exportFormat === 'excel'
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                                                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            <FileSpreadsheet size={14} />
                                            Excel
                                        </button>
                                        <button
                                            onClick={() => setExportFormat('csv')}
                                            className={clsx(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                                                exportFormat === 'csv'
                                                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800"
                                                    : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            )}
                                        >
                                            <FileText size={14} />
                                            CSV
                                        </button>
                                    </div>
                                </div>

                                {/* Chọn khoảng thời gian */}
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={useDateRange}
                                            onChange={(e) => {
                                                setUseDateRange(e.target.checked)
                                                setExportWarning(null)
                                            }}
                                            className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                        />
                                        <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Chọn khoảng thời gian
                                        </label>
                                    </div>

                                    {useDateRange && (
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[10px] text-gray-400 block mb-0.5">Từ ngày</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(e.target.value)
                                                        setExportWarning(null)
                                                    }}
                                                    className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] text-gray-400 block mb-0.5">Đến ngày</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => {
                                                        setEndDate(e.target.value)
                                                        setExportWarning(null)
                                                    }}
                                                    className="w-full px-2 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Cảnh báo */}
                                {exportWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg"
                                    >
                                        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-amber-700 dark:text-amber-400">
                                                {exportWarning}
                                            </p>
                                            <button
                                                onClick={() => setExportWarning(null)}
                                                className="text-[10px] text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 mt-1"
                                            >
                                                Đóng
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Nút Export */}
                                <button
                                    onClick={handleExport}
                                    disabled={isExporting || (useDateRange && (!startDate || !endDate))}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isExporting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Đang xuất...
                                        </>
                                    ) : (
                                        <>
                                            <Download size={16} />
                                            Xuất file
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ====== NÚT IMPORT ====== */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowImportDialog(!showImportDialog)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all border border-blue-200 dark:border-blue-800"
            >
                <FileUp size={16} />
                <span>Import</span>
                <ChevronDown size={14} className={clsx(
                    "transition-transform duration-200",
                    showImportDialog && "rotate-180"
                )} />
            </motion.button>

            {/* ====== DIALOG IMPORT ====== */}
            <AnimatePresence>
                {showImportDialog && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-[440px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                        style={{ top: '100%' }}
                    >
                        <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileUp size={18} className="text-blue-500" />
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Import điểm danh
                                    </h4>
                                </div>
                                <button
                                    onClick={closeImportDialog}
                                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <X size={14} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Hướng dẫn tải template */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3">
                                <div className="flex items-start gap-3">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <FileText size={14} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                            Chưa có file import?
                                        </p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                                            Tải template mẫu để điền dữ liệu hoặc dùng file đã export
                                        </p>
                                        <div className="flex gap-1.5 mt-1.5">
                                            <button
                                                onClick={() => setImportFormat('excel')}
                                                className={clsx(
                                                    "px-2 py-0.5 rounded text-[10px] font-medium transition-all",
                                                    importFormat === 'excel'
                                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                )}
                                            >
                                                Excel
                                            </button>
                                            <button
                                                onClick={() => setImportFormat('csv')}
                                                className={clsx(
                                                    "px-2 py-0.5 rounded text-[10px] font-medium transition-all",
                                                    importFormat === 'csv'
                                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                                )}
                                            >
                                                CSV
                                            </button>
                                            <button
                                                onClick={handleDownloadTemplate}
                                                disabled={isDownloadingTemplate}
                                                className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-600 text-white rounded text-[10px] font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                                            >
                                                {isDownloadingTemplate ? (
                                                    <Loader2 size={10} className="animate-spin" />
                                                ) : (
                                                    <Download size={10} />
                                                )}
                                                Tải template
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chọn file */}
                            <div>
                                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">
                                    Chọn file import
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={importFormat === 'excel' ? '.xlsx,.xls' : '.csv'}
                                    onChange={handleFileChange}
                                    className="block w-full text-xs text-gray-500 dark:text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
                                />
                                {selectedFile && (
                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                                        <FileText size={10} />
                                        {selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)} KB)
                                    </p>
                                )}
                            </div>

                            {/* Nút Import */}
                            <button
                                onClick={handleImport}
                                disabled={!selectedFile || isImporting}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Đang import...
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        Import
                                    </>
                                )}
                            </button>

                            {/* Kết quả import */}
                            {importResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={clsx(
                                        "rounded-xl p-3 border",
                                        importResult.status === 'success'
                                            ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800"
                                            : importResult.status === 'partial_success'
                                                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                                    )}
                                >
                                    <div className="flex items-start gap-2.5">
                                        {importResult.status === 'success' ? (
                                            <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                        ) : importResult.status === 'partial_success' ? (
                                            <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <X size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className={clsx(
                                                "text-sm font-medium",
                                                importResult.status === 'success'
                                                    ? "text-emerald-700 dark:text-emerald-400"
                                                    : importResult.status === 'partial_success'
                                                        ? "text-amber-700 dark:text-amber-400"
                                                        : "text-red-700 dark:text-red-400"
                                            )}>
                                                {importResult.message}
                                            </p>
                                            <div className="flex flex-wrap gap-3 mt-1.5 text-xs">
                                                <span className="text-emerald-600 dark:text-emerald-400">
                                                    Thành công: {importResult.successCount}
                                                </span>
                                                <span className="text-red-600 dark:text-red-400">
                                                    Lỗi: {importResult.errorCount}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Tổng: {importResult.totalRecords}
                                                </span>
                                            </div>

                                            {importResult.errors.length > 0 && (
                                                <div className="mt-2 max-h-32 overflow-y-auto">
                                                    <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        Chi tiết lỗi:
                                                    </p>
                                                    <div className="space-y-0.5">
                                                        {importResult.errors.map((err, idx) => (
                                                            <div key={idx} className="text-[10px] text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                                                                Dòng {err.rowNumber}: {err.errorMessage}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}