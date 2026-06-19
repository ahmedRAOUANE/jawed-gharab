// src/components/admin/ProjectForm/TeamMembersInput.tsx
"use client";

import { useState, KeyboardEvent } from "react";
import { MdClose } from "react-icons/md";

interface TeamMembersInputProps {
    value: string[];
    onChange: (members: string[]) => void;
    label: string;
    placeholder?: string;
}

export const TeamMembersInput = ({
    value,
    onChange,
    label,
    placeholder = "أضف اسم عضو ثم اضغط Enter",
}: TeamMembersInputProps) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    const handleRemove = (member: string) => {
        onChange(value.filter((m) => m !== member));
    };

    return (
        <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface-variant">
                {label}
            </label>

            <div className="flex flex-wrap gap-2 p-3 bg-surface-container border border-white/10 rounded-xl min-h-12">
                {value.map((member) => (
                    <span
                        key={member}
                        className="flex items-center gap-1 bg-primary-container/20 text-primary px-3 py-1 rounded-full text-sm"
                    >
                        {member}
                        <button
                            title="remove member"
                            type="button"
                            onClick={() => handleRemove(member)}
                            className="hover:text-error transition-colors"
                        >
                            <MdClose size={16} />
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-30 bg-transparent outline-none text-on-background placeholder:text-on-surface-variant/50"
                />
            </div>
            <p className="font-caption text-on-surface-variant">اضغط Enter لإضافة كل عضو</p>
        </div>
    );
};