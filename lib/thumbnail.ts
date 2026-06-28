export function isYoutube(url: string) {
    if (
        url.includes("youtube.com") ||
        url.includes("youtu.be")
    ) return true;

    return false;
}

export function getYoutubeVideoId(url: string): string | null {
    try {
        const parsed = new URL(url);

        // youtube.com/watch?v=...
        if (
            parsed.hostname === "www.youtube.com" ||
            parsed.hostname === "youtube.com"
        ) {
            return parsed.searchParams.get("v");
        }

        // youtu.be/VIDEO_ID
        if (parsed.hostname === "youtu.be") {
            return parsed.pathname.slice(1);
        }

        // youtube.com/embed/VIDEO_ID
        if (parsed.pathname.startsWith("/embed/")) {
            return parsed.pathname.split("/")[2];
        }

        // youtube.com/shorts/VIDEO_ID
        if (parsed.pathname.startsWith("/shorts/")) {
            return parsed.pathname.split("/")[2];
        }

        return null;
    } catch {
        return null;
    }
}

export function getYoutubeThumbnail(url: string): string | null {
    const videoId = getYoutubeVideoId(url);

    if (!videoId) return null;

    // Highest quality thumbnail
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}