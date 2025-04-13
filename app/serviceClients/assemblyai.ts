import { AssemblyAI } from 'assemblyai';
const client = new AssemblyAI({
    apiKey: import.meta.env.VITE_PUBLIC_ASSEMBLYAI_API_KEY
});

export async function assemblyaiTranscribeAudio(file: File, speakerLabels: boolean = true) {
    const response = await client.transcripts.transcribe({ audio: file, speaker_labels: speakerLabels });
    return response;
}
