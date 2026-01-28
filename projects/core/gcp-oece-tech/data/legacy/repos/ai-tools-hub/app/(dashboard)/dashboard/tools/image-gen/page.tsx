'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Download, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          aspectRatio: '16:9' 
        }),
      });

      const data = await res.json();
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        toast.success('Image generated!');
      } else {
        toast.error(data.error || 'Generation failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Image Generator
        </h1>
        <p className="text-muted-foreground">
          Powered by Gemini - Create stunning images from text
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <Textarea
          placeholder="Describe the image you want to create... (e.g., 'A futuristic city at sunset with flying cars')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          className="resize-none"
        />
        
        <Button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Image
            </>
          )}
        </Button>
      </Card>

      {imageUrl && (
        <Card className="p-6 space-y-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt="Generated image"
              fill
              className="object-cover"
            />
          </div>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        </Card>
      )}
    </div>
  );
}
