"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [address, setAddress] = useState("");
  const [sol, setSol] = useState(1);

  async function aridrop() {
    try {
      const res = await fetch("/api/solana", {
        method: "POST",
      });
      const json = await res.json();
      console.log(json);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>🔥 Airdrop SOL on devnet 🔥</h1>
      <input
        type="text"
        name="address"
        placeholder="Enter Solana account address..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className={styles.input}
      />
      <input
        type="number"
        name="sol"
        min={1}
        value={sol}
        onChange={(e) => setSol(e.target.value)}
        className={styles.input}
      />
      <button className={styles.button} onClick={aridrop}>
        Airdrop 😎
      </button>
    </main>
  );
}
