import { TranscribeClient, StartTranscriptionJobCommand, GetTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Create AWS clients (Lambda environments automatically inject credentials/region)
const transcribeClient = new TranscribeClient({});
const s3Client = new S3Client({});

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const handler = async (event) => {
    try {
        const { s3Key, bucketName } = typeof event.body === 'string' ? JSON.parse(event.body) : event;

        if (!s3Key || !bucketName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing s3Key or bucketName" }),
            };
        }

        const modelName = process.env.AWS_TRANSCRIBE_CUSTOM_MODEL_NAME; // Optional custom medical/language model

        // 1. Generate unique job name based on timestamp and s3Key
        const timestamp = Date.now();
        const cleanS3Key = s3Key.replace(/[^a-zA-Z0-9-_.!*'()]/g, '_');
        const jobName = `transcribe-${timestamp}-${cleanS3Key}`.substring(0, 199);

        const mediaUri = `s3://${bucketName}/${s3Key}`;

        // 2. Start the transcription job
        const startParams = {
            TranscriptionJobName: jobName,
            Media: { MediaFileUri: mediaUri },
            IdentifyLanguage: true, // Auto-detect language
            OutputBucketName: bucketName, // Save transcript to the same bucket
        };

        if (modelName) {
            startParams.ModelSettings = { LanguageModelName: modelName };
        }

        console.log(`Starting transcription job: ${jobName}`);
        await transcribeClient.send(new StartTranscriptionJobCommand(startParams));

        // 3. Poll for completion
        let isCompleted = false;
        let jobResult = null;
        let attempt = 0;
        const maxAttempts = 60; // 60 attempts * 5 seconds = 5 minutes timeout

        while (!isCompleted && attempt < maxAttempts) {
            await wait(5000); // Poll every 5 seconds
            attempt++;

            const statusCmd = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
            const statusResponse = await transcribeClient.send(statusCmd);

            const status = statusResponse.TranscriptionJob?.TranscriptionJobStatus;
            console.log(`Attempt ${attempt} - Job status: ${status}`);

            if (status === "COMPLETED") {
                isCompleted = true;
                jobResult = statusResponse.TranscriptionJob;
            } else if (status === "FAILED") {
                throw new Error(`Transcription failed: ${statusResponse.TranscriptionJob?.FailureReason}`);
            }
        }

        if (!isCompleted) {
            throw new Error("Transcription job timed out after 5 minutes.");
        }

        // 4. Extract the transcript from the output URI
        // Transcriptions are output to S3 in the form: [OutputBucketName]/[TranscriptionJobName].json
        const transcriptKey = `${jobName}.json`;

        console.log(`Fetching transcript from s3://${bucketName}/${transcriptKey}`);
        const s3Response = await s3Client.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: transcriptKey
        }));

        const transcriptRaw = await s3Response.Body.transformToString();
        const transcriptJson = JSON.parse(transcriptRaw);

        // Extract the final large string of transcribed text
        const finalTranscript = transcriptJson.results.transcripts[0]?.transcript || "";

        const responseData = {
            jobName,
            transcript: finalTranscript,
            languageCode: transcriptJson.results.language_code
        };

        return {
            statusCode: 200,
            body: JSON.stringify(responseData),
        };

    } catch (error) {
        console.error("Transcription error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Internal server error" }),
        };
    }
};
