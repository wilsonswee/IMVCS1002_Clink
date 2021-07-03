
/*
'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
*/

import { Gateway, Wallets, Wallet, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';
const config = require("../config.json");

async function main() {
  try {

    // Create a new file system based wallet for managing identities.

    const walletPath: string = path.join(process.cwd(), config.Wallet);
    const wallet: Wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Create a new gateway for connecting to our peer node.
    const gateway: Gateway = new Gateway();
    const connectionProfilePath: string = path.resolve(__dirname, '..', config.connectionFabricGateWay);
    const connectionProfile: any = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    
    //If running on localhost
    //const connectionOptions: any = { wallet, identity: 'Org1 Admin', discovery: { enabled: true, asLocalhost: true } };
    
    // If running on cloud
    //const connectionOptions: any = { wallet, identity: 'Org1 CA Admin', discovery: { enabled: true, asLocalhost: false } };
    const connectionOptions: any = { wallet, identity: config.Organization, discovery: { enabled: true, asLocalhost: true } };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network: Network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    const contract: Contract = network.getContract('contract');

    await contract.submitTransaction('initLedger');
    console.log('Transaction committed');

    gateway.disconnect();
    // do not use process.exit() as it may cause 
    //[ServiceEndpoint]: Error: Failed to connect before the deadline on Committer- name: orderer-api.127-0-0-1.nip.io:8083, url:grpc://orderer-api.127-0-0-1.nip.io:8083, connected:false, connectAttempted:true
    // If process.exit is not used, need to Ctrl+C to kill process
    process.exit(0);
    } catch (error) {
      console.error(`Failed to submit transaction: ${error}`);
      process.exit(1);
    }
  }
main();
