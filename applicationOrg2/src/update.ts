import { Gateway, Wallets, Wallet, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

async function main(): Promise<void> {
  try {

    // Create a new file system based wallet for managing identities.
    //const walletPath: string = path.join(process.cwd(), 'Org2Wallet');
    const walletPath: string = path.join(process.cwd(), 'IBPOrg2Wallet'); 
    const wallet: Wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway: Gateway = new Gateway();
    //const connectionProfilePath: string = path.resolve(__dirname, '..', 'connection2.json');
    const connectionProfilePath: string = path.resolve(__dirname, '..', 'BlockchainPlatformClinkGwOrg2Connection.json');
    const connectionProfile: any = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    
    //const connectionOptions: any = { wallet, identity: 'Org2 Admin', discovery: { enabled: true, asLocalhost: true } };
    const connectionOptions: any = { wallet, identity: 'Org2 CA Admin', discovery: { enabled: true, asLocalhost: false } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network: Network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract: Contract = network.getContract('contract');

    // Submit the specified transaction.
    // await contract.submitTransaction('updateDocAsset', 'REF6', '','Y','N' );
    var data = process.argv.slice(2);
    const trxn = data[0];
    const uen = data[1];
    const charityStatus = data[2];
    const picStatus = data[3];
    await contract.submitTransaction('updateDocAsset', trxn, uen, charityStatus, picStatus);

    console.log('Transaction committed ');

    // Disconnect from the gateway.
    gateway.disconnect();
    process.exit();

  } catch (error) {
    console.error('Failed to submit transaction:', error);
    process.exit(1);
  }
}
void main();
