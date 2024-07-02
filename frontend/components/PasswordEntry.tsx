"use client";
import { useState, ChangeEvent, FormEvent, useEffect, DragEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have this component from shadcn/ui

const PasswordEntry = () => {
  const [site, setSite] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [type, setType] = useState<string>('image');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      createPreview(selectedFile);
    }
  };

  const createPreview = (selectedFile: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      createPreview(selectedFile);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
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
      setPreview(null);
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
    <div className="space-y-4">
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
        <div className="grid grid-cols-2 gap-4">
          <div
            className="border border-dashed border-gray-300 p-4 flex justify-center items-center"
            style={{ aspectRatio: '1 / 1' }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="text-center">
              <input type="file" onChange={handleFileChange} className="hidden" />
              <p className="text-sm text-gray-500">Drag and drop file here</p>
            </div>
          </div>
          <Card>
            <CardContent className="p-4 flex justify-center items-center" style={{ aspectRatio: '1 / 1' }}>
              {preview ? (
                <>
                  {type === 'image' && <img src={preview} alt="Preview" className="max-w-full h-auto" />}
                  {type === 'audio' && <audio src={preview} controls />}
                  {type === 'text' && <p>Text file selected</p>}
                </>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="items-center">Save Password</Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordEntry;
