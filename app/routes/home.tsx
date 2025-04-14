import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import logo from '~/assets/transcribd.png';
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Transcribd | Audio Transcription" },
    { name: "description", content: "Transcribd is a platform for transcribing audio files. It uses AssemblyAI and ElevenLabs APIs to transcribe audio files." },
    { name: "keywords", content: "transcribe, audio, transcription, assemblyai, elevenlabs" },
    { name: "author", content: "Favour Orukpe (alphadevking)" },
    { name: "og:image", content: logo },
    { name: "og:url", content: "https://transcribd.com" },
    { name: "og:site_name", content: "Transcribd" },
    { name: "og:type", content: "website" },
    { name: "og:locale", content: "en_US" },
  ];
}

export default function Home() {
  return <Welcome />;
}
