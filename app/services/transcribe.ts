// services/transcribe.ts

import { toaster } from "~/components/ui/toaster";
import { transcribeAudio } from "~/serviceClients/elevenlabs";

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
        const response = await transcribeAudio(file);

        const data = response;
        if (!response) throw new Error('ElevenLabs transcription failed');
        toaster.success({
            title: 'Transcription complete!',
            description: 'The audio file has been successfully transcribed.',
        });
        return data.text;
    }

    if (api === 'assemblyai') {
        const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
            method: 'POST',
            headers: {
                authorization: import.meta.env.VITE_PUBLIC_ASSEMBLYAI_API_KEY!,
            },
            body: file,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'AssemblyAI upload failed');

        toaster.info({
            title: 'Requesting transcription from AssemblyAI...',
            description: 'Please wait while we request the transcription.',
        });
        const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                authorization: import.meta.env.VITE_PUBLIC_ASSEMBLYAI_API_KEY!,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ audio_url: uploadData.upload_url }),
        });

        const transcriptData = await transcriptRes.json();
        if (!transcriptRes.ok) throw new Error(transcriptData.error || 'AssemblyAI transcription request failed');

        let status = transcriptData.status;
        const transcriptionId = transcriptData.id;

        while (status !== 'completed' && status !== 'error') {
            toaster.info({
                title: 'Polling transcription status...',
                description: `Please wait while we poll the transcription status. Current status: ${status}`,
            });
            await new Promise((res) => setTimeout(res, 3000));

            const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptionId}`, {
                headers: { authorization: import.meta.env.VITE_PUBLIC_ASSEMBLYAI_API_KEY! },
            });

            const pollData = await pollingRes.json();
            status = pollData.status;

            if (status === 'completed') {
                toaster.create({
                    type: 'success',
                    title: 'Transcription complete!',
                    description: 'The audio file has been successfully transcribed.',
                });
                return pollData.text;
            }

            if (status === 'error') throw new Error(pollData.error || 'AssemblyAI polling failed');
        }
    }

    throw new Error('Invalid API option');
}
