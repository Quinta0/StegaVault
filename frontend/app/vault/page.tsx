"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Password {
  id: number;
  site: string;
  username: string;
  type: string;
}

export default function Vault() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/passwords/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPasswords(data);
      } else {
        throw new Error('Failed to fetch passwords');
      }
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const filteredPasswords = passwords.filter(password =>
    password.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    password.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Password Vault</h1>
      <Input
        type="text"
        placeholder="Search passwords..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPasswords.map(password => (
          <Card key={password.id}>
            <CardHeader>
              <CardTitle>{password.site}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Username: {password.username}</p>
              <p>Type: {password.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}