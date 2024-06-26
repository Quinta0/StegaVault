import Link from 'next/link';
import styles from '../app/globals.css';

export default function GetStarted() {
  return (
    <div className={styles.container}>
      <h1>Welcome to StegaVault</h1>
      <p>StegaVault is a secure, self-hosted password vault application that leverages the power of steganography to hide and retrieve passwords within images.</p>

      <h2>Getting Started</h2>

      <h3>Step 1: Upload an Image</h3>
      <p>Select an image file from your computer to use as the base for hiding your password.</p>

      <h3>Step 2: Hide a Password</h3>
      <p>Enter the password you want to hide and specify an output path for the steganographed image. Click "Hide Password" to embed your password into the image.</p>

      <h3>Step 3: Retrieve a Password</h3>
      <p>Upload the steganographed image from which you want to retrieve the password. Click "Retrieve Password" to extract the hidden password from the image.</p>

      <h2>Quick Links</h2>
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/app">Go to App</Link></li>
      </ul>

      <h2>Need Help?</h2>
      <p>If you need any help, feel free to reach out to our support team.</p>
    </div>
  );
}
