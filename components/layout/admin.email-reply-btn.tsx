"use client";

import { Lead } from "./admin.lead-card";

export const EmailReplyBtn = ({ lead, onclick }: { lead: Lead, onclick?: () => void }) => {
    const handleQuickReply = async () => {
        const subject = encodeURIComponent(
            `ردا على طلبك (${lead.projectType})`
        );

        const body = encodeURIComponent(`مرحباً ${lead.name},

شكراً لتواصلك معنا.

يسعدنا الرد على استفسارك بخصوص مشروعك.

مع خالص التحية،
`);

        window.open(`MailTo:${lead.email}?subject=${subject}&body=${body}`);

        try {
            await fetch(`/api/requests/${lead.id}/reply`, {
                method: "PATCH",
            });

        } catch (err){
            console.log("error updating the resquest status", err);
        }
    };

    return (
        <button
            type="button"
            onClick={() => {
                handleQuickReply()
                if (onclick) {onclick()}
            }}
            disabled={lead.replied}
            className={`cursor-pointer w-full py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md transition-all active:scale-95`}
        >
            رد سريع
        </button>
    );
};