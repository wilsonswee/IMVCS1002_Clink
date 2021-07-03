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

    const transactionID = process.argv.slice(2).toString();
    if (transactionID == "") 
    {
      console.log ('TransactionID is null');
      throw "[missing argument] - $ node ./dist/queryDocExist.js transactionID";
    } else
    {

    const result = await contract.evaluateTransaction('docAssetExists', transactionID);
    console.log("[queryDocExist] Checking if  " + transactionID +  " exist ---->"+ result.toString());
    }
    // Disconnect from the gateway.
    gateway.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('Failed to submit transaction:', error);
    process.exit(1);
  }
}
void main();
