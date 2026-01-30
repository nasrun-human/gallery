import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MediaCard from '../components/MediaCard';
import { Heart } from 'lucide-react';

const Saved = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await axios.get('/api/media/user/saved');
                setMedia(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSaved();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="w-6 h-6 text-pink-600 fill-current" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Saved Collection</h1>
                    <p className="text-gray-500 text-sm">Your personal favorites</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500">You haven't saved any items yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {media.map(item => (
                        <MediaCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Saved;
