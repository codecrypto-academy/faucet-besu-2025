# Proyect Faucet with Besu

This project consists of a web application that interacts with an Ethereum network using MetaMask and a script to create the besu network.

## Create the besu network

In the nodo folder there is a script to create the besu network.
There is a index.js file that has a utility function to create keys , make transfer ane balance

Install packages
```
cd nodo
npm install
```


run the script. The file must have the permissions to be executed. chmod +x nodo.sh
Si hacemos ll nodo.sh debemos de ver
```
-rwxr-xr-x@  1 joseviejo  staff   2.6K Jan 22 18:12 nodo.sh
```
Execute the script

```
nodo.sh
```
Test the container with the following command
```
docker ps

9b8eaa77b60f   hyperledger/besu:latest   "besu-entry.sh --con…"   About an hour ago   Up About an hour (healthy)   8546-8547/tcp, 8550-8551/tcp, 30303/tcp, 0.0.0.0:8888->8545/tcp   besu-network-bootnode
```


## Prerequisites 

- Node.js (v18 or higher)
- MetaMask browser extension
- Running Besu network (see network setup instructions)

## Environment Setup

1. Create a `.env.local` file in the front-back directory with the following variables:

PRIVATE_KEY_FILE: ../nodo/networks/besu-network/bootnode/key.priv◊
BESU_URL: http://localhost:8888

