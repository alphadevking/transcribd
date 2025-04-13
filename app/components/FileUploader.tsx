import { useState, type ChangeEvent } from 'react';
import { transcribeAudioFile, type TranscribeAudioFileProps } from '../services/transcribe';
import { Box, Button, CloseButton, FileUpload, Input, InputGroup } from '@chakra-ui/react';
import { LuFileUp } from 'react-icons/lu';
import { toaster } from './ui/toaster';

type FileUploaderProps = {
    api: TranscribeAudioFileProps['api'];
    onTranscription: (text: string) => void;
};

export function FileUploader({ api, onTranscription }: FileUploaderProps) {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [tLoading, setTLoading] = useState(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                toaster.create({
                    type: 'error',
                    title: 'Invalid file type',
                    description: 'Only audio files are supported.',
                });
                return;
            }
            setAudioFile(file);
        }
    };

    const handleTranscribe = async () => {
        if (!audioFile) {
            toaster.create({
                type: 'error',
                title: 'No file selected',
                description: 'Please select an audio file first.',
            });
            return;
        }

        setTLoading(true);
        toaster.create({
            type: 'info',
            title: 'Preparing transcription',
            description: 'Uploading file and polling for transcription...',
        });

        try {
            const transcriptionPromise = transcribeAudioFile({ file: audioFile, api });

            toaster.promise(transcriptionPromise, {
                success: {
                    title: 'Transcription complete!',
                    description: 'The audio file has been successfully transcribed.',
                },
                loading: {
                    title: 'Transcribing...',
                    description: 'The audio is being processed. Please wait.',
                },
            });

            const text = await transcriptionPromise;
            onTranscription(text);
        } catch (error) {
            console.error('Transcription error:', error);
            toaster.create({
                type: 'error',
                title: 'Unexpected error',
                description: 'Something went wrong. Please try again or use a different file.',
            });
        } finally {
            setTLoading(false);
        }
    };

    return (
        <Box gap={5}>
            <FileUpload.Root
                gap="1"
                maxWidth="300px"
                accept="audio/*"
                onChange={handleFileChange}
                mb={4}
            >
                <FileUpload.HiddenInput />
                <FileUpload.Label>Upload file</FileUpload.Label>
                <InputGroup
                    startElement={<LuFileUp />}
                    endElement={
                        <FileUpload.ClearTrigger asChild>
                            <CloseButton
                                me="-1"
                                size="xs"
                                variant="plain"
                                focusVisibleRing="inside"
                                focusRingWidth="2px"
                                pointerEvents="auto"
                                onClick={() => setAudioFile(null)}
                            />
                        </FileUpload.ClearTrigger>
                    }
                >
                    <Input asChild>
                        <FileUpload.Trigger>
                            <FileUpload.FileText lineClamp={1} />
                        </FileUpload.Trigger>
                    </Input>
                </InputGroup>
            </FileUpload.Root>

            <Button
                loading={tLoading}
                onClick={handleTranscribe}
                disabled={!audioFile || tLoading}
            >
                Transcribe
            </Button>
        </Box>
    );
}

export default FileUploader;
