'use client'

import { useState } from 'react';
import { faucetSubmit } from '@/lib/actions';
import { useGlobal } from '@/context/GlobalContext';

export default function Faucet() {
  const { account } = useGlobal();
  const [status, setStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    try {
      setIsLoading(true);
      await faucetSubmit(formData);
      setStatus('Successfully sent 1 ETH!');
      setIsLoading(false);
    } catch (error) {
      setStatus('Error: ' + (error as Error).message);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Faucet</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="account" className="block mb-2">Recipient Address:</label>
          <input
            type="text"
            id="account"
            name="account"
            defaultValue={account || ''}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Request 1 ETH
        </button>
      </form>
      {status && !isLoading && (
        <div className="mt-4">
          <p>{status}</p>
        </div>
      )}
    </div>
  );
} 