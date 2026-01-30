import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, Video, X } from 'lucide-react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [description, setDescription] = useState('');
    const [type, setType] = useState('image');
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            if (selectedFile.type.startsWith('video')) {
                setType('video');
            } else {
                setType('image');
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('type', type);

        setUploading(true);
        try {
            await axios.post('/api/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <UploadCloud className="w-6 h-6 text-indigo-600" />
                        Upload Media
                    </h2>
                </div>
                
                <form onSubmit={handleUpload} className="p-6 space-y-6">
                    {/* File Drop Zone / Preview */}
                    <div className="w-full">
                        {preview ? (
                            <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={() => { setFile(null); setPreview(null); }}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {type === 'video' ? (
                                    <video src={preview} className="w-full max-h-96 object-contain" controls />
                                ) : (
                                    <img src={preview} alt="Preview" className="w-full max-h-96 object-contain" />
                                )}
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadCloud className="w-12 h-12 text-gray-400 mb-3" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or MP4 (MAX. 10MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                            </label>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description / Caption</label>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-24"
                            placeholder="What's this about?"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Type Selection (Auto-detected but shown) */}
                    <div className="flex gap-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${type === 'image' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                            <ImageIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">Image</span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${type === 'video' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                            <Video className="w-4 h-4" />
                            <span className="text-sm font-medium">Video</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium flex justify-center items-center gap-2 ${
                                !file || uploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                            }`}
                        >
                            {uploading ? 'Uploading...' : 'Share Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Upload;
