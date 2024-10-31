require("dotenv").config()

const express=require("express")
const http=require("http")
const cors=require("cors")
const bodyParser=require("body-parser")

const {Connection}=require("@solana/web3.js")
const { pumpfunSwapTransactionFasterWallet, swapTokenFastestWallet, pumpfunSwapTransactionFasterWalletStaked, swapTokenFastestWalletStaked } = require("./swap")
const { getSwapMarketFastest, getSwapMarketFaster } = require("./utils");



//Initialze web3 connection instance with RPC node.
const connection=new Connection(process.env.RPC_API);
const stakedConnection=new Connection(process.env.STAKED_RPC)

const STAKED=Boolean(eval(process.env.STAKED))

//Initialze wallet instance
const PRIVATE_KEY = Uint8Array.from(bs58.decode(process.env.PRIVATE_KEY));
const wallet = Keypair.fromSecretKey(PRIVATE_KEY);

//Initialze API server
const app=express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    return res.json({
        status:"success"
    })
})

//Buy with 0.1 SOL on pumpfun
app.get("/pumpfun/:id/buy",async (req,res)=>{
    const targetToken=req.params.id;
    const result=(STAKED==false)?await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,0.1,true):await pumpfunSwapTransactionFasterWalletStaked(connection,stakedConnection,wallet,targetToken,0.1,true);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

//Sell all on pumpfun
app.get("/pumpfun/:id/sell",async (req,res)=>{
    const targetToken=req.params.id;
    const result=(STAKED==false)?await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,0.1,false):await pumpfunSwapTransactionFasterWalletStaked(connection,stakedConnection,wallet,targetToken,0.1,false);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

//POST API for both buy and sell on Pumpfun
app.post("/pumpfun",async (req,res)=>{
    const targetToken=req.body.token;
    const buy=Boolean(req.body.buy);
    const amount=Number(req.body.amount);
    const result=(STAKED==false)?await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,amount,buy):await pumpfunSwapTransactionFasterWallet(connection,stakedConnection,wallet,targetToken,amount,buy);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});

})

//Buy with 0.1 SOL on Raydium
app.get("/raydium/:id/buy",async (req,res)=>{
    const targetToken=req.params.id;
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=(STAKED==false)?await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,0.1,false):await swapTokenFastestWalletStaked(connection,stakedConnection,wallet,targetToken,swapMarket.poolKeys,0.1,false);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

//Sell all on Raydium
app.get("/raydium/:id/sell",async (req,res)=>{
    const targetToken=req.params.id;
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=(STAKED==false)?await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,0.1,true):await swapTokenFastestWalletStaked(connection, stakedConnection,wallet,targetToken,swapMarket.poolKeys,0.1,true);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

//POST API for both buy and sell on Raydium
app.post("/raydium/",async (req,res)=>{
    const targetToken=req.body.token;
    const buy=Boolean(req.body.buy);
    const amount=Number(req.body.amount);
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=(STAKED==false)?await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,amount,(!buy)):await swapTokenFastestWalletStaked(connection, stakedConnection,wallet,targetToken,swapMarket.poolKeys,amount,(!buy));
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});

})


//Create webserver and start service
const server=http.createServer(app);
server.listen(process.env.PORT,()=>{
    console.log(`API is started on PORT:${process.env.PORT}`)
})

