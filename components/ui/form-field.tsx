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
    options?: {
        value: string;
        label: string;
    }[];
    error?: string;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    children?: React.ReactNode
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
    className,
    disabled,
    children
}: FormFieldProps) => {
    const baseClass = `w-full ${disabled ? "bg-surface" : "bg-surface-container"} border border-on-backgound ${error ? "border-error/50" : "border-on-error/10"
        } rounded-xl px-4 py-3 text-on-background focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-on-surface-variant/50`;

    return (
        <div className={`space-y-2 ${className}`}>
            <label className="block font-label-md text-label-md text-on-surface-variant">
                {label} {required && <span className="text-error">*</span>}
            </label>
            <div className="flex gap-3">
                {children && children}

                {type === "textarea" ? (
                    <textarea
                        name={name}
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        rows={rows}
                        className={baseClass}
                    />
                ) : type === "select" ? (
                    <select title={name} name={name}
                        disabled={disabled} value={value} onChange={onChange} className={baseClass}>
                        <option value="">اختر...</option>
                        {options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type={type}
                        name={name}
                        disabled={disabled}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className={baseClass}
                    />
                )}
            </div>
            {error && <p className="text-error text-caption">{error}</p>}
        </div>
    );
};