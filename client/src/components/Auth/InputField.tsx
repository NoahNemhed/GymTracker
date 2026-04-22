import type { LucideIcon } from "lucide-react";

type InputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  rightText?: string;
};

export default function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightText,
}: InputFieldProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <label className="block text-sm font-medium uppercase tracking-[0.22em] text-zinc-400">
          {label}
        </label>
        {rightText && (
          <span className="text-sm text-[#7aa2ff]">{rightText}</span>
        )}
      </div>

      <div className="flex items-center rounded-full bg-[#111111] px-5 py-4 shadow-inner ring-1 ring-white/5">
        <Icon className="mr-3 h-5 w-5 text-zinc-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-white outline-none placeholder:text-zinc-500"
        />
      </div>
    </div>
  );
}