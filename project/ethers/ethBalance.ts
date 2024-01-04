import { ethers } from "ethers";

const INFURA_ID = 'c7f66cfd59e2474ca0a704f32c65eaa2';
const provider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_ID}`);

const address: string = ''; 

async function getEthBalance(address: string): Promise<void> {
    const balance = await provider.getBalance(address);
    console.log(`ETH Balance of ${address} --> ${ethers.utils.formatEther(balance)} ETH`);
}

async function main(): Promise<void> {
    await getEthBalance(address);
}

main();
