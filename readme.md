
# Simple swap API for research about Solana meme coin trading

## 1. APIs for Pumpfun

### - BUY

```GET : /pumpfun/<TOKEN_MINT>/buy```

### - SELL

```GET : /pumpfun/<TOKEN_MINT>/sell```

### - Simple endpoint

```
    POST

    /pumpfun/

    Request :

    {
        token : <String> (example : )
        buy : <Boolean> (true or false),
        amount : <Number> (example :  0.1),
    }
```

## 2. APIs for Raydium

### - BUY

```/raydium/<TOKEN_MINT>/buy```

### - SELL

```/raydium/<TOKEN_MINT>/sell```

### - Simple endpoint

```
    POST

    /raydium/

    Request :

    {
        token : <String> (example : )
        buy : <Boolean> (true or false),
        amount : <Number> (example :  0.1),
    }
```