import { ChangeEvent } from "react";

interface FormFieldProps {
    label: string;
    name: string;
    type?: "text" | "textarea" | "select" | "date" | "number" | "email" | "password";
    value: string;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    placeholder?: string;
    rows?: number;
    options?: string[];
    error?: string;
    required?: boolean;
}

export const FormField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    rows = 3,
    options = [],
    error,
    required = false,
}: FormFieldProps) => {
    const baseClass = `w-full bg-surface-container border ${error ? "border-error/50" : "border-white/10"
        } rounded-xl px-4 py-3 text-on-background focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-on-surface-variant/50`;

    return (
        <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant">
                {label} {required && <span className="text-error">*</span>}
            </label>
            {type === "textarea" ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows}
                    className={baseClass}
                />
            ) : type === "select" ? (
                <select title={name} name={name} value={value} onChange={onChange} className={baseClass}>
                    <option value="">اختر...</option>
                    {options.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={baseClass}
                />
            )}
            {error && <p className="text-error text-caption">{error}</p>}
        </div>
    );
};