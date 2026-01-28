'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Download, Image, Sparkles, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ImageGenerationForm {
  prompt: string;
  style: string;
  size: string;
  quality: string;
}

export default function ImageGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageHistory, setImageHistory] = useState<Array<{
    id: string;
    url: string;
    prompt: string;
    timestamp: string;
    cost: number;
  }>>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ImageGenerationForm>({
    defaultValues: {
      prompt: '',
      style: 'realistic',
      size: '1024x1024',
      quality: 'standard',
    },
  });

  const promptTemplates = [
    'A serene landscape with mountains and a lake at sunset',
    'A futuristic cityscape with flying cars',
    'A magical forest with glowing mushrooms',
    'Abstract art with vibrant colors and geometric shapes',
    'A cozy coffee shop interior with warm lighting',
  ];

  const onSubmit = async (data: ImageGenerationForm) => {
    setIsGenerating(true);
    try {
      // 调用真实的Gemini Imagen 3 API
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: data.prompt,
          userId: 'demo-user',
          style: data.style,
          aspectRatio: data.size === '1024x1024' ? '1:1' : 
                       data.size === '1024x1792' ? '9:16' : 
                       data.size === '1792x1024' ? '16:9' : '1:1',
          negativePrompt: '', // 可以添加负面提示词
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const result = await response.json();
      setGeneratedImage(result.imageUrl);
      
      // Add to history
      setImageHistory(prev => [{
        id: Date.now().toString(),
        url: result.imageUrl,
        prompt: data.prompt,
        timestamp: new Date().toISOString(),
        cost: 0.5,
      }, ...prev].slice(0, 4));

      toast.success('Image generated successfully!');
    } catch {
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      // In production, implement actual download
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'generated-image.png';
      link.click();
      toast.success('Image downloaded!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Image Generation</h2>
        <p className="text-muted-foreground">
          Create stunning images from text descriptions using AI
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Generation Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Image</CardTitle>
              <CardDescription>
                Describe what you want to create and let AI do the magic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Description</Label>
                  <Textarea
                    id="prompt"
                    placeholder="A beautiful sunset over mountains with a lake in the foreground..."
                    className="min-h-[100px]"
                    {...register('prompt', { required: 'Please enter a description' })}
                  />
                  {errors.prompt && (
                    <p className="text-sm text-destructive">{errors.prompt.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="style">Style</Label>
                    <Select
                      value={watch('style')}
                      onValueChange={(value) => setValue('style', value)}
                    >
                      <SelectTrigger id="style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="3d">3D Render</SelectItem>
                        <SelectItem value="oil-painting">Oil Painting</SelectItem>
                        <SelectItem value="watercolor">Watercolor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={watch('size')}
                      onValueChange={(value) => setValue('size', value)}
                    >
                      <SelectTrigger id="size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512x512">512×512</SelectItem>
                        <SelectItem value="1024x1024">1024×1024</SelectItem>
                        <SelectItem value="1024x1792">1024×1792</SelectItem>
                        <SelectItem value="1792x1024">1792×1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality</Label>
                    <Select
                      value={watch('quality')}
                      onValueChange={(value) => setValue('quality', value)}
                    >
                      <SelectTrigger id="quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="hd">HD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Cost: <span className="font-semibold text-foreground">$0.50</span> per image
                  </p>
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
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
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Prompt Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Prompt Inspiration</CardTitle>
              <CardDescription>
                Click on a template to use it as your prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {promptTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => setValue('prompt', template)}
                  className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors text-sm"
                >
                  <Wand2 className="inline-block mr-2 h-4 w-4 text-primary" />
                  {template}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Result and History */}
        <div className="space-y-6">
          {/* Generated Image */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>
                Your AI-generated artwork will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedImage}
                      alt="Generated image result"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Button onClick={handleDownload} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed">
                  <div className="text-center">
                    <Image className="mx-auto h-12 w-12 text-muted-foreground" alt="" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Generated images will appear here
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent History */}
          {imageHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
                <CardDescription>
                  Your recently generated images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {imageHistory.map((item) => (
                    <div
                      key={item.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setGeneratedImage(item.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.prompt}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-xs line-clamp-2">
                          {item.prompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
