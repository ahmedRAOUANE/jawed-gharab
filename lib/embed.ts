import { getYoutubeVideoId } from "./thumbnail";

export function getYoutubeEmbedUrl(url: string) {
    try {
        const videoId = getYoutubeVideoId(url);

        if (videoId) return `https://www.youtube.com/embed/${videoId}`

        return null;
    } catch {
        return null;
    }
}