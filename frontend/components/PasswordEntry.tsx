"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

const PasswordEntry = () => {
  const [site, setSite] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('image');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You are not logged in. Please log in to continue.',
        variant: 'destructive',
      });
      window.location.href = '/login';
    }
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file.',
        variant: 'destructive',
      });
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      toast({
        title: 'Authentication Error',
        description: 'You are not logged in. Please log in and try again.',
        variant: 'destructive',
      });
      window.location.href = '/login';
      return;
    }

    const formData = new FormData();
    formData.append('site', site);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('type', type);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/passwords/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          toast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive',
          });
          window.location.href = '/login';
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      toast({
        title: 'Success',
        description: data.message,
        variant: 'default',
      });

      // Reset form
      setSite('');
      setUsername('');
      setPassword('');
      setType('image');
      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding the password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Site"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Select onValueChange={(value) => setType(value)} defaultValue="image">
        <SelectTrigger>
          <SelectValue placeholder="Select Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
          <SelectItem value="text">Text</SelectItem>
        </SelectContent>
      </Select>
      <Input type="file" onChange={handleFileChange} required />
      <Button type="submit">Save Password</Button>
    </form>
  );
};

export default PasswordEntry;