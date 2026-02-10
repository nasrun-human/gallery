import React from 'react';
import { X, Smartphone, Upload, Heart, User, Search, Menu } from 'lucide-react';

const UserGuideModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-y-auto shadow-2xl transform transition-all scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📖</span> คู่มือการใช้งาน
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 1. Register/Login */}
            <div className="flex gap-4">
              <div className="bg-indigo-100 p-3 rounded-xl h-fit shrink-0">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">1. เริ่มต้นใช้งาน</h3>
                <p className="text-sm text-gray-600 mt-1">
                  สมัครสมาชิกง่ายๆ ด้วย Username และเบอร์โทรศัพท์ จากนั้นเข้าสู่ระบบเพื่อเริ่มใช้งาน
                </p>
              </div>
            </div>

            {/* 2. Upload */}
            <div className="flex gap-4">
              <div className="bg-pink-100 p-3 rounded-xl h-fit shrink-0">
                <Upload className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">2. อัปโหลดรูป/วิดีโอ</h3>
                <p className="text-sm text-gray-600 mt-1">
                  กดเมนู <b>Upload</b> หรือปุ่ม <b>+</b> เพื่อฝากรูปภาพหรือวิดีโอของคุณเก็บไว้บน Cloud
                </p>
              </div>
            </div>

             {/* 3. Save/Download */}
             <div className="flex gap-4">
              <div className="bg-yellow-100 p-3 rounded-xl h-fit shrink-0">
                <Heart className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">3. บันทึกและดาวน์โหลด</h3>
                <p className="text-sm text-gray-600 mt-1">
                  กดหัวใจ ❤️ เพื่อบันทึกรูปลงรายการโปรด หรือกดดาวน์โหลด ⬇️ เพื่อเก็บไฟล์ลงเครื่อง
                </p>
              </div>
            </div>

            {/* 4. Install App */}
            <div className="flex gap-4">
              <div className="bg-green-100 p-3 rounded-xl h-fit shrink-0">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">4. ติดตั้งแอป (ไม่ต้องโหลด Store)</h3>
                <p className="text-sm text-gray-600 mt-1 mb-2">
                  ทำให้เป็นแอปบนมือถือได้ง่ายๆ:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-gray-600 space-y-2">
                  <div>
                    <strong className="text-gray-800 block mb-1">📱 Android (Chrome):</strong>
                    กดเมนู 3 จุดมุมขวาบน ➔ เลือก <b>"Install App"</b> หรือ <b>"Add to Home screen"</b>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <strong className="text-gray-800 block mb-1">🍎 iOS (Safari):</strong>
                    กดปุ่ม Share (สี่เหลี่ยมมีลูกศร) ➔ เลือก <b>"Add to Home Screen"</b>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg"
            >
              เข้าใจแล้ว เริ่มใช้งานเลย!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal;
