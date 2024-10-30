require("dotenv").config()

const express=require("express")
const http=require("http")
const cors=require("cors")
const bodyParser=require("body-parser")

const {Connection}=require("@solana/web3.js")
const { pumpfunSwapTransactionFasterWallet, swapTokenFastestWallet } = require("./swap")
const { getSwapMarketFastest, getSwapMarketFaster } = require("./utils")

const connection=new Connection(process.env.RPC_API);

const PRIVATE_KEY = Uint8Array.from(bs58.decode(process.env.PRIVATE_KEY));
const wallet = Keypair.fromSecretKey(PRIVATE_KEY);

const app=express();
app.use(cors())

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    return res.json({
        status:"success"
    })
})

app.get("/pumpfun/:id/buy",async (req,res)=>{
    const targetToken=req.params.id;
    const result=await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,0.1,true);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

app.get("/pumpfun/:id/sell",async (req,res)=>{
    const targetToken=req.params.id;
    const result=await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,0.1,false);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

app.post("/pumpfun",async (req,res)=>{
    const targetToken=req.body.token;
    const buy=Boolean(req.body.buy);
    const amount=Number(req.body.amount);
    const result=await pumpfunSwapTransactionFasterWallet(connection,wallet,targetToken,amount,buy);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});

})

app.get("/raydium/:id/buy",async (req,res)=>{
    const targetToken=req.params.id;
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,0.1,false);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

app.get("/raydium/:id/sell",async (req,res)=>{
    const targetToken=req.params.id;
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,0.1,true);
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});
})

app.post("/raydium/",async (req,res)=>{
    const targetToken=req.body.token;
    const buy=Boolean(req.body.buy);
    const amount=Number(req.body.amount);
    const swapMarket=await getSwapMarketFaster(connection,targetToken);
    const result=await swapTokenFastestWallet(connection,wallet,targetToken,swapMarket.poolKeys,amount,(!buy));
    if(result!=true)
        return res.json({status:"error"});
    return res.json({status:"success"});

})

const server=http.createServer(app);
server.listen(process.env.PORT,()=>{
    console.log(`API is started on PORT:${process.env.PORT}`)
})

