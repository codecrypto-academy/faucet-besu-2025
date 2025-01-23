# PROJECT FAUCET BESU

## URL PROJECT

https://github.com/codecrypto-academy/faucet-besu-2025.git

## Project Description

This project consists of a web application that interacts with an Ethereum network using MetaMask and includes a script to create a Besu network. The main components are:

- A web-based faucet interface built with Next.js
- Integration with MetaMask for Ethereum wallet connectivity
- A Besu network node setup script
- Utility functions for creating keys, making transfers and checking balances
- Environment configuration for connecting to the local Besu network

The project allows users to interact with a private Ethereum network powered by Hyperledger Besu for testing and development purposes.

## Demo

Video project demo


## The Besu network

https://besu.hyperledger.org/


## Consensus

https://besu.hyperledger.org/private-networks/concepts/poa

## Create a private network using Clique

https://besu.hyperledger.org/private-networks/tutorials/clique

## Genesis.json

```sh
cat > networks/besu-network/genesis.json << EOF
{
  "config": {
    "chainId": 13371337,
    "londonBlock": 0,
    "clique": {
              "blockperiodseconds": 4,
              "epochlength": 30000,
              "createemptyblocks": true
    }
  },
  "extraData": "0x0000000000000000000000000000000000000000000000000000000000000000$(cat networks/besu-network/bootnode/address)0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x1fffffffffffff",
  "difficulty": "0x1",
  "alloc": {
    "$(cat networks/besu-network/bootnode/address)": {
      "balance": "0x200000000000000000000000000000000000000000000000000000000000000"
    }
  }
}
EOF
```

## Config.toml
```sh
cat > networks/besu-network/config.toml << EOF
genesis-file="/data/genesis.json"
# Networking
p2p-host="0.0.0.0"
p2p-port=30303
p2p-enabled=true
# JSON-RPC

rpc-http-enabled=true
rpc-http-host="0.0.0.0"
rpc-http-port=8545
rpc-http-cors-origins=["*"]
rpc-http-api=["ETH","NET","CLIQUE","ADMIN", "TRACE", "DEBUG", "TXPOOL", "PERM"]
host-allowlist=["*"]            
EOF
```

## docker launch

Create the network

```
docker network create besu-network \
  --subnet $NETWORK \
  --label network=besu-network \
  --label type=besu
```

Launch the container

```sh
docker run -d \
  --name besu-network-bootnode \
  --label nodo=bootnode \
  --label network=besu-network \
  --ip ${BOOTNODE_IP} \
  --network besu-network \
  -p 8888:8545 \
  -v $(pwd)/networks/besu-network:/data \
  hyperledger/besu:latest \
  --config-file=/data/config.toml \
  --data-path=/data/bootnode/data \
  --node-private-key-file=/data/bootnode/key.priv \
  --genesis-file=/data/genesis.json
```

### Create keys private, public, address and enode

We use index.mjs. This file has a utility function to create keys, make transfers and check balances.


```sh
node ./index.mjs create-keys 192.168.1.100
# use the address of the bootnode
node ./index.mjs balance 0x$(cat networks/besu-network/bootnode/address)
# transfer 10000 to the address of the bootnode
node ./index.mjs transfer 0x$(cat networks/besu-network/bootnode/key.priv) 
0x$(cat networks/besu-network/bootnode/address) 10000
```

