const { Client } = require('pg')

const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'sam',
    database: 'bankdb',
    post: 5432
})

client.connect(err => {
    if (err) {
        console.log(` Error In Connectivity`)
        return
    }
    console.log(`\n Connected Successfully`)
})

const createNewAccount = ({ acId, acNm, balance }, onCreate = undefined) => {
    client.query(`insert into account values ($1, $2, $3)`, [acId, acNm, balance], (err, res) => {
        if (err) console.log(`\n Error In Creating the Customer`)
        else {
            console.log(`\n New Customer Created Successfully`)
            if(onCreate) onCreate(` New Customer Created Successfully`)
        }
    })
}

const withdraw = ({ acId, amount }, onWithdraw = undefined) => {
    client.query(`select balance from account where ac_id = $1`, [acId], (err, res) => {
        if (err) {
            console.log(`\n Error In Withdrawing`)
        } else {
            const balance = parseFloat(res.rows[0].balance)

            const newBalance = balance - parseFloat(amount)

            client.query(`update account set balance = $1 where ac_id = $2`, [newBalance, acId], (err, res) => {
                if (err) console.log(`\n Problem In Withdrawal`)
                else {
                    console.log(`\n Amount ${amount} Withdrawal Successfully`)
                    if(onWithdraw) onWithdraw(` Amount ${amount} Withdrawn Successfully`)
                }
            })
        }
    })
}

const deposit = ({ acId, amount }, onDeposit = undefined) => {
    client.query(`select balance from account where ac_id = $1`, [acId], (err, res) => {
        if (err) {
            console.log(`\n Error In Deposit`)
        }
        else {
            const balance = parseFloat(res.rows[0].balance)
            const newBalance = balance + parseFloat(amount)

            client.query(`update account set balance = $1 where ac_id = $2`, [newBalance, acId], (err, res) => {
                if (err) console.log(`\n Error In Depositing`)
                else  {
                    console.log(`\n Amount ${amount} Deposited Successfully`)

                    if(onDeposit) onDeposit(` Amount ${amount} Deposited Successfully`)
                }
            })
        }
    })
}

const transfer = ( {srcId, destId, amount }, onTransfer = undefined) => {
    withdraw({ acId : srcId, amount }, msgWd => {
        deposit({ acId : destId, amount }, msgDp => {
            if(onTransfer) onTransfer( ` Amount ${amount} Transferred Successfully` )
        })
    })
}

const balance  = (acId, onBalance = undefined) => {
    console.log(acId)
    client.query(`select balance from account where ac_id = $1`, [acId], (err, res) => {
        if (err) {
            console.log(`\n Problem In Fetching the Balance`)
            console.log(err)
        } else {
            const balance = parseFloat(res.rows[0].balance)
            console.log(`\nYour Account Balance Is : ${balance}`)
            if(onBalance) onBalance(balance)
        }
    })
}

module.exports = {
    createNewAccount, deposit, withdraw, transfer, balance
}
