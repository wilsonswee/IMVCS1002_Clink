/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class DocAssetContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        
        const _documents = [
            {
                IDPassport:'S9012344D',
                uen: 'T123456',    
                incorporationDate: '05/05/2020',    
                PersonInCharge: 'Tan Ah Kow',
                address:'18 Gombak Ave',
                charityStatus:'Y',
                picStatus:'',                
            },
            {
                IDPassport:'G7012388J',
                uen: 'P3998293',    
                incorporationDate: '12/8/2019',    
                PersonInCharge: 'Lim Ah Peh',
                address:'18 Gombak Ave',
                charityStatus:'Y',
                picStatus:'N',
            },
            {
                IDPassport:'T8055388Z',
                uen: '',    
                incorporationDate: '15/3/2021',    
                PersonInCharge: 'Tan Swee Sanh',
                address:'36 Pasir Ris Ave 5',
                charityStatus:'',
                picStatus:'',
            },
        ];


        for (let i = 0; i < _documents.length; i++) {
            _documents[i].docType = 'NEW';
            await ctx.stub.putState('REF'+ i, Buffer.from(JSON.stringify(_documents[i])));
            console.info('Added <--> ', _documents[i]);
        }
    
        console.info('============= END : Initialize Ledger ===========');
 //       process.exit();
    }


    async docAssetExists(ctx, docAssetId) {
        const buffer = await ctx.stub.getState(docAssetId);
        return (!!buffer && buffer.length > 0);
    }

/*    async createDocAsset(ctx, docAssetId, value) {
        const exists = await this.docAssetExists(ctx, docAssetId);
        if (exists) {
            throw new Error(`The doc asset ${docAssetId} already exists`);
        }
        const asset = { value };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(docAssetId, buffer);
    }
*/
//async createDocAsset(ctx, docAssetId, IDPassport, uen, incorporationDate, PersonInCharge, address) {
    async createDocAsset(ctx, docAssetId, IDPassport, uen, incorporationDate, PersonInCharge, address, charityStatus, picStatus) {
        console.info('============= START : Create DocAsset ===========');
        
        const _document = {
            IDPassport,           
            uen,
            incorporationDate,
            PersonInCharge,
            address,
            charityStatus,
            picStatus,
            docType: 'NEW',
        };
        const buffer = Buffer.from(JSON.stringify(_document));
        const asset = await ctx.stub.putState(docAssetId, buffer);
        console.info('=====Created transaction committed ======= ');
        return asset;
    }

    async readDocAsset(ctx, docAssetId) {
        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        const buffer = await ctx.stub.getState(docAssetId);
        const asset = JSON.parse(buffer.toString());
        return asset;
    }

    async updateDocAsset(ctx, docAssetId, newUEN, newcharityStatus, newpicStatus) {
        console.info('============= START : updateDocAsset ===========');

        //const _docAsset = await this.docAssetExists(ctx, docAssetId);
        const _docAsset = await ctx.stub.getState(docAssetId);
        if (!_docAsset || _docAsset.length === 0) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        
        const _document = JSON.parse (_docAsset.toString());

 
/*
        _document.uen = newUEN;
        _document.charityStatus = newcharityStatus;
        _document.picStatus = newpicStatus;
        */
        
        if (_document.docType == 'ACRA_Org1')
        {   // Org2 COC will update charityStatus and IPC
            _document.charityStatus = newcharityStatus;
            _document.picStatus = newpicStatus;
            _document.docType = 'ACRA_COC_Org2';
        } else if (newUEN != null) {
            //Org1 ACRA will assign newUEN
            _document.uen = newUEN;
            _document.docType = 'ACRA_Org1';
        } 
        const buffer = Buffer.from(JSON.stringify(_document));
        await ctx.stub.putState(docAssetId, buffer);

        console.info('============= END : updateDocAsset ===========');
    }

    async readAllDocAssets(ctx) {
        console.info('============= queryAllDocAssets ===========');
        
        let queryString = {"selector":{}};

        console.log("In readAllDocAssets: queryString = ");
        console.log(queryString);

        const iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        const allDocs = [];

        // Iterate through them and build an array of JSON objects
        while (true) {
            const docitem = await iterator.next();
            if (docitem.value && docitem.value.value.toString()) {
                console.log(docitem.value.value.toString('utf8'));

                let Record;

                try {
                    Record = JSON.parse(docitem.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    Record = docitem.value.value.toString('utf8');
                }
                allDocs.push(Record);
            }

            if (docitem.done) {
                console.log('********* end of queryAllDocAssets');
                await iterator.close();
                console.info(allDocs);
                return allDocs;
            }
        }
    }

 /*   async updateDocAsset(ctx, docAssetId, newValue) {
        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        const asset = { value: newValue };
        const buffer = Buffer.from(JSON.stringify(asset));
        await ctx.stub.putState(docAssetId, buffer);
    }

    async deleteDocAsset(ctx, docAssetId) {
        const exists = await this.docAssetExists(ctx, docAssetId);
        if (!exists) {
            throw new Error(`The doc asset ${docAssetId} does not exist`);
        }
        await ctx.stub.deleteState(docAssetId);
    }
    */


}

module.exports = DocAssetContract;
