import React, { useState } from 'react';

interface CalendarCardProps {
  onSelectDate?: (day: number) => void;
}

export function CalendarCard({ onSelectDate }: CalendarCardProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(18);

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const days = [
    27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7,
  ];

  const campaignEndDays: Record<number, boolean> = { 25: true, 29: true, 11: true, 17: true };

  return (
    <div className="border border-[#181818] rounded-2xl p-4 bg-[#0A0A0A] shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="font-semibold text-sm text-[#F4F2EC]">Oct 2026</span>
        <div className="text-[#888888] flex items-center gap-2.5 text-xs">
          <button className="hover:text-[#F4F2EC] p-1 transition-colors" aria-label="Previous month">
            <i className="ti ti-chevron-left text-sm" />
          </button>
          <button className="hover:text-[#F4F2EC] p-1 transition-colors" aria-label="Next month">
            <i className="ti ti-chevron-right text-sm" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center gap-y-1.5 text-xs">
        {weekdays.map(d => (
          <span key={d} className="text-[11px] text-[#555555] font-medium pb-0.5">
            {d}
          </span>
        ))}

        {days.map((d, i) => {
          const isOut = i < 4 || i >= 35;
          const isToday = d === 19 && !isOut;
          const isEnd = campaignEndDays[d] && !isOut;
          const isSelected = selectedDay === d && !isOut;

          return (
            <button
              key={i}
              type="button"
              disabled={isOut}
              onClick={() => {
                if (!isOut) {
                  setSelectedDay(d);
                  onSelectDate?.(d);
                }
              }}
              className={`text-xs h-7 w-7 flex items-center justify-center relative rounded-full mx-auto transition-colors ${
                isOut
                  ? 'text-[#333333] cursor-default'
                  : isSelected
                  ? 'bg-[#F4F2EC] text-[#000000] font-bold shadow-sm'
                  : isToday
                  ? 'bg-[#1C1C1C] text-[#F4F2EC] font-medium'
                  : 'text-[#D5D3CC] hover:bg-[#141414]'
              }`}
            >
              <span>{d}</span>
              {isEnd && (
                <span
                  className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                    isSelected ? 'bg-[#000000]' : 'bg-[#C9B8FF]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-[#888888] mt-3.5 flex items-center gap-2 pt-2.5 border-t border-[#161616]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9B8FF] shrink-0" />
        <span>Campaign ends</span>
      </div>
    </div>
  );
}
