import React, { useMemo, useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import { ProductColor } from '../../types';

interface ProductOptionsSelectorProps {
  colors: ProductColor[];
  sizes: string[];
  onColorsChange: (colors: ProductColor[]) => void;
  onSizesChange: (sizes: string[]) => void;
}

export const ADMIN_DEFAULT_COLORS: ProductColor[] = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Beige', hex: '#D9C2A6' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Dusty Rose', hex: '#C98F9B' },
  { name: 'Mocha Brown', hex: '#8B6F5A' },
  { name: 'Emerald', hex: '#008B62' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Sage Green', hex: '#9CAF88' },
  { name: 'Warm Taupe', hex: '#B39B86' },
  { name: 'Light Grey', hex: '#D3D3D3' },
];

export const ADMIN_DEFAULT_SIZES = ['M', 'L', '2XL', '3XL', 'Free Size'];

const sharedPanelClass = 'rounded-xl border border-[#d4c3b9] dark:border-[#423329] bg-[#F5E6D3]/25 dark:bg-[#281E18]/50 p-4 space-y-4';
const actionClass = 'text-[11px] font-semibold text-[#77553b] dark:text-[#D1B198] hover:text-[#4A382D] dark:hover:text-[#FFFDF9] transition-colors cursor-pointer';

export const ProductOptionsSelector: React.FC<ProductOptionsSelectorProps> = ({
  colors,
  sizes,
  onColorsChange,
  onSizesChange,
}) => {
  const [showCustomColor, setShowCustomColor] = useState(false);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#B89578');
  const [showCustomSize, setShowCustomSize] = useState(false);
  const [customSize, setCustomSize] = useState('');

  const availableColors = useMemo(() => {
    const customColors = colors.filter(
      (color) => !ADMIN_DEFAULT_COLORS.some((defaultColor) => defaultColor.name.toLowerCase() === color.name.toLowerCase())
    );
    return [...ADMIN_DEFAULT_COLORS, ...customColors];
  }, [colors]);

  const availableSizes = useMemo(() => {
    const customSizes = sizes.filter(
      (size) => !ADMIN_DEFAULT_SIZES.some((defaultSize) => defaultSize.toLowerCase() === size.toLowerCase())
    );
    return [...ADMIN_DEFAULT_SIZES, ...customSizes];
  }, [sizes]);

  const toggleColor = (color: ProductColor) => {
    const exists = colors.some((selected) => selected.name.toLowerCase() === color.name.toLowerCase());
    onColorsChange(exists ? colors.filter((selected) => selected.name.toLowerCase() !== color.name.toLowerCase()) : [...colors, color]);
  };

  const toggleSize = (size: string) => {
    const exists = sizes.some((selected) => selected.toLowerCase() === size.toLowerCase());
    onSizesChange(exists ? sizes.filter((selected) => selected.toLowerCase() !== size.toLowerCase()) : [...sizes, size]);
  };

  const addCustomColor = () => {
    const name = customColorName.trim();
    if (!name || !/^#[0-9A-Fa-f]{6}$/.test(customColorHex)) return;
    const color = { name, hex: customColorHex.toUpperCase() };
    const withoutDuplicate = colors.filter((selected) => selected.name.toLowerCase() !== name.toLowerCase());
    onColorsChange([...withoutDuplicate, color]);
    setCustomColorName('');
    setShowCustomColor(false);
  };

  const addCustomSize = () => {
    const size = customSize.trim();
    if (!size || sizes.some((selected) => selected.toLowerCase() === size.toLowerCase())) return;
    onSizesChange([...sizes, size]);
    setCustomSize('');
    setShowCustomSize(false);
  };

  return (
    <div className="space-y-4">
      <section className={sharedPanelClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[#4A382D] dark:text-[#E8DACB]">Available Colors</h4>
              <span className="rounded-full bg-[#B89578]/15 dark:bg-[#B89578]/25 px-2 py-0.5 text-[10px] font-semibold text-[#77553b] dark:text-[#E6D0BA]">
                {colors.length} selected
              </span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-[#82756c] dark:text-[#AD9E92]">
              Select only the colors available for this product. Customers will see and choose only the colors selected here.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className={actionClass} onClick={() => onColorsChange([...availableColors])}>Select All</button>
            <button type="button" className={actionClass} onClick={() => onColorsChange([])}>Clear All</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {availableColors.map((color) => {
            const checked = colors.some((selected) => selected.name.toLowerCase() === color.name.toLowerCase());
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color)}
                className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${checked ? 'border-[#77553b] bg-[#FFFDF9] dark:bg-[#34271F] dark:border-[#B89578]' : 'border-[#d4c3b9]/70 bg-transparent dark:border-[#423329]'}`}
              >
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? 'border-[#77553b] bg-[#77553b] text-white dark:border-[#B89578] dark:bg-[#B89578]' : 'border-[#b9a69a] dark:border-[#6a5546]'}`}>
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="h-4 w-4 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: color.hex }} />
                <span className="truncate text-[11px] text-[#4A382D] dark:text-[#E8DACB]">{color.name}</span>
              </button>
            );
          })}
        </div>

        {showCustomColor ? (
          <div className="grid grid-cols-1 gap-2 rounded-lg border border-[#77553b]/40 bg-[#FFFDF9]/60 p-3 sm:grid-cols-[1fr_120px_auto] dark:bg-[#1D1612]/60">
            <input value={customColorName} onChange={(event) => setCustomColorName(event.target.value)} placeholder="Color name" className="rounded border border-[#d4c3b9] bg-transparent p-2 text-xs" />
            <input type="text" value={customColorHex} onChange={(event) => setCustomColorHex(event.target.value)} placeholder="#B89578" maxLength={7} className="rounded border border-[#d4c3b9] bg-transparent p-2 text-xs uppercase" />
            <div className="flex gap-2">
              <button type="button" onClick={addCustomColor} className="rounded bg-[#B89578] px-3 py-2 text-[11px] font-semibold text-white">Add</button>
              <button type="button" onClick={() => setShowCustomColor(false)} className="rounded border border-[#d4c3b9] px-2 text-[#77553b]" aria-label="Cancel"><X className="h-4 w-4" /></button>
            </div>
          </div>
        ) : (
          <button type="button" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#77553b] dark:text-[#D1B198]" onClick={() => setShowCustomColor(true)}><Plus className="h-3.5 w-3.5" /> Add Custom Color</button>
        )}
      </section>

      <section className={sharedPanelClass}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-[#4A382D] dark:text-[#E8DACB]">Available Sizes</h4>
              <span className="rounded-full bg-[#B89578]/15 dark:bg-[#B89578]/25 px-2 py-0.5 text-[10px] font-semibold text-[#77553b] dark:text-[#E6D0BA]">{sizes.length} selected</span>
            </div>
            <p className="mt-1 text-[10px] leading-relaxed text-[#82756c] dark:text-[#AD9E92]">Select only the sizes available for this product. If you select M and L, customers will see only those two sizes.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className={actionClass} onClick={() => onSizesChange([...availableSizes])}>Select All</button>
            <button type="button" className={actionClass} onClick={() => onSizesChange([])}>Clear All</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {availableSizes.map((size) => {
            const checked = sizes.some((selected) => selected.toLowerCase() === size.toLowerCase());
            return <button key={size} type="button" onClick={() => toggleSize(size)} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-colors ${checked ? 'border-[#77553b] bg-[#FFFDF9] dark:bg-[#34271F] dark:border-[#B89578]' : 'border-[#d4c3b9]/70 bg-transparent dark:border-[#423329]'}`}><span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? 'border-[#77553b] bg-[#77553b] text-white dark:border-[#B89578] dark:bg-[#B89578]' : 'border-[#b9a69a] dark:border-[#6a5546]'}`}>{checked && <Check className="h-3 w-3" />}</span><span className="truncate text-[11px] text-[#4A382D] dark:text-[#E8DACB]">{size}</span></button>;
          })}
        </div>
        {showCustomSize ? (
          <div className="flex gap-2 rounded-lg border border-[#77553b]/40 bg-[#FFFDF9]/60 p-3 dark:bg-[#1D1612]/60"><input autoFocus value={customSize} onChange={(event) => setCustomSize(event.target.value)} placeholder="Size name" className="min-w-0 flex-1 rounded border border-[#d4c3b9] bg-transparent p-2 text-xs" /><button type="button" onClick={addCustomSize} className="rounded bg-[#B89578] px-3 py-2 text-[11px] font-semibold text-white">Add</button><button type="button" onClick={() => setShowCustomSize(false)} className="rounded border border-[#d4c3b9] px-2 text-[#77553b]" aria-label="Cancel"><X className="h-4 w-4" /></button></div>
        ) : (
          <button type="button" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#77553b] dark:text-[#D1B198]" onClick={() => setShowCustomSize(true)}><Plus className="h-3.5 w-3.5" /> Add Custom Size</button>
        )}
      </section>
    </div>
  );
};
