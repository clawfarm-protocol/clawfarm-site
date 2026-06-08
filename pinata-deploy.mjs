import pinataSDK from '@pinata/sdk';
import path from 'path';

const apiKey = process.env.PINATA_API_KEY;
const apiSecret = process.env.PINATA_SECRET_API_KEY;

if (!apiKey || !apiSecret) {
    throw new Error('Missing PINATA_API_KEY or PINATA_SECRET_API_KEY');
}

const pinata = new pinataSDK(apiKey, apiSecret);

const sourcePath = './out';
const options = {
    pinataMetadata: {
        name: 'clawfarm-site-ipfs',
    },
    pinataOptions: {
        cidVersion: 0
    }
};

try {
    const result = await pinata.pinFromFS(sourcePath, options);
    console.log('SUCCESS: Deployed to IPFS');
    console.log('CID:', result.IpfsHash);
    console.log('URL: https://gateway.pinata.cloud/ipfs/' + result.IpfsHash);
} catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
}
