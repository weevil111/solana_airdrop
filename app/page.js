"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import styles from "./page.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [address, setAddress] = useState("");
  const [sol, setSol] = useState(1);
  const [message, setMessage] = useState("");
  const [isSnackbarHidden, setIsSnackbarHidden] = useState(true);
  const [snackbarColor, setSnackbarColor] = useState("");
  const [txnLink, setTxnLink] = useState("");
  const [disableBtn, setDisableBtn] = useState(false);

  function showSnackbar({ message, timeout = 3000, color = "" } = {}) {
    setMessage(message);
    setIsSnackbarHidden(false);
    setSnackbarColor(color);

    // Hide it after 3 seconds...
    setTimeout(function () {
      setIsSnackbarHidden(true);
      setSnackbarColor("");
    }, timeout);
  }

  async function aridrop() {
    if (!address || !sol) {
      showSnackbar({
        message: "Please enter all the fields",
        color: "error",
      });
      return;
    }
    try {
      setDisableBtn(true);
      setTxnLink("");
      const res = await fetch("/api/solana", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ pubkey: address, amount: sol }),
      });
      const result = await res.json();
      if (result.success) {
        showSnackbar({ message: "Airdrop was successful", color: "success" });
        setTxnLink(result.message);
      } else {
        showSnackbar({ message: result.message, color: "error" });
      }
    } catch (err) {
      console.log(err);
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
          onClick={aridrop}
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
