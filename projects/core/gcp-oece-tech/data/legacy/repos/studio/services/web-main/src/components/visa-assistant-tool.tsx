'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

import { getVisaAssistanceAction } from '@/app/actions/get-visa-assistance';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileText, CheckCircle2, AlertCircle, Clock, Lightbulb } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  visaType: z.string().min(2, 'Visa type is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  destination: z.string().min(2, 'Destination is required'),
  purpose: z.string().min(2, 'Purpose is required'),
  duration: z.string().min(1, 'Duration is required'),
  aiMode: z.enum(['quick', 'standard', 'detailed']),
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};

export default function VisaAssistantTool() {
  const [state, formAction] = useFormState(getVisaAssistanceAction, initialState);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visaType: 'Tourist Visa',
      nationality: 'American',
      destination: 'Portugal',
      purpose: 'Tourism',
      duration: '90 days',
      aiMode: 'standard',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 h-full">
        <Card className="sticky top-24 h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline">APPLICATION_DETAILS</CardTitle>
            <CardDescription className="font-mono text-xs">
              // Tell us about your visa
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scrollbar-hide">
            <Form {...form}>
              <form action={formAction} className="space-y-4">
                <FormField
                  control={form.control}
                  name="visaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Visa Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} name="visaType">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Digital Nomad Visa">Digital Nomad Visa</SelectItem>
                          <SelectItem value="Tourist Visa">Tourist Visa</SelectItem>
                          <SelectItem value="Work Visa">Work Visa</SelectItem>
                          <SelectItem value="Student Visa">Student Visa</SelectItem>
                          <SelectItem value="Business Visa">Business Visa</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="visaType" value={field.value} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. American" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Destination Country</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Portugal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Purpose</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Remote work" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 1 year" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aiMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">AI Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quick">⚡ Quick (Fast & Concise)</SelectItem>
                          <SelectItem value="standard">⚙️ Standard (Balanced)</SelectItem>
                          <SelectItem value="detailed">🔥 Detailed (Comprehensive)</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="aiMode" value={field.value} />
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        {field.value === 'quick' && '~10s | Essential info only'}
                        {field.value === 'standard' && '~20s | Balanced guidance'}
                        {field.value === 'detailed' && '~40s | Complete analysis'}
                      </p>
                    </FormItem>
                  )}
                />
                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2 h-full">
        <AssistanceDisplay result={state} />
      </div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-mono" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ANALYZING...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          GET_GUIDANCE
        </>
      )}
    </Button>
  );
}

function AssistanceDisplay({ result }: { result: { data: any; error: string | null } }) {
  if (result.error) {
    return (
      <Card className="h-full flex items-center justify-center flex-col">
        <CardContent className="text-center p-6">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <p className="text-destructive font-mono">ERROR: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.data) {
    return (
      <Card className="h-full flex items-center justify-center flex-col border-dashed">
        <CardContent className="text-center p-6">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium font-headline text-primary">
            Your guidance will appear here
          </h3>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            // Fill out the form to get visa application assistance
          </p>
        </CardContent>
      </Card>
    );
  }

  const { overview, requiredDocuments, applicationSteps, commonMistakes, timeline, importantNotes, digitalNomadTips } = result.data;

  return (
    <div className="space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
      {/* Overview */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            {overview.visaType}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="font-mono">
              <Clock className="inline h-3 w-3 mr-1" />
              {overview.processingTime}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Difficulty: {overview.difficulty}
            </Badge>
            <Badge variant="outline" className="font-mono text-accent">
              Success: {overview.successRate}
            </Badge>
            <Badge variant="outline" className="font-mono">
              Cost: {overview.totalCost}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline text-primary">
            <CheckCircle2 className="inline h-5 w-5 mr-2" />
            REQUIRED_DOCUMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto scrollbar-hide space-y-8">
          {requiredDocuments.map((category: any, idx: number) => (
            <div key={idx}>
              <h4 className="font-semibold font-mono text-sm mb-2 text-accent">
                {category.category}
              </h4>
              <ul className="space-y-2">
                {category.items.map((item: any, itemIdx: number) => (
                  <li key={itemIdx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-muted-foreground text-xs">{item.details}</p>
                      {item.required && (
                        <Badge variant="destructive" className="mt-1 text-xs">Required</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Application Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline text-primary">
            APPLICATION_STEPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applicationSteps.map((step: any, idx: number) => (
              <div key={idx} className="border-l-2 border-accent pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="font-mono">Step {step.step}</Badge>
                  <h4 className="font-semibold">{step.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                <p className="text-xs font-mono text-accent mb-2">
                  ⏱️ {step.estimatedTime}
                </p>
                {step.tips && step.tips.length > 0 && (
                  <ul className="text-xs space-y-1">
                    {step.tips.map((tip: string, tipIdx: number) => (
                      <li key={tipIdx} className="flex items-start gap-1">
                        <span className="text-accent">▸</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg font-headline text-destructive">
            <AlertCircle className="inline h-5 w-5 mr-2" />
            COMMON_MISTAKES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonMistakes.map((mistake: any, idx: number) => (
              <div key={idx} className="text-sm">
                <p className="font-semibold text-destructive">❌ {mistake.mistake}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Consequence: {mistake.consequence}
                </p>
                <p className="text-xs mt-1">
                  <span className="text-accent font-semibold">✓ How to avoid:</span> {mistake.howToAvoid}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline text-primary">
            <Clock className="inline h-5 w-5 mr-2" />
            TIMELINE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Object.entries(timeline).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs font-mono text-muted-foreground capitalize">{key}</p>
                <p className="text-lg font-semibold text-accent">{value as string}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Digital Nomad Tips */}
      {digitalNomadTips && digitalNomadTips.length > 0 && (
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-accent">
              <Lightbulb className="inline h-5 w-5 mr-2" />
              DIGITAL_NOMAD_TIPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {digitalNomadTips.map((tip: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Important Notes */}
      {importantNotes && importantNotes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-headline text-primary">
              IMPORTANT_NOTES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {importantNotes.map((note: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
