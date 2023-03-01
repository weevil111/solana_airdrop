import "./globals.css";

export const metadata = {
  title: "Aridrop SOL",
  description: "Airdrop SOLs on solana devnet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>
      </head>
      <body>{children}</body>
    </html>
  );
}
