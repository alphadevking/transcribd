import { createListCollection, Portal, Textarea, Box, Heading, useDialog, CloseButton, Button, Dialog, Input, Tabs, Text, Field, Fieldset, InputGroup } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { useState } from 'react';
import { LuSettings2 } from 'react-icons/lu';
import AudioRecorder from '~/components/AudioRecorder';
import FileUploader from '~/components/FileUploader';
import { toaster, Toaster } from "~/components/ui/toaster";
import type { TranscribeAudioFileProps } from '~/services/transcribe';

export function Welcome() {
  const [transcription, setTranscription] = useState<string | null>(null);
  const [api, setApi] = useState<TranscribeAudioFileProps['api']>('assemblyai');
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem(`${api}-api-key`) || null);
  const apiOptions = createListCollection({
    items: [
      { label: 'ElevenLabs', value: 'elevenlabs' },
      { label: 'AssemblyAI', value: 'assemblyai' },
    ],
  });
  const dialog = useDialog();

  const handleApiKeyChange = () => {
    if (!apiKey) return;
    localStorage.setItem(`${api}-api-key`, apiKey);
    dialog.setOpen(false);
    toaster.success({
      title: 'API key saved!',
      description: 'You can now start recording or uploading audio files using your own API key.',
      duration: 3000,
    });
  };

  return (
    <Box p="4" display="flex" flexDir="column" alignItems="start" gap={5}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="full">
        <Heading>Audio Transcription</Heading>
        <Button variant="outline" outline="none" size="sm" onClick={() => dialog.setOpen(true)}>
          <LuSettings2 />
        </Button>
      </Box>

      <Tabs.Root defaultValue="1" width="full" height="fit-content">
        <Tabs.List>
          <Tabs.Trigger value="1">
            Record
          </Tabs.Trigger>
          <Tabs.Trigger value="2">
            Upload
          </Tabs.Trigger>
        </Tabs.List>
        <Box pos="relative" minH="200px" width="full">
          <Tabs.Content
            value="1"
            position="absolute"
            inset="0"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <AudioRecorder api={api} onTranscription={(text) => {
              setTranscription(text);
            }} />
          </Tabs.Content>
          <Tabs.Content
            value="2"
            position="absolute"
            inset="0"
            _open={{
              animationName: "fade-in, scale-in",
              animationDuration: "300ms",
            }}
            _closed={{
              animationName: "fade-out, scale-out",
              animationDuration: "120ms",
            }}
          >
            <FileUploader api={api} onTranscription={(text) => {
              setTranscription(text);
            }} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      {transcription && <Textarea _open={{
        animationName: "fade-in, scale-in",
        animationDuration: "300ms",
      }}
        _closed={{
          animationName: "fade-out, scale-out",
          animationDuration: "120ms",
        }} value={transcription} minH={400} readOnly />}
      <Toaster />
      <Dialog.RootProvider value={dialog}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Settings</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Fieldset.Root>
                  <Fieldset.Content>
                    <Field.Root display="flex" alignItems="start" width="100%">
                      <Select.Root
                        collection={apiOptions}
                        onValueChange={(event) => setApi(event.value[0] as TranscribeAudioFileProps['api'])}
                        defaultValue={[api]}
                      >
                        <Select.HiddenSelect />
                        <Select.Control>
                          <Select.Trigger>
                            <Select.ValueText placeholder="Select your preferred API..." />
                          </Select.Trigger>
                          <Select.IndicatorGroup>
                            <Select.Indicator />
                          </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                          <Select.Positioner>
                            <Select.Content zIndex={1500}>
                              <Select.Item item="elevenlabs" key="elevenlabs">
                                ElevenLabs
                                <Select.ItemIndicator />
                              </Select.Item>
                              <Select.Item item="assemblyai" key="assemblyai">
                                AssemblyAI
                                <Select.ItemIndicator />
                              </Select.Item>
                            </Select.Content>
                          </Select.Positioner>
                        </Portal>
                      </Select.Root>
                    </Field.Root>
                  </Fieldset.Content>
                  <Field.Root display="flex" alignItems="start" width="100%">
                    <InputGroup endElement={apiKey ? (
                      <CloseButton
                        size="xs"
                        onClick={() => {
                          setApiKey("");
                          localStorage.removeItem(`${api}-api-key`);
                        }}
                        me="-2"
                      />
                    ) : undefined}>
                      <Input
                        value={apiKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleApiKeyChange();
                          }
                        }}
                        type="text"
                        placeholder="API Key here..."
                      />
                    </InputGroup>
                    <Button onClick={handleApiKeyChange} variant="outline">Save</Button>
                  </Field.Root>
                </Fieldset.Root>
              </Dialog.Body>
              {/* <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Ok</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer> */}
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.RootProvider>
    </Box >
  );
}
