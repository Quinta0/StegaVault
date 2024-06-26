import './globals.css';

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>StegaVault</title>
      </head>
      <body>
        <header className="header">
          <nav>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/get-started">Get Started</a></li>
              <li><a href="/app">App</a></li>
            </ul>
          </nav>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
