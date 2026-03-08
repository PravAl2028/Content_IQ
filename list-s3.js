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

const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
    }
});

async function run() {
    const cmd = new ListObjectsV2Command({ Bucket: process.env.S3_BUCKET_NAME });
    const res = await s3.send(cmd);
    console.log("Files:", res.Contents?.filter(c => c.Key.endsWith('.mp4')).slice(0, 5).map(c => c.Key));
}
run();
