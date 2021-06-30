'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets, X509WalletMixin } = require('fabric-network');
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
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  console.log(`Wallet path: ${walletPath}`);

  // Check to see if we've already enrolled the admin user.
  const userExists = await wallet.get('org1admin');
  if (userExists) {
    console.log('An identity for "org1admin" already exists in the wallet');
    return;
  }

  // Enroll the admin user, and import the new identity into the wallet.
  const enrollment = await ca.enroll({ enrollmentID: 'org1admin', enrollmentSecret: 'org1adminpw' });
  const identity = X509WalletMixin.createIdentity('org1msp', enrollment.certificate, enrollment.key.toBytes());
  await wallet.import('org1admin', identity);
  console.log('Successfully enrolled client "org1admin" and imported it into the wallet');
  process.exit();
  
  } catch (error) {
    console.error(`Failed to enroll "Org1User1": ${error}`);
    process.exit(1);
  }
}

main();
