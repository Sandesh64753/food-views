import React, { useState, useRef } from 'react'
import './CreateFood.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const MAX_VIDEO_MB = 40 // reasonable client-side limit

const CreateFood = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('') // NEW: food name state
  const [videoFile, setVideoFile] = useState(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoMeta, setVideoMeta] = useState({})
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    setError('')
    if (!file) return
    const isVideo = file.type.startsWith('video/')
    if (!isVideo) return setError('Please select a video file')
    const sizeMb = file.size / (1024 * 1024)
    if (sizeMb > MAX_VIDEO_MB) return setError(`Video too large. Max ${MAX_VIDEO_MB} MB`)

    const url = URL.createObjectURL(file)
    setVideoFile(file)
    setVideoUrl(url)

    // read basic metadata like duration
    const tempVideo = document.createElement('video')
    tempVideo.preload = 'metadata'
    tempVideo.src = url
    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration || 0
      setVideoMeta({ duration: Math.round(dur) })
      tempVideo.src = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) return setError('Please enter food name')
    if (!videoFile) return setError('Please attach a video')
    if (!description.trim()) return setError('Please add a short description')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('video', videoFile)

    const response = await axios.post("https://food-views-backend.onrender.com/api/food", formData,{
      withCredentials:true
    })

    console.log(response.data)
    navigate("/")
  }

  const handleRemove = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    setVideoFile(null)
    setVideoUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const [dragActive, setDragActive] = useState(false)
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="create-shell">
      <div className="create-card">
        <header className="create-header">
          <h2 className="create-title">Create food reel</h2>
          <p className="create-sub">Add a short video and description for your food item.</p>
        </header>

        <form className="create-form" onSubmit={handleSubmit} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
          
          {/* Food Name Field */}
          <label className="field">
            <span className="field-label">Food Name</span>
            <input
              type="text"
              className="file-input"
              placeholder="Enter food name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
          </label>

          {/* Video Field */}
          <label className="field">
            <span className="field-label">Video</span>
            <div className={`dropzone ${dragActive ? 'drag-active' : ''}`} onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="file-input-hidden"
              />

              {!videoUrl ? (
                <div className="dropzone-empty">
                  <div className="drop-icon">📹</div>
                  <div className="drop-text">Tap or drop a short video here</div>
                  <div className="drop-sub">MP4/WebM recommended — max {MAX_VIDEO_MB} MB</div>
                </div>
              ) : (
                <div className="dropzone-file">
                  <div className="file-thumb"> 
                    <video src={videoUrl} className="thumb-video" muted />
                  </div>
                  <div className="file-meta">
                    <div className="file-name">{videoFile?.name}</div>
                    <div className="file-info">{(videoFile?.size / (1024*1024)).toFixed(1)} MB • {videoMeta?.duration ? `${videoMeta.duration}s` : '—'}</div>
                  </div>
                </div>
              )}
            </div>
            <small className="hint">You can drag & drop or tap to choose.</small>
          </label>

          {/* Description Field */}
          <label className="field">
            <span className="field-label">Description</span>
            <textarea
              className="textarea"
              placeholder="Short description (ingredients, highlights)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={220}
            />
            <div className="meta-row">
              <small className="char-count">{description.length}/220</small>
            </div>
          </label>

          {error && <div className="error">{error}</div>}

          {videoUrl ? (
            <div className="preview">
              <video src={videoUrl} controls className="preview-video" />
              <div className="preview-actions">
                <button type="button" className="btn btn-ghost" onClick={handleRemove}>Remove</button>
              </div>
            </div>
          ) : (
            <div className="empty-preview">No video selected yet</div>
          )}

          <div className="actions">
            <button type="submit" className="btn btn-primary">Publish</button>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFood
