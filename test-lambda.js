const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
    line = line.replace('\r', '');
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let key = match[1];
        let val = match[2];
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1);
        }
        process.env[key] = val;
    }
});

const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const credentials = {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
};
const region = "us-east-1";

const lambda = new LambdaClient({
    region,
    credentials,
});

async function test() {
    try {
        const lambdaName = process.env.TRANSCRIBE_LAMBDA_NAME || "lambda-transcribe";
        console.log(`Invoking Lambda: ${lambdaName}`);
        console.log(`KEY: ${process.env.MY_AWS_ACCESS_KEY_ID?.substring(0, 5)}...`);

        const invokeCmd = new InvokeCommand({
            FunctionName: lambdaName,
            InvocationType: "RequestResponse",
            Payload: JSON.stringify({
                body: JSON.stringify({ s3Key: "test.mp4", bucketName: process.env.S3_BUCKET_NAME })
            })
        });

        const lambdaRes = await lambda.send(invokeCmd);
        const responsePayload = JSON.parse(new TextDecoder().decode(lambdaRes.Payload));

        console.log("Response:", responsePayload);
    } catch (err) {
        console.error("Lambda Error:", err);
    }
}

test();
