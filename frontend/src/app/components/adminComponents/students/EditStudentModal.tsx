// src/app/components/students/EditStudentModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  School,
  MapPin,
  Users,
  Image,
  Plus,
  Minus,
  Eye,
  Check,
  Clock,
  BookOpen,
  Home,
  UserPlus,
  Camera,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Save,
  Edit
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import type { ParentContact, Student } from '../../../utils/types/student';
import { buildStudentFormData, studentApi } from '../../../utils/api/student.api';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (formData: FormData) => void;
  onDelete: (studentId: number) => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    gender: true,
    dateOfBirth: '',
    grade: '',
    schoolName: '',
    roleId: 'R2',
    password: '123456',
    status: true,
    address: {
      details: '',
      ward: '',
      province: ''
    },
    parents: [] as ParentContact[],
    subjectIds: [] as string[]
  });

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guardians, setGuardians] = useState<ParentContact[]>([
    { fullName: '', phoneNumber: '', relationship: 'Mẹ' }
  ]);

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'guardian'>('info');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFullImageUrl = (imagePath: string | null | undefined): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = import.meta.env.VITE_BACKEND_URL_IMAGE || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
    const cleanBaseUrl = baseUrl.replace(/\/v1\/api$/, '');
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${cleanBaseUrl}${path}`;
  };

  // Pre-fill khi student thay đổi
  useEffect(() => {
    if (student) {
      // Tách họ và tên
      const nameParts = student.fullName?.trim().split(' ') || [];
      const lastName = nameParts.pop() || '';
      const firstName = nameParts.join(' ') || '';

      setFirstName(firstName);
      setLastName(lastName);
      
      setFormData({
        email: student.email || '',
        fullName: student.fullName || '',
        phoneNumber: student.phoneNumber || '',
        gender: student.gender ?? true,
        dateOfBirth: student.dateOfBirth?.split('T')[0] || '',
        grade: student.grade || '',
        schoolName: student.schoolName || '',
        roleId: 'R2',
        password: '123456',
        status: student.status ?? true,
        address: {
          details: student.address?.details || '',
          ward: student.address?.ward || '',
          province: student.address?.province || ''
        },
        parents: student.parents?.map(p => ({
          fullName: p.fullName,
          phoneNumber: p.phoneNumber,
          relationship: p.relationship
        })) || [],
        subjectIds: []
      });

      setGuardians(
        student.parents?.map(p => ({
          fullName: p.fullName,
          phoneNumber: p.phoneNumber,
          relationship: p.relationship
        })) || [{ fullName: '', phoneNumber: '', relationship: 'Mẹ' }]
      );

      setPreviewPhoto(getFullImageUrl(student.image));
      setPhotoFile(null);
      setErrors({});
    }
  }, [student]);

  // Ghép họ tên
  useEffect(() => {
    const fullName = `${firstName} ${lastName}`.trim();
    setFormData(prev => ({ ...prev, fullName }));
  }, [firstName, lastName]);

  // Đồng bộ guardians vào parents
  useEffect(() => {
    const validParents = guardians.filter(g => g.fullName && g.phoneNumber);
    setFormData(prev => ({ ...prev, parents: validParents }));
  }, [guardians]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'gender') {
      setFormData(prev => ({ ...prev, gender: value === 'true' }));
    } else if (name === 'grade') {
      setFormData(prev => ({ ...prev, grade: value }));
    } else if (name === 'schoolName') {
      setFormData(prev => ({ ...prev, schoolName: value }));
    } else if (name === 'email') {
      setFormData(prev => ({ ...prev, email: value }));
    } else if (name === 'phoneNumber') {
      setFormData(prev => ({ ...prev, phoneNumber: value }));
    } else if (name === 'dateOfBirth') {
      setFormData(prev => ({ ...prev, dateOfBirth: value }));
    } else if (name === 'status') {
      setFormData(prev => ({ ...prev, status: value === 'true' }));
    } else if (name === 'addressDetails') {
      setFormData(prev => ({
        ...prev,
        address: {
          details: value,
          ward: prev.address?.ward ?? '',
          province: prev.address?.province ?? ''
        }
      }));
    } else if (name === 'addressWard') {
      setFormData(prev => ({
        ...prev,
        address: {
          details: prev.address?.details ?? '',
          ward: value,
          province: prev.address?.province ?? ''
        }
      }));
    } else if (name === 'addressProvince') {
      setFormData(prev => ({
        ...prev,
        address: {
          details: prev.address?.details ?? '',
          ward: prev.address?.ward ?? '',
          province: value
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = 'Vui lòng nhập họ và tên đệm';
    if (!lastName.trim()) newErrors.lastName = 'Vui lòng nhập tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
    if (!formData.grade) newErrors.grade = 'Vui lòng chọn lớp';
    if (!formData.schoolName.trim()) newErrors.schoolName = 'Vui lòng nhập tên trường';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email không đúng định dạng';
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 2MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGuardianChange = (index: number, field: keyof ParentContact, value: string) => {
    setGuardians(prev => prev.map((g, i) =>
      i === index ? { ...g, [field]: value } : g
    ));
  };

  const handleAddGuardian = () => {
    setGuardians(prev => [
      ...prev,
      { fullName: '', phoneNumber: '', relationship: 'Mẹ' }
    ]);
  };

  const handleRemoveGuardian = (index: number) => {
    if (guardians.length > 1) {
      setGuardians(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const studentData = {
      id: student?.id,
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      gender: formData.gender,
      status: formData.status,
      dateOfBirth: formData.dateOfBirth,
      grade: formData.grade,
      schoolName: formData.schoolName.trim(),
      address: {
        details: formData.address.details,
        ward: formData.address.ward,
        province: formData.address.province,
      },
      parents: guardians.filter(g => g.fullName && g.phoneNumber),
    };

    const submitFormData = buildStudentFormData(studentData, photoFile || undefined);
    
    await onSave(submitFormData);

    if (photoFile) {
      try {
        const avatarFormData = new FormData();
        avatarFormData.append('file', photoFile);
        const response = await studentApi.updateAvatar(student!.id, avatarFormData);
        if (response.errCode !== 0) {
          console.warn('Upload avatar failed:', response.message);
        }
      } catch (error) {
        console.error('Avatar upload error:', error);
      }
    }

    setIsSubmitting(false);
  };

  const handleDelete = () => {
    if (student && window.confirm('Bạn có chắc muốn xóa học sinh này?')) {
      onDelete(student.id);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa nhập';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const calculateAge = (dateString: string) => {
    if (!dateString) return null;
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(formData.dateOfBirth);
  const fullAddress = [
    formData.address?.details,
    formData.address?.ward,
    formData.address?.province
  ].filter(Boolean).join(', ') || 'Chưa nhập';

  // Lọc phụ huynh có thông tin
  const validGuardians = guardians.filter(g => g.fullName && g.phoneNumber);

  if (!isOpen || !student) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center">
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
          className="relative w-full max-w-[880px] max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/50"
        >
          {/* Decorative gradient header */}
          <div className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-50/80 via-white to-transparent dark:from-indigo-950/30 dark:via-slate-900/50">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-indigo-400/10 to-violet-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl btn-gradient text-white shadow-lg shadow-indigo-500/25">
                  <Edit size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Chỉnh sửa học sinh
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Cập nhật thông tin học sinh
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-row h-[calc(90vh-180px)]">
            {/* Form Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActiveTab('info')}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                      activeTab === 'info'
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <User size={16} />
                    Thông tin cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('guardian')}
                    className={cn(
                      "flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                      activeTab === 'guardian'
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <Users size={16} />
                    Phụ huynh
                  </button>
                </div>

                {/* Photo Upload */}
                <div className="flex items-center gap-6 p-4 bg-gradient-to-br from-indigo-50/50 to-violet-50/50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-xl border border-indigo-100/60 dark:border-indigo-800/30">
                  <div className="relative group">
                    <div className={cn(
                      "w-20 h-20 rounded-full border-4 transition-all duration-300 flex items-center justify-center overflow-hidden",
                      previewPhoto
                        ? "border-indigo-200 dark:border-indigo-700 shadow-lg"
                        : "border-dashed border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800"
                    )}>
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                          <Camera size={24} />
                          <span className="text-[8px] mt-1 font-medium">Ảnh</span>
                        </div>
                      )}
                    </div>
                    {previewPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewPhoto(null);
                          setPhotoFile(null);
                        }}
                        className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <Image size={16} />
                        Đổi ảnh
                      </div>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/jpeg,image/png,image/gif"
                      className="hidden"
                    />
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">JPG, PNG hoặc GIF. Tối đa 2MB.</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === 'info' && (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Basic Info Grid */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <User size={15} className="text-indigo-500" />
                            Họ và tên đệm <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              if (errors.firstName) setErrors({ ...errors, firstName: '' });
                            }}
                            placeholder="VD: Nguyễn Văn"
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.firstName
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.firstName && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.firstName}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <User size={15} className="text-indigo-500" />
                            Tên <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              if (errors.lastName) setErrors({ ...errors, lastName: '' });
                            }}
                            placeholder="VD: A"
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.lastName
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.lastName && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.lastName}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <Calendar size={15} className="text-indigo-500" />
                            Ngày sinh <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.dateOfBirth) setErrors({ ...errors, dateOfBirth: '' });
                            }}
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.dateOfBirth
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.dateOfBirth && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.dateOfBirth}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <Users size={15} className="text-indigo-500" />
                            Giới tính
                          </label>
                          <select
                            name="gender"
                            value={formData.gender ? 'true' : 'false'}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer appearance-none"
                          >
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                          </select>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div className="col-span-2">
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <Mail size={15} className="text-indigo-500" />
                            Email <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.email) setErrors({ ...errors, email: '' });
                            }}
                            placeholder="hocsinh@example.com"
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.email
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.email}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <Phone size={15} className="text-indigo-500" />
                            Số điện thoại <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                            }}
                            placeholder="0123456789"
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.phoneNumber
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.phoneNumber && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.phoneNumber}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <BookOpen size={15} className="text-indigo-500" />
                            Lớp <span className="text-rose-500">*</span>
                          </label>
                          <select
                            name="grade"
                            value={formData.grade}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.grade) setErrors({ ...errors, grade: '' });
                            }}
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none",
                              errors.grade
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          >
                            <option value="">Chọn lớp</option>
                            <option value="6">Lớp 6</option>
                            <option value="7">Lớp 7</option>
                            <option value="8">Lớp 8</option>
                            <option value="9">Lớp 9</option>
                            <option value="10">Lớp 10</option>
                            <option value="11">Lớp 11</option>
                            <option value="12">Lớp 12</option>
                          </select>
                          {errors.grade && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.grade}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* School & Address */}
                      <div className="space-y-3">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <School size={15} className="text-indigo-500" />
                            Tên trường <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={(e) => {
                              handleInputChange(e);
                              if (errors.schoolName) setErrors({ ...errors, schoolName: '' });
                            }}
                            placeholder="VD: THCS Ngô Chí Quốc"
                            className={cn(
                              "w-full px-3.5 py-2 rounded-xl border-2 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                              errors.schoolName
                                ? "border-rose-300 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/20"
                                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                            )}
                          />
                          {errors.schoolName && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={12} />
                              {errors.schoolName}
                            </motion.p>
                          )}
                        </div>

                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <Home size={15} className="text-indigo-500" />
                            Địa chỉ
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              name="addressDetails"
                              value={formData.address?.details ?? ''}
                              onChange={handleInputChange}
                              placeholder="Số nhà, đường"
                              className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600"
                            />
                            <input
                              type="text"
                              name="addressWard"
                              value={formData.address?.ward ?? ''}
                              onChange={handleInputChange}
                              placeholder="Phường/Xã"
                              className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600"
                            />
                            <input
                              type="text"
                              name="addressProvince"
                              value={formData.address?.province ?? ''}
                              onChange={handleInputChange}
                              placeholder="Tỉnh/Thành phố"
                              className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600"
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            <CheckCircle2 size={15} className="text-indigo-500" />
                            Trạng thái
                          </label>
                          <select
                            name="status"
                            value={formData.status ? 'true' : 'false'}
                            onChange={handleInputChange}
                            className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
                          >
                            <option value="true">Đang hoạt động</option>
                            <option value="false">Ngưng hoạt động</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'guardian' && (
                    <motion.div
                      key="guardian"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Users size={18} className="text-indigo-500" />
                          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Thông tin phụ huynh</h2>
                          <span className="text-xs text-slate-400">({guardians.length})</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddGuardian}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-all"
                        >
                          <Plus size={14} />
                          Thêm phụ huynh
                        </button>
                      </div>

                      <div className="space-y-3">
                        {guardians.map((guardian, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                          >
                            {guardians.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveGuardian(index)}
                                className="absolute -top-2 -right-2 p-1 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-all border border-rose-200 dark:border-rose-800"
                              >
                                <Minus size={12} />
                              </button>
                            )}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Họ tên phụ huynh
                                </label>
                                <input
                                  type="text"
                                  value={guardian.fullName}
                                  onChange={(e) => handleGuardianChange(index, 'fullName', e.target.value)}
                                  placeholder="VD: Nguyễn Văn A"
                                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Số điện thoại
                                </label>
                                <input
                                  type="tel"
                                  value={guardian.phoneNumber}
                                  onChange={(e) => handleGuardianChange(index, 'phoneNumber', e.target.value)}
                                  placeholder="0123456789"
                                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                  Mối quan hệ
                                </label>
                                <select
                                  value={guardian.relationship}
                                  onChange={(e) => handleGuardianChange(index, 'relationship', e.target.value)}
                                  className="w-full px-3.5 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer appearance-none"
                                >
                                  <option value="Ba">Ba</option>
                                  <option value="Mẹ">Mẹ</option>
                                  <option value="Anh">Anh</option>
                                  <option value="Chị">Chị</option>
                                  <option value="Ông">Ông</option>
                                  <option value="Bà">Bà</option>
                                  <option value="Người giám hộ">Người giám hộ</option>
                                </select>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {guardians.length === 0 && (
                        <div className="text-center py-8">
                          <Users size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có thông tin phụ huynh</p>
                          <button
                            type="button"
                            onClick={handleAddGuardian}
                            className="mt-3 text-indigo-500 text-sm font-semibold hover:text-indigo-600"
                          >
                            + Thêm phụ huynh đầu tiên
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Right Sidebar Preview - Tất cả thông tin trong 1 card */}
            <aside className="w-[300px] bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-800/10 border-l border-slate-200 dark:border-slate-700 p-5 space-y-4 hidden lg:block overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {/* Info Card - Bao gồm tất cả thông tin */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-violet-50/70 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100/60 dark:border-indigo-800/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/40">
                    <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
                    Thông tin hồ sơ
                  </p>
                </div>

                {/* Avatar */}
                <div className="flex justify-center mb-3">
                  <div className="w-16 h-16 rounded-full border-3 border-white dark:border-slate-700 overflow-hidden shadow-md bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50">
                    {previewPhoto ? (
                      <img src={previewPhoto} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xl font-bold">
                        {firstName ? firstName[0].toUpperCase() : '?'}
                        {lastName ? lastName[0].toUpperCase() : ''}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Họ tên</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {firstName || '---'} {lastName || '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Lớp</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formData.grade ? `Lớp ${formData.grade}` : '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Ngày sinh</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formData.dateOfBirth ? `${formatDate(formData.dateOfBirth)} ${age !== null ? `(${age} tuổi)` : ''}` : '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Giới tính</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formData.gender ? 'Nam' : 'Nữ'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Email</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px] text-right">
                      {formData.email || '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Điện thoại</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formData.phoneNumber || '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Trường</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px] text-right">
                      {formData.schoolName || '---'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1 border-b border-indigo-100/50 dark:border-indigo-800/30">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Địa chỉ</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[160px] text-right">
                      {fullAddress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 py-1">
                    <span className="text-indigo-500 dark:text-indigo-400 font-medium">Trạng thái</span>
                    <span className={cn(
                      "font-semibold px-2 py-0.5 rounded-full text-[10px]",
                      formData.status
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                    )}>
                      {formData.status ? 'Đang hoạt động' : 'Ngưng hoạt động'}
                    </span>
                  </div>
                </div>

                {/* Phụ huynh - nằm trong cùng card */}
                {validGuardians.length > 0 && (
                  <>
                    <div className="mt-3 pt-2 border-t border-indigo-200/50 dark:border-indigo-700/30">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Users size={13} className="text-indigo-500 dark:text-indigo-400" />
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          Phụ huynh ({validGuardians.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {validGuardians.map((guardian, idx) => (
                          <div key={idx} className="bg-white/60 dark:bg-slate-800/40 rounded-lg p-2 border border-indigo-100/50 dark:border-indigo-800/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/50 dark:to-violet-900/50 flex items-center justify-center flex-shrink-0">
                                  <span className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                                    {guardian.fullName.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  {guardian.fullName}
                                </span>
                              </div>
                              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">
                                {guardian.relationship}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 pl-6.5">
                              <Phone size={10} className="text-slate-400 dark:text-slate-500" />
                              <span>{guardian.phoneNumber}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </aside>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all duration-200"
            >
              <Trash2 size={16} />
              Xóa học sinh
            </button>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white btn-gradient rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />
                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditStudentModal;