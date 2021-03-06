"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_network_1 = require("fabric-network");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const config = require("../config.json");
async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), config.Wallet);
        const wallet = await fabric_network_1.Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        const connectionProfilePath = path.resolve(__dirname, '..', config.connectionFabricGateWay);
        const connectionProfile = JSON.parse(fs.readFileSync(connectionProfilePath, 'utf8')); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
        //const connectionOptions: any = { wallet, identity: 'Org2 Admin', discovery: { enabled: true, asLocalhost: true } };
        const connectionOptions = { wallet, identity: config.Organization, discovery: { enabled: true, asLocalhost: config.asLocalhost } };
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
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
    }
    catch (error) {
        console.error('Failed to submit transaction:', error);
        process.exit(1);
    }
}
void main();
//# sourceMappingURL=update.js.map