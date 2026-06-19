"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MdUpload, MdClose } from "react-icons/md";

interface ImageUploadProps {
    value: string | File;
    onChange: (file: File | null) => void;
    label: string;
}

export const ImageUpload = ({ value, onChange, label }: ImageUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>(
        typeof value === "string" ? value : ""
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                onChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview("");
        onChange(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            <label htmlFor="upload" className="block font-label-md text-label-md text-on-surface-variant">
                {label}
            </label>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-xl border border-white/10 hover:bg-surface-variant transition-colors"
                >
                    <MdUpload size={20} />
                    <span>رفع صورة</span>
                </button>
                <input
                    id="upload"
                    title="upload image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {preview && (
                    <div className="relative w-16 h-16 rounded-lg border border-white/10">
                        <div className="w-full h-full overflow-hidden rounded-lg">
                            <Image width={100} height={100} src={preview} alt="Preview" className="w-full h-full object-cover" />
                        </div>

                        <button
                            title="remove image"
                            type="button"
                            onClick={handleRemove}
                            className="cursor-pointer absolute -top-3 -right-3 bg-error/40 text-on-error rounded-full border border-on-error p-0.5 hover:bg-red/80 shadow"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                )}
            </div>
            <p className="font-caption text-on-surface-variant">يُفضل استخدام صورة بحجم 16:9</p>
        </div>
    );
};