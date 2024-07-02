"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Password {
  id: number;
  site: string;
  username: string;
  type: string;
  file_path?: string;
  password?: string;
}

export default function Vault() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
      toast({
        title: 'Error',
        description: 'Failed to fetch passwords. Please try again.',
        status: 'error',
      });
    }
  };

  const retrievePassword = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/passwords/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPasswords(prevPasswords => prevPasswords.map(p => p.id === id ? { ...p, password: data.password } : p));
        navigator.clipboard.writeText(data.password).then(() => {
          toast({
            title: 'Password copied to clipboard!',
            description: `Password for ${data.site} has been copied to clipboard.`,
            status: 'success',
          });
        });
      } else {
        throw new Error('Failed to retrieve password');
      }
    } catch (error) {
      console.error('Error retrieving password:', error);
      toast({
        title: 'Error',
        description: 'Failed to retrieve password. Please try again.',
        status: 'error',
      });
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
              {password.file_path && (
                <div className="mt-2">
                  {password.type === 'image' && (
                    <img src={`http://localhost:5000/api/files/${password.file_path}`} alt="Encrypted File" className="max-w-full h-auto" />
                  )}
                  {password.type === 'audio' && (
                    <audio controls>
                      <source src={`http://localhost:5000/api/files/${password.file_path}`} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {password.type === 'text' && (
                    <p>Text file: {password.file_path}</p>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <p>Username: {password.username}</p>
              <p>Type: {password.type}</p>
              <Button onClick={() => retrievePassword(password.id)} className="mt-2">
                Retrieve Password
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}