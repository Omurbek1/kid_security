import * as Permissions from 'expo-permissions';
import { Audio } from 'expo-av';

const AUDIO_PRESET = { ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY };
AUDIO_PRESET.android.numberOfChannels = 1;
AUDIO_PRESET.android.sampleRate = 44100;
AUDIO_PRESET.android.bitRate = 256000;
AUDIO_PRESET.android.outputFormat = Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4;
AUDIO_PRESET.android.audioEncoder = Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC;
AUDIO_PRESET.ios.numberOfChannels = 1;
AUDIO_PRESET.ios.sampleRate = 44100;
AUDIO_PRESET.ios.bitRate = 320000;
AUDIO_PRESET.ios.audioQuality = Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX;
//AUDIO_PRESET.ios.extension = '.m4a';
//AUDIO_PRESET.ios.outputFormat = Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_APPLELOSSLESS;

let isPreparing = false;
let isRecording = false;
let recorder = null;
let isAudioPrepared = false;
let isAborted = false;
let isStopped = false;
let isFinished = false;

export const recordAudio = async ({ limitMilis, onStart, onStop, onUpdate, onSuccess }) => {
    if (isPreparing || isRecording) {
        return;
    }

    isAborted = false;
    isStopped = false;
    isPreparing = true;

    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.AUDIO_RECORDING
    );

    if (existingStatus !== 'granted') {
        await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        isPreparing = false;
        return;
    }

    if (!isAudioPrepared) {
        try {
            await Audio.setAudioModeAsync({
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                allowsRecordingIOS: true,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            //isAudioPrepared = true;
        } catch (e) {
            console.log(e);
            return;
        }
    }

    isFinished = false;

    recorder = new Audio.Recording();
    recorder.setProgressUpdateInterval(100);
    recorder.setOnRecordingStatusUpdate(async (status) => {
        if (status.isRecording && status.durationMillis >= limitMilis) {
            if (!isStopped) {
                console.log('>>> AUDIO message limit reached');
                isStopped = true;
            }
        }
        if (status.isDoneRecording) {
            console.log('>>> isDoneRecording');
            if (!isAborted) {
                if (status.durationMillis < 1000) {
                    console.log('>>> cancelling audio recording due to low duartion');
                } else {
                    if (onSuccess) {
                        onSuccess(recorder.getURI(), status.durationMillis);
                    }
                }
            }
            recorder.setOnRecordingStatusUpdate(null);
            recorder = null;
            isRecording = false;
            if (onStop) {
                onStop();
            }
        } else {
            if (!isAborted && !isStopped && onUpdate) {
                onUpdate(status);
            }
        }
        if ((isStopped || isAborted) && !isFinished) {
            isFinished = true;
            setTimeout(async () => {
                try {
                    console.log('>>> stopAndUnloadAsync');
                    await recorder.stopAndUnloadAsync();
                    console.log('>>> stopAndUnloadAsync: done');
                } catch (e) {
                    console.log(e);
                    // workaround
                    isRecording = false;
                    if (onStop) {
                        onStop();
                    }
                }
            }, 300);
        }
    });

    try {
        console.log('>>> preparing recorder...');
        await recorder.prepareToRecordAsync(AUDIO_PRESET);
        await recorder.startAsync();
        console.log('>>> actually recording');
        isPreparing = false;
        isRecording = true;
        if (onStart) {
            onStart();
        }
    } catch (error) {
        isFinished = false;
        try {
            await recorder.stopAndUnloadAsync();
        } catch (e) {
        }
        recorder = null;
        isPreparing = false;
        isRecording = false;
        console.log(error);
        if (onStop) {
            onStop();
        }
        return;
    }
};

export const abortRecording = () => {
    if (isAborted || isStopped) {
        return;
    }
    isAborted = true;
    console.log('>>> abort recording');
};

export const finishRecording = () => {
    if (isAborted || isStopped) {
        return;
    }
    isStopped = true;
    console.log('>>> stop recording');
};