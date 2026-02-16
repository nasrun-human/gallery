import React, { useState } from 'react';
import { Download, Heart, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MediaCard = ({ item }) => {
    const { user } = useAuth();
    const [saved, setSaved] = useState(false);

    // Determine if the source is a full URL (Cloudinary) or a local path
    const getMediaSrc = (filename) => {
        if (filename.startsWith('http')) {
            return filename;
        }
        return `/uploads/${filename}`;
    };

    const mediaSrc = getMediaSrc(item.filename);

    const handleSave = async () => {
        if (!user) return alert('Please login to save');
        try {
            await axios.post(`/api/media/save/${item.id}`);
            setSaved(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(mediaSrc);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = item.filename.split('/').pop(); // Handle full URL filename
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Download failed', err);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100 group">
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {item.type === 'video' ? (
                    <video 
                        src={mediaSrc} 
                        className="w-full h-full object-cover" 
                        controls 
                    />
                ) : (
                    <img 
                        src={mediaSrc} 
                        alt={item.description} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                )}
                
                {/* Overlay Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={handleSave}
                        className={`p-2 rounded-full backdrop-blur-md ${saved ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                    >
                        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                    <button 
                        onClick={handleDownload}
                        className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="p-4">
                <p className="text-gray-900 font-medium truncate">{item.description || 'Untitled'}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <User className="w-3 h-3" />
                    <span>{item.username || 'Unknown User'}</span>
                </div>
            </div>
        </div>
    );
};

export default MediaCard;
