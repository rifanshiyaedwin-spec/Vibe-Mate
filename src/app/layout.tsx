import '../index.css';

export const metadata = {
  title: 'VibeMate — Your Space. Your Vibe.',
  description: 'A premium, production-ready AI companion for everyday conversation, study support, and creative brainstorming powered by Gemini.',
  openGraph: {
    title: 'VibeMate — Your Space. Your Vibe.',
    description: 'A premium, production-ready AI companion for everyday conversation, study support, and creative brainstorming powered by Gemini.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080511] text-purple-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
