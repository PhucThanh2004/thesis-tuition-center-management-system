// api/material.ts
import axios from '../axios'
import type { 
  Material, 
  MaterialResponse, 
  SingleMaterialResponse,
  DeleteMaterialResponse 
} from '../types/material'

export const materialApi = {
  // ✅ 1. GET materials by subject
  getBySubject(subjectId: number): Promise<MaterialResponse> {
    return axios.get(`/materials/subject/${subjectId}`)
  },

  // ✅ 2. UPLOAD material
  upload(data: {
    title: string
    subjectId: number
    userId: number
    file: File
  }): Promise<SingleMaterialResponse> {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subjectId', String(data.subjectId))
    formData.append('userId', String(data.userId))
    formData.append('file', data.file)

    return axios.post('/materials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // ✅ 3. UPDATE material - SỬA ENDPOINT ĐÚNG
  update(
    materialId: number,
    data: {
      file?: File
      title?: string
    }
  ): Promise<SingleMaterialResponse> {
    const formData = new FormData()
    if (data.file) formData.append('file', data.file)
    if (data.title) formData.append('title', data.title)

    // SỬA: endpoint phải là `/materials/${materialId}` vì backend dùng @PutMapping("/materials/{materialId}")
    return axios.put(`/materials/${materialId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // ✅ 4. DELETE material
  delete(materialId: number): Promise<DeleteMaterialResponse> {
    return axios.delete(`/materials/${materialId}`)
  },

  // ============= CÁC UTILITY FUNCTION =============
  
  getDownloadUrl(fileURL: string): string {
    const baseURL = import.meta.env.VITE_BACKEND_URL
    const cleanFileURL = fileURL.startsWith('/') ? fileURL : `/${fileURL}`
    return `${baseURL}${cleanFileURL}`
  },

  downloadFile(fileURL: string, fileName?: string): void {
    const url = this.getDownloadUrl(fileURL)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || url.split('/').pop() || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  previewFile(fileURL: string): void {
    const url = this.getDownloadUrl(fileURL)
    window.open(url, '_blank')
  },

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}