require('custom-env').env(true);
const { S3Client } = require('@aws-sdk/client-s3');
const S3SyncClient = require('s3-sync-client');
const { TransferMonitor } = require('s3-sync-client');
const mime = require('mime-types');
const monitor = new TransferMonitor();

const PUBLIC_URL = process.env.PUBLIC_URL;
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID;
const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY;
const SOURCE_DIR = 'build/static';
const DEST_DIR = 'landing/static';

async function main() {
    if (!PUBLIC_URL || !AWS_S3_BUCKET || !AWS_S3_ACCESS_KEY_ID || !AWS_S3_SECRET_ACCESS_KEY) {
        return 'Missing AWS credentials'
    }

    const client = new S3Client({
        region: 'ap-southeast-1',
        credentials: { accessKeyId: AWS_S3_ACCESS_KEY_ID, secretAccessKey: AWS_S3_SECRET_ACCESS_KEY }
    });
    const { sync } = new S3SyncClient({ client });
    const timeout = setInterval(() => console.log(monitor.getStatus()), 2000);
    try {
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
