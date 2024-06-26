"use client";
import { useState } from 'react';
import axios from 'axios';
import styles from './globals.css';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [outputPath, setOutputPath] = useState('');
  const [password, setPassword] = useState('');
  const [retrievedPassword, setRetrievedPassword] = useState('');

  const hidePassword = async () => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    formData.append('output_path', outputPath);
    formData.append('password', password);

    try {
      const response = await axios.post('/api/hide_password', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error hiding password:', error);
    }
  };

  const retrievePassword = async () => {
    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('/api/retrieve_password', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setRetrievedPassword(response.data.password);
    } catch (error) {
      console.error('Error retrieving password:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1>StegaVault</h1>
      <div>
        <input type="file" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        <input type="text" placeholder="Output Path" onChange={(e) => setOutputPath(e.target.value)} />
        <input type="text" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={hidePassword}>Hide Password</button>
      </div>
      <div>
        <button onClick={retrievePassword}>Retrieve Password</button>
        <p>Retrieved Password: {retrievedPassword}</p>
      </div>
    </div>
  );
}
