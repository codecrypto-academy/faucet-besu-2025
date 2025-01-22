"use client";

import { useState } from "react";
import { useGlobal } from "@/context/GlobalContext";

export default function Transfer() {
  const [status, setStatus] = useState<string>("");
  const { account } = useGlobal();
  async function handleSubmit(formData: FormData) {
    try {
      if (typeof window !== 'undefined' && !window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      const ethereum = window.ethereum;
      const amount = formData.get("amount") as string;
      const toAccount = formData.get("toAccount") as string;

      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      // Create transaction parameters
      const transactionParameters = {
        from: account,
        to: toAccount,
        value: "0x" + (Number(amount) * 1e18).toString(16), // Convert ETH to Wei
      };

      // Send transaction via MetaMask
      await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      //   await transferSubmit(formData);
      setStatus("Transfer successful!");
    } catch (error) {
      setStatus("Error: " + (error as Error).message);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transfer ETH</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fromAccount" className="block mb-2">
            From Account:
          </label>
          <input
            type="text"
            id="fromAccount"
            name="fromAccount"
            defaultValue={account || ""}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="toAccount" className="block mb-2">
            To Account:
          </label>
          <input
            type="text"
            id="toAccount"
            name="toAccount"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="amount" className="block mb-2">
            Amount (ETH):
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.000000000000000001"
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Transfer
        </button>
      </form>
      {status && (
        <div className="mt-4">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
}
