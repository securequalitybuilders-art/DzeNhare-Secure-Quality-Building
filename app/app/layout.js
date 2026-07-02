import './globals.css';

export const metadata = {
  title: {
    default: 'DzeNhare',
    template: '%s | DzeNhare',
  },
  description: 'Decision-control and financial operating system for construction in Zimbabwe.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
