require('custom-env').env(true);
const { S3Client } = require('@aws-sdk/client-s3');
const S3SyncClient = require('s3-sync-client');
const { TransferMonitor } = require('s3-sync-client');
const mime = require('mime-types');
const monitor = new TransferMonitor();

const PUBLIC_URL = process.env.PUBLIC_URL;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const SOURCE_DIR = 'build/static';
const DEST_DIR = 'test/static';

async function main() {
    console.log('PUBLIC_URL: ', PUBLIC_URL);
    console.log('AWS_S3_BUCKET: ', AWS_S3_BUCKET);
    console.log('AWS_ACCESS_KEY_ID: ', AWS_ACCESS_KEY_ID);
    console.log('AWS_SECRET_ACCESS_KEY: ', AWS_SECRET_ACCESS_KEY);
    if (!PUBLIC_URL || !AWS_S3_BUCKET || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
        return 'Missing AWS credentials'
    }

    const client = new S3Client({
        region: 'ap-southeast-1',
        credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY }
    });
    const { sync } = new S3SyncClient({ client });
    const timeout = setInterval(() => console.log(monitor.getStatus()), 2000);
    try {
        // await sync(SOURCE_DIR, `s3://${AWS_S3_BUCKET}`, 'landing/files', {del: true});
        await sync(SOURCE_DIR, `s3://${AWS_S3_BUCKET}/${DEST_DIR}`, {
            del: true,
            monitor,
            commandInput: {
                ACL: 'public-read',
                ContentType: (syncCommandInput) => mime.lookup(syncCommandInput.Key)
            }
        });
    } finally {
        clearInterval(timeout);
    }

    return 'Uploaded to S3 complete!';
}

main().then((res) => console.log(res));
