import { useRef, useState } from 'react';
import { transcribeAudioFile, type TranscribeAudioFileProps } from '../services/transcribe';
import { Box, Button, HStack } from '@chakra-ui/react';
import { toaster } from './ui/toaster';

type AudioRecorderProps = {
    api: TranscribeAudioFileProps['api'];
    onTranscription: (text: string) => void;
};

export function AudioRecorder({ api, onTranscription }: AudioRecorderProps) {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setLoading(true);
        try {
            toaster.create({
                type: 'info',
                title: 'Requesting microphone access',
                description: 'Please grant access to your microphone to start recording.',
            });

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                toaster.create({
                    type: 'info',
                    title: 'Encoding audio',
                    description: 'The audio file is being encoded for transcription.',
                });

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
                const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm;codecs=opus' });

                try {
                    const text = await transcribeAudioFile({ file: audioFile, api });
                    onTranscription(text);
                } catch (err) {
                    console.error(err);
                    toaster.create({
                        type: 'error',
                        title: 'Transcription failed',
                        description: 'An error occurred while transcribing the audio file. Please try again.',
                    });
                } finally {
                    if (mediaStreamRef.current) {
                        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
                        mediaStreamRef.current = null;
                    }
                    setLoading(false);
                    setRecording(false);
                    setPaused(false);
                }
            };

            mediaRecorder.start();
            setRecording(true);
            toaster.create({
                type: 'info',
                title: 'Recording',
                description: 'The audio is being recorded. Please speak clearly.',
            });
        } catch (err) {
            console.error(err);
            toaster.create({
                type: 'error',
                title: 'Microphone access denied',
                description: 'Please allow microphone access to start recording.',
            });
        } finally {
            setLoading(false);
        }
    };

    const pauseRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state === 'recording') {
            recorder.pause();
            setPaused(true);
            toaster.create({
                type: 'info',
                title: 'Paused',
                description: 'Recording is paused. You can resume anytime.',
            });
        }
    };

    const resumeRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state === 'paused') {
            recorder.resume();
            setPaused(false);
            toaster.create({
                type: 'info',
                title: 'Resumed',
                description: 'Recording resumed. Continue speaking.',
            });
        }
    };

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== 'inactive') {
            setLoading(true);
            recorder.stop();
            toaster.create({
                type: 'info',
                title: 'Transcribing',
                description: 'The audio file is being transcribed. Please wait.',
            });
        }
    };

    return (
        <Box mt={4}>
            {!recording && (
                <Button loading={loading} onClick={startRecording} colorScheme="blue">
                    Start Recording
                </Button>
            )}

            {recording && (
                <HStack gap={4}>
                    {!paused ? (
                        <Button disabled={loading} onClick={pauseRecording} colorScheme="yellow">
                            Pause
                        </Button>
                    ) : (
                        <Button disabled={loading} onClick={resumeRecording} colorScheme="green">
                            Resume
                        </Button>
                    )}
                    <Button loading={loading} onClick={stopRecording} colorScheme="red">
                        Stop
                    </Button>
                </HStack>
            )}
        </Box>
    );
}

export default AudioRecorder;
