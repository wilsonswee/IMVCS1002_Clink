'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
  try {

  // Create a new CA client for interacting with the CA.
  const caURL = ccp.certificateAuthorities['159.122.175.228:31260'].url;
  const ca = new FabricCAServices(caURL);

  // Create a new file system based wallet for managing identities.
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = new FileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the admin user.
  const userExists = await wallet.exists('Org1User1');
  if (userExists) {
    console.log('An identity for "Org1User1" already exists in the wallet');
    return;
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({ enrollmentID: 'Org1User1', enrollmentSecret: 'Org1User1pw' });
  const identity = X509WalletMixin.createIdentity('org1msp', enrollment.certificate, enrollment.key.toBytes());
  await wallet.import('Org1user1', identity);
  console.log('Successfully enrolled client "Org1User1" and imported it into the wallet');
  process.exit();

  } catch (error) {
    console.error(`Failed to enroll "Org1User1": ${error}`);
    process.exit(1);
  }
}

main();
