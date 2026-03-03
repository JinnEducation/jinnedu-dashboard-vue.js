import axiosClient from "../plugins/axios"

export const uploadVideo = (file, onProgress) => {
  const form = new FormData()
  form.append("file", file)

  return axiosClient.post("/admin/upload/video", form, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: (e) => {
      if (!onProgress) return
      const percent = Math.round((e.loaded * 100) / e.total)
      onProgress(percent)
    }
  })
}

export const uploadConferenceRecordingVideo = (file, onProgress) => {
  const form = new FormData()
  form.append("file", file)

  return axiosClient.post("/conference-recordings/upload/video", form, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    onUploadProgress: (e) => {
      if (!onProgress) return
      const percent = Math.round((e.loaded * 100) / e.total)
      onProgress(percent)
    }
  })
}
