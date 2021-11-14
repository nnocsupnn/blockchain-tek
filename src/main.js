const { Blockchain, Transaction } = require('./blockchain')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('c98025d5c33229d5f2f4b0eb60df5c4d40744e6b427f1bc179031579f157e533')
const myWalletAddress = myKey.getPublic('hex')
console.log(myWalletAddress)
console.log('04a7941d47e01a20e5d9d375713e5a42bf5054f1842e44563b5e2bf70a2716f89b137dda91076187ea8b7dd74db3d6a572a71346463a33452c8eff5443dba464ff')

let asdad = new Blockchain()

const tx1 = new Transaction(myWalletAddress, 'publicKey goes here', 10);
tx1.signTransaction(myKey)
asdad.addTransaction(tx1)


console.log('\nStarting miner..')
asdad.minePendingTransactions(myWalletAddress)

console.log('\nBalance of xavier is:', asdad.getBalanceOfAddress(myWalletAddress))


console.log('Is chain valid? ', asdad.isChainValid())