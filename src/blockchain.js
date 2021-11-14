const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Transaction } = require('./components/transaction')
const { Block } = require('./components/block')

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransactions = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block(Date.parse('2017-01-01'), [], '0')
    }

    getLatestblock() {
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress) {
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward)
        this.pendingTransactions.push(rewardTx)

        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestblock().hash)
        block.mineBlock(this.difficulty)

        console.log('Block succesfully mined!')
        this.chain.push(block)

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }
    
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address.')
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to the chain.')
        }

        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address) {
        let balance = 0
        for (const  block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress == address) {
                    balance -= trans.amount
                }

                if (trans.toAddress == address) {
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid () {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (!currentBlock.hasValidTransaction()) {
                console.error('Has invalid transaction')
                return false
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.error('current hash not match')
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.error('Not valid from prev hash')
                return false
            }
        }

        return true
    }
}

module.exports.Blockchain = Blockchain
module.exports.Transaction = Transaction
