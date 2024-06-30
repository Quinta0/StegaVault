"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface Password {
  id: number;
  site: string;
  username: string;
  image_path: string;
}

const PasswordList = () => {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPasswords = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:5000/api/passwords/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPasswords(data);
      } catch (error) {
        console.error('Error fetching passwords:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasswords();
  }, []);

  const handleRetrievePassword = async (id: number) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:5000/api/passwords/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      alert(`Password: ${data.password}`);
    } catch (error) {
      console.error('Error retrieving password:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {passwords.map((password) => (
        <div key={password.id} className="border p-4 rounded-lg shadow">
          <h3 className="text-xl font-bold">{password.site}</h3>
          <p>Username: {password.username}</p>
          <Button onClick={() => handleRetrievePassword(password.id)}>Retrieve Password</Button>
        </div>
      ))}
    </div>
  );
};

export default PasswordList;
