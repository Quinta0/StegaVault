"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const PasswordEntry = () => {
  const [site, setSite] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('image');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const formData = new FormData();
    formData.append('site', site);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('type', type);
    formData.append('file', file);

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:5000/api/passwords/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        toast({
            title: 'Success',
            description: data.message,
            status: 'success',
        });

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
            status: 'error',
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
      />
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
      <Input type="file" onChange={handleFileChange} />
      <Button type="submit">Save Password</Button>
    </form>
  );
};

export default PasswordEntry;
