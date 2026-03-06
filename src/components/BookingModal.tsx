"use client";
import React, { useState } from 'react';

export default function BookingModal({ therapist, onClose, onConfirm }: any) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = ["10:00", "13:00", "15:00", "19:00", "21:00"];

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom-full duration-300">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
        
        <h2 className="text-xl font-black italic mb-2">预约时间 - {therapist.name}</h2>
        <p className="text-gray-400 text-xs mb-6 font-medium italic">请选择您心仪的服务时间</p>

        {/* Date Input */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">选择日期</label>
          <input 
            type="date" 
            className="w-full p-4 bg-[#F7F8FA] rounded-2xl outline-none font-bold"
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Time Grid */}
        <div className="mb-8">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">选择时间段</label>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 rounded-xl text-xs font-bold transition-all ${
                  selectedTime === time ? 'bg-[#25D366] text-white' : 'bg-[#F7F8FA] text-gray-400'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 text-gray-400 font-bold text-sm">取消</button>
          <button 
            disabled={!selectedDate || !selectedTime}
            onClick={() => onConfirm(selectedDate, selectedTime)}
            className="flex-1 bg-[#1C1C1E] text-white rounded-[24px] font-black italic shadow-xl disabled:opacity-30"
          >
            确认预约
          </button>
        </div>
      </div>
    </div>
  );
}