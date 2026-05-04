export const metadata = {
  title: "Gold Calculator",
  description: "Gold price reference tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
