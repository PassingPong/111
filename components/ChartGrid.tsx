import React from 'react';
import { ChartResponse, PalaceData } from '../types';

interface ChartGridProps {
  chart: ChartResponse;
}

const PalaceBox: React.FC<{ palace: PalaceData; isCenter?: boolean }> = ({ palace, isCenter }) => {
  if (isCenter) return null;

  const isMing = palace.name === '命宫';
  const isShen = false; // Simplification for now, usually Shen is derived

  return (
    <div className={`
      relative border border-purple-100 bg-white/80 p-2 flex flex-col h-full min-h-[120px] sm:min-h-[140px]
      ${isMing ? 'bg-purple-50 ring-1 ring-inset ring-purple-200' : ''}
    `}>
      {/* Header: Name and Earth Branch */}
      <div className="flex justify-between items-center border-b border-purple-50 pb-1 mb-1">
        <span className="text-xs font-medium text-gray-400">{palace.earthBranch}</span>
        <span className={`text-sm font-bold ${isMing ? 'text-purple-700' : 'text-gray-800'}`}>
          {palace.name}
        </span>
      </div>

      {/* Major Stars */}
      <div className="flex flex-col gap-0.5 mb-2">
        {palace.majorStars.map((star, idx) => (
          <div key={idx} className="flex items-baseline justify-between">
             <span className={`text-sm font-bold ${star.name === '紫微' || star.name === '天府' ? 'text-purple-700' : 'text-red-600'}`}>
              {star.name}
            </span>
            {star.brightness && (
              <span className="text-[10px] scale-90 text-gray-400">{star.brightness}</span>
            )}
          </div>
        ))}
      </div>

      {/* Minor Stars (Limit to 4 for space) */}
      <div className="flex flex-wrap gap-1 content-start flex-grow">
        {palace.minorStars.slice(0, 6).map((star, idx) => (
          <span key={idx} className="text-[10px] text-gray-500">
            {star.name}
          </span>
        ))}
      </div>

      {/* Footer: Heaven Stem & Age */}
      <div className="mt-auto pt-1 border-t border-purple-50 flex justify-between items-end text-gray-400">
        <span className="text-xs font-serif">{palace.heavenStem}</span>
        <span className="text-[10px]">{palace.ageRange}</span>
      </div>
    </div>
  );
};

const CenterBox: React.FC<{ chart: ChartResponse }> = ({ chart }) => (
  <div className="col-span-2 row-span-2 bg-purple-600 flex flex-col items-center justify-center text-white p-4 shadow-inner">
    <div className="text-2xl font-bold mb-1 tracking-widest">紫微斗数</div>
    <div className="w-12 h-0.5 bg-purple-400 mb-3"></div>
    <div className="text-xs opacity-80 mb-1">五行局：{chart.fiveElement}</div>
    <div className="text-xs opacity-80 mb-1">命主：{chart.lifeMaster}</div>
    <div className="text-xs opacity-80">身主：{chart.bodyMaster}</div>
  </div>
);

const ChartGrid: React.FC<ChartGridProps> = ({ chart }) => {
  // We need to map the API list of palaces to the standard Grid layout.
  // Standard Ziwei Grid is:
  // Si   Wu   Wei   Shen
  // Chen            You
  // Mao             Xu
  // Yin  Chou Zi    Hai
  // But standard flex/grid order is left-to-right.
  // We assume the API returns palaces with 'earthBranch' property.
  // We map specific Earth Branches to grid indices (0-11).

  const branchOrder = ['巳', '午', '未', '申', '辰', '酉', '卯', '戌', '寅', '丑', '子', '亥'];
  const gridPositions: { [key: string]: number } = {
    '巳': 0, '午': 1, '未': 2, '申': 3,
    '辰': 4,              '酉': 5,
    '卯': 6,              '戌': 7,
    '寅': 8, '丑': 9, '子': 10, '亥': 11
  };

  // Create a fixed array for the 12 slots surrounding the center
  // Actually, constructing the grid with CSS Grid requires specific placement or a defined order.
  // Let's use a 4x4 grid.
  // 0 1 2 3
  // 4 X X 5
  // 6 X X 7
  // 8 9 10 11
  // Where X is the center col-span-2 row-span-2.

  const sortedPalaces = new Array(12).fill(null);

  chart.palaces.forEach(p => {
    // Normalize branch if simplified/traditional mismatch occurs (basic handling)
    const index = gridPositions[p.earthBranch];
    if (index !== undefined) sortedPalaces[index] = p;
  });

  // Fallback if mapping fails
  if (!sortedPalaces[0]) {
      return <div>Chart data error.</div>
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel p-2 rounded-xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-4 grid-rows-4 gap-px bg-purple-100 border border-purple-100">
        {/* Top Row */}
        <PalaceBox palace={sortedPalaces[0]} />
        <PalaceBox palace={sortedPalaces[1]} />
        <PalaceBox palace={sortedPalaces[2]} />
        <PalaceBox palace={sortedPalaces[3]} />

        {/* Middle Top */}
        <PalaceBox palace={sortedPalaces[4]} />
        <CenterBox chart={chart} />
        <PalaceBox palace={sortedPalaces[5]} />

        {/* Middle Bottom */}
        <PalaceBox palace={sortedPalaces[6]} />
        {/* Center box spans rows, so we don't render here, the grid layout handles the span implicitly if we structure HTML right, but simpler to use absolute or careful ordering.
           Let's use pure CSS Grid Area approach or just manual ordering since the center is special.
        */}
        <PalaceBox palace={sortedPalaces[7]} />

        {/* Bottom Row */}
        <PalaceBox palace={sortedPalaces[8]} />
        <PalaceBox palace={sortedPalaces[9]} />
        <PalaceBox palace={sortedPalaces[10]} />
        <PalaceBox palace={sortedPalaces[11]} />
      </div>
      {/* CSS Grid Fix for Center Span */}
      <style>{`
        .grid-cols-4 {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-rows: repeat(4, minmax(120px, 1fr));
        }
        @media (min-width: 640px) {
             .grid-cols-4 {
                grid-template-rows: repeat(4, minmax(140px, 1fr));
             }
        }
        /* Re-ordering for the specific 12-box layout with center hole */
        /*
           Indices in flattened array:
           0  1  2  3
           4  C  C  5
           6  C  C  7
           8  9  10 11
        */
      `}</style>
    </div>
  );
};

export default ChartGrid;
