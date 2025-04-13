// services/transcribe.ts

import { toaster } from "~/components/ui/toaster";
import { assemblyaiTranscribeAudio } from "~/serviceClients/assemblyai";
import { elevenLabsTranscribeAudio } from "~/serviceClients/elevenlabs";

export type TranscribeAudioFileProps = {
    file: File;
    api: 'elevenlabs' | 'assemblyai';
};

export async function transcribeAudioFile({
    file,
    api,
}: TranscribeAudioFileProps): Promise<any> {
    toaster.info({
        title: `Uploading audio to ${api}...`,
        description: 'Please wait while we upload the audio file.',
    });
    if (api === 'elevenlabs') {
        const response = await elevenLabsTranscribeAudio(file);

        const data = response;
        if (!response) throw new Error('ElevenLabs transcription failed');
        toaster.success({
            title: 'Transcription complete!',
            description: 'The audio file has been successfully transcribed.',
        });
        return data.text;
    }

    if (api === 'assemblyai') {
        const response = await assemblyaiTranscribeAudio(file);

        if (!response) throw new Error('AssemblyAI upload failed');

        toaster.info({
            title: 'Requesting transcription from AssemblyAI...',
            description: 'Please wait while we request the transcription.',
        });

        toaster.success({
            title: 'Transcription complete!',
            description: 'The audio file has been successfully transcribed.',
        });
        return response.text;
    }

    throw new Error('Invalid API option');
}
