"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useGlobal } from "@/context/GlobalContext";

export function Header() {
  const { account, connectWallet, disconnectWallet } = useGlobal();

  return (
    <header className="border-b">
      <div className="container flex h-14 items-center">
        <nav className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link href="/faucet">
            <Button variant="ghost">Faucet</Button>
          </Link>
          <Link href="/balance">
            <Button variant="ghost">Balance</Button>
          </Link>
          <Link href="/transfer">
            <Button variant="ghost">Transfer</Button>
          </Link>
        </nav>
        <div className="ml-auto">
          {account ? (
            <Button onClick={disconnectWallet}>Disconnect {account}</Button>
          ) : (
            <Button onClick={connectWallet}>Connect</Button>
          )}
        </div>
      </div>
    </header>
  );
}
