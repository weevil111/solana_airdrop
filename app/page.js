"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import styles from "./page.module.css";
import * as SOLANA from "@solana/web3.js";

const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = SOLANA;
const SOLANA_CONNECTION = new Connection(clusterApiUrl("devnet"));

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [address, setAddress] = useState("");
  const [sol, setSol] = useState(1);
  const [message, setMessage] = useState("");
  const [isSnackbarHidden, setIsSnackbarHidden] = useState(true);
  const [snackbarColor, setSnackbarColor] = useState("");
  const [txnLink, setTxnLink] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  function showSnackbar({ message, timeout = 5000, color = "" } = {}) {
    setMessage(message);
    setIsSnackbarHidden(false);
    setSnackbarColor(color);

    // Hide it after 3 seconds...
    setTimeout(function () {
      setIsSnackbarHidden(true);
      setSnackbarColor("");
    }, timeout);
  }

  async function airdrop() {
    if (!address || !sol) {
      showSnackbar({
        message: "Please enter all the fields",
        color: "error",
      });
      return;
    }

    const AIRDROP_AMOUNT = sol * LAMPORTS_PER_SOL;

    try {
      setDisableBtn(true);
      setTxnLink("");

      const signature = await SOLANA_CONNECTION.requestAirdrop(
        new PublicKey(address),
        AIRDROP_AMOUNT
      );
      const { blockhash, lastValidBlockHeight } =
        await SOLANA_CONNECTION.getLatestBlockhash();
      await SOLANA_CONNECTION.confirmTransaction(
        {
          blockhash,
          lastValidBlockHeight,
          signature,
        },
        "finalized"
      );
      showSnackbar({ message: "Airdrop was successful", color: "success" });
      setTxnLink(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
    } catch (err) {
      console.log(err);
      if (err.name === "SolanaJSONRPCError") {
        showSnackbar({
          message: "Limit reached for this account. Please try a different one",
          color: "error",
        });
      } else {
        showSnackbar({
          message: "Something went wrong. Please try again",
          color: "error",
        });
      }
    } finally {
      setDisableBtn(false);
    }
  }

  return (
    <>
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
        <button
          className={styles.button}
          onClick={airdrop}
          disabled={disableBtn}
        >
          {disableBtn ? (
            <>
              <i className="fa fa-cog fa-spin"></i>
              Working 👨‍💻
            </>
          ) : (
            <>Airdrop 😎</>
          )}
        </button>
        {txnLink && (
          <div className={styles.success}>
            The transaction was successful.{" "}
            <a href={txnLink} target="_blank">
              {" "}
              Click to see transaction details
            </a>
          </div>
        )}
      </main>
      <div
        className={`snackbar ${
          isSnackbarHidden ? "" : "show"
        } ${snackbarColor}`}
      >
        {message}
      </div>
      <span className={styles["bottom-left"]}>
        Hi Harkirat! You're an inspiration 😇
      </span>
      <span className={styles["bottom-right"]}>
        Developed by{" "}
        <a target="_blank" href="https://www.github.com/weevil111">
          Abhinav Parag Mishra
        </a>
      </span>
    </>
  );
}
