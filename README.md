# Transcribd

Transcribd is a web application that allows users to transcribe audio files using different transcription APIs. The application currently supports two APIs: ElevenLabs and AssemblyAI.

## Features

- **Audio Transcription**: Users can upload or record audio files and have them transcribed using the selected API.
- **API Selection**: Users can choose between the ElevenLabs and AssemblyAI APIs for transcription.
- **API Key Storage**: Users can store their API keys for future use.

---

**Note:** This project is still in active development. Updates and improvements are ongoing.


## Getting Started

To get started with Transcribd, follow these steps:

1. Clone the repository: `git clone https://github.com/alphadevking/transcribd.git`
2. Install the dependencies: `npm install`
3. Start the development server: `npm run dev`

## Usage

1. **Select API**: Choose the API you want to use for transcription.
2. **Enter API Key**: If you haven't stored your API key, you can enter it here. If you have already stored your API key, it will be automatically loaded.
3. **Upload or Record Audio**: You can upload an audio file or record audio directly in the application.
4. **Transcribe**: Click the transcribe button to start the transcription process.

## API Key Storage

Transcribd uses `localStorage` to store API keys. When you enter an API key, it is stored in `localStorage` with a key that includes the selected API name. For example, if you enter an API key for the ElevenLabs API, it will be stored in `localStorage` with the key `elevenlabs-api-key`.

## Contributing

Contributions are welcome! If you have any ideas for new features or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
