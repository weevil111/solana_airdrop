import "./globals.css";

export const metadata = {
  title: "Aridrop SOL",
  description: "Airdrop SOLs on solana devnet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
