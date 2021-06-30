import { Gateway, Wallets, Wallet, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main(): Promise<void> {
  try {

    // Create a new file system based wallet for managing identities.
    //const walletPath: string = path.join(process.cwd(), 'Org1Wallet');
    const walletPath: string = path.join(process.cwd(), 'IBPOrg1Wallet');
    const wallet: Wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway: Gateway = new Gateway();
    //const connectionProfilePath: string = path.resolve(__dirname, '..', 'connection.json');
    const connectionProfilePath: string = path.resolve(__dirname, '..', 'BlockchainPlatformClinkGwConnection.json');
    
    const connectionProfile: any = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    
    //const connectionOptions: any = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
    const connectionOptions: any = { wallet, identity: 'Org1 CA Admin', discovery: { enabled: true, asLocalhost: false } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network: Network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract: Contract = network.getContract('contract');

    // Submit the specified transaction.
    await contract.submitTransaction('createDocAsset', 'REF6', 'G70102938T','', '6/6/2021', 'Dr Rizal', 'Malaysia','','' );
    console.log('Transaction has been submitted');

    // Disconnect from the gateway.
    gateway.disconnect();
    process.exit();

  } catch (error) {
    console.error('Failed to submit transaction:', error);
    process.exit(1);
  }
}
void main();
