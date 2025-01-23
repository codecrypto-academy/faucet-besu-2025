# delete networks
rm -rf networks
# true is for ignore error
docker rm -f $(docker ps -aq --filter "label=network=besu-network") 2>/dev/null || true
docker network rm besu-network 2>/dev/null || true

# Set network configuration
NETWORK="172.24.0.0/16"
BOOTNODE_IP="172.24.0.20"

# make dir
mkdir -p networks/besu-network

# create network in docker 
docker network create besu-network \
  --subnet $NETWORK \
  --label network=besu-network \
  --label type=besu

# create private key public key and address
cd networks/besu-network
mkdir -p bootnode
cd bootnode
node ../../../index.mjs create-keys 172.24.0.21 
cd ../../..


# Create genesis.json with Clique PoA configuration
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

# Create config.toml for Besu node configuration
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

# launch besu node
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


# create keys for test in current dir
node ./index.mjs create-keys 192.168.1.100

sleep 10

# check balance
node index.mjs balance $(cat networks/besu-network/bootnode/address)

# transfer 10000 to 0x$(cat address)
node index.mjs transfer $(cat networks/besu-network/bootnode/key.priv) 0x$(cat address) 10000

# check balance
node index.mjs balance 0x$(cat address)