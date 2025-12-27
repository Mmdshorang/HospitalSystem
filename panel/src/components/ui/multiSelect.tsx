import { useState, useRef, useEffect } from "react";

// ===== Types =====
type Option = {
  value: string;
  label: string;
};

// ===== Sample Options =====
const OPTIONS: Option[] = [
  { value: "تامین اجتماعی", label: "تامین اجتماعی" },
  { value: "خدمات درمان", label: "خدمات درمان" },
  { value: "نیروهای مسلح", label: "نیروهای مسلح" },
  { value: "تکمیلی", label: "تکمیلی" },
];

export default function MultiSelect(): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [selected, setSelected] = useState<Option[]>([]);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option: Option) => {
    setSelected((prev) =>
      prev.some((i) => i.value === option.value)
        ? prev.filter((i) => i.value !== option.value)
        : [...prev, option]
    );
  };

  const filtered: Option[] = OPTIONS.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-80" ref={ref}>
      <div
        onClick={() => setOpen((o) => !o)}
        className="min-h-[44px] cursor-pointer rounded-xl border border-gray-300 bg-white px-3 py-2 flex flex-wrap gap-2 items-center shadow-sm hover:border-gray-400"
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">انتخاب کنید...</span>
        )}

        {selected.map((item) => (
          <span
            key={item.value}
            className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 flex items-center gap-1"
          >
            {item.label}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(item);
              }}
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl">
          <div className="p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <ul className="max-h-52 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-gray-400">
                موردی یافت نشد
              </li>
            )}

            {filtered.map((option) => {
              const active = selected.some((i) => i.value === option.value);

              return (
                <li
                  key={option.value}
                  onClick={() => toggle(option)}
                  className={`px-4 py-2 cursor-pointer text-sm flex justify-between items-center hover:bg-gray-100 ${
                    active ? "bg-gray-50 font-medium" : ""
                  }`}
                >
                  {option.label}
                  {active && <span>✔</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
