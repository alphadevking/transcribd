import { ElevenLabsClient } from "elevenlabs";

const elevenLabsClient = new ElevenLabsClient({
    apiKey: import.meta.env.VITE_PUBLIC_ELEVEN_LABS_API_KEY
});

export async function elevenLabsTranscribeAudio(file: File) {
    const response = await elevenLabsClient.speechToText.convert({
        file: file,
        model_id: "scribe_v1", // Note: underscore, not hyphen
        language_code: "eng",   // Optional: specify language or let model detect automatically
        tag_audio_events: true, // Optional: tag audio events like laughter, applause, etc.
        diarize: true
    });
    return response;
}

export async function getVoice(voiceId: string) {
    const response = await elevenLabsClient.voices.get(voiceId);
    return response;
}

