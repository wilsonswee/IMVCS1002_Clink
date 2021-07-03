import { Gateway, Wallets, Wallet, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
const config = require("../config.json");

async function main(): Promise<void> {
  try {

    // Create a new file system based wallet for managing identities.
    const walletPath: string = path.join(process.cwd(), config.Wallet);
    const wallet: Wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway: Gateway = new Gateway();
    const connectionProfilePath: string = path.resolve(__dirname, '..', config.connectionFabricGateWay);   
    const connectionProfile: any = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    
    //const connectionOptions: any = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
    const connectionOptions: any = { wallet, identity: config.Organization, discovery: { enabled: true, asLocalhost: config.asLocalhost } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network: Network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract: Contract = network.getContract('contract');

    // Submit the specified transaction.
    var data = process.argv.slice(2);
    const trxn = data[0];
    const IDPassport = data[1];
    const uen = data[2];
    const incorporationDate = data[3];
    const PersonInCharge = data[4];
    const address = data[5];
    const charityStatus = data[6];
    const picStatus = data[7];
  
   // await contract.submitTransaction('createDocAsset', 'REF6', 'G70102938T','', '30/6/2021', 'Dr Rizal', 'Malaysia','','' );
   await contract.submitTransaction('createDocAsset', trxn, IDPassport, uen, incorporationDate, PersonInCharge, address, charityStatus, picStatus )
   console.log('Transaction committed');

    // Disconnect from the gateway.
    gateway.disconnect();
    process.exit();

  } catch (error) {
    console.error('Failed to submit transaction:', error);
    process.exit(1);
  }
}
void main();
