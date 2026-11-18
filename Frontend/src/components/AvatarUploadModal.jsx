import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const AvatarUploadModal = ({ isOpen, onClose, onSuccess }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Filter to only accept images
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    setFiles((prev) => [...prev, ...imageFiles]);
    
    const newPreviews = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    
    // Revoke URL and remove from previews
    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('avatars[]', file);
    });

    try {
      // Use the configured API client so the request goes to the backend and
      // receives the current Bearer token/refresh-cookie handling.
      const response = await api.post('/auth/avatar/upload', formData);
      
      onSuccess(response.data.avatars);
      onClose();
      // Reset state
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Avatars</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 mb-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={40} className="text-purple-500" />
            <span className="text-gray-600 dark:text-gray-400">Click to upload images</span>
          </label>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading || files.length === 0}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Save Avatars'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
