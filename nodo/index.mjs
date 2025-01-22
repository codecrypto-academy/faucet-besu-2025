import pkg from 'elliptic';
const { ec: EC } = pkg;
import { ethers } from 'ethers';



import { Buffer } from 'buffer';
import keccak256 from 'keccak256';
import fs from 'fs';

async function callApi(url, method, params) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: method,
            params: params,
            id: 1
        })
    });
    const json = await response.json();
    return json;
}

function createKeys(ip) {
    // curva eth, btc
    const ec = new EC('secp256k1');
    // generate a key pair
    const keyPair = ec.genKeyPair();
    const privateKey = keyPair.getPrivate('hex')
    const publicKey = keyPair.getPublic('hex')
    // remove 2 characters, compute  hash with keccak257 (no sha3)
    const pubKeyBuffer = keccak256(Buffer.from(publicKey.slice(2), 'hex'));
    // get last 20 bytes or  last 40 chars.
    const address = pubKeyBuffer.toString("hex").slice(-40)
    // get enode
    const enode = `enode://${publicKey.slice(2)}@${ip}:30303`

    return {
        privateKey,
        publicKey,
        address,
        enode
    }
}

async function getBalance(url, address) {
    const data = await callApi(url, "eth_getBalance", [address, "latest"]);
    return BigInt(data.result);

}

async function getBlockNumber(url) {

}

async function transferFrom(url, fromPrivate, to, amount) {
    // Create a wallet from the private key
    const wallet = new ethers.Wallet(fromPrivate);
    // Connect wallet to the JSON-RPC provider
    const provider = new ethers.JsonRpcProvider(url, {
        chainId: 13371337,
        name: "private"
    });
    const connectedWallet = wallet.connect(provider);
    // Create and send the transaction
    const tx = await connectedWallet.sendTransaction({
        to: to,
        value: ethers.parseEther(amount.toString())
    });

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return receipt;
}
async function getNextworkInfo(url) {
    const version =  await callApi("http://localhost:8888", "net_version", [])
    const peerCount = await callApi("http://localhost:8888", "net_peerCount", [])
    return {
        version,
        peerCount
    };
}


// Command line handling
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch(command) {
        case 'create-keys':
            const ip = args[1];
            if (!ip) {
                console.error('IP address required for create-keys');
                process.exit(1);
            }
            const keys = createKeys(ip);
            fs.writeFileSync("./key.priv", keys.privateKey);
            fs.writeFileSync("./key.pub", keys.publicKey); 
            fs.writeFileSync("./address", keys.address);
            fs.writeFileSync("./enode", keys.enode);
            console.log('Keys created successfully');
            break;

        case 'network-info':
            const url = args[1] || 'http://localhost:8888';
            const info = await getNextworkInfo(url);
            console.log('Network Info:', info);
            break;
        case 'balance':
            const balanceAddress = args[1];
            if (!balanceAddress) {
                console.error('Usage: balance [url] <address>');
                process.exit(1);
            }
            try {
                const balance = await getBalance("http://localhost:8888", balanceAddress);
                console.log('Balance:', ethers.formatEther(balance), 'ETH');
            } catch (error) {
                console.error('Error getting balance:', error);
                process.exit(1);
            }
            break;
        case 'transfer':
            const fromPrivateKey = args[1];
            const toAddress = args[2];
            const amount = args[3];
            if (!toAddress || !amount || !fromPrivateKey) {
                console.error('Usage: transfer <to-address> <amount> <from-private-key>');
                process.exit(1);
            }
            try {
                const tx = await transferFrom("http://localhost:8888", fromPrivateKey, toAddress, amount);
                console.log('Transaction sent:', tx);
            } catch (error) {
                console.error('Error sending transaction:', error);
                process.exit(1);
            }
            break;

            
        default:
            console.log(`
Available commands:
    create-keys <ip>     - Create node keys for given IP address
    network-info [url]   - Get network information (defaults to http://localhost:8888)
    transfer <fromPrivate> <to> <amount> - Transfer funds from one account to another
            `);
    }
}
// Run if called directly
if (import.meta.url === new URL(import.meta.url).href) {
    main().catch(console.error);
}
