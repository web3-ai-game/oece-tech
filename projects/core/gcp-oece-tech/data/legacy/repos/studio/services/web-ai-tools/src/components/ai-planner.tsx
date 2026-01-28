'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';
// i18n removed

import { planTrip } from '@/app/actions/plan-trip';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Plane, MapPin, Calendar, DollarSign, Coffee } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  duration: z.string().min(1, 'Duration is required'),
  budget: z.string().min(1, 'Budget is required'),
  interests: z.string().min(10, 'Please describe your interests'),
  aiMode: z.enum(['quick', 'standard', 'detailed']),
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};

export default function AiPlanner() {
  // i18n removed
  const [state, formAction] = useFormState(planTrip, initialState);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: 'Bangkok',
      duration: '7 days',
      budget: '$2000-3000',
      interests: 'Street food, temples, coworking cafes, nature',
      aiMode: 'standard',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 h-full">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline">Your Travel Plan</CardTitle>
            <CardDescription className="font-mono text-xs">
              // Input your preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scrollbar-hide">
            <Form {...form}>
              <form action={formAction} className="space-y-4">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Destination</FormLabel>
                      <FormControl>
                        <Input placeholder="Bangkok" {...field} />
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
                        <Input placeholder="7 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="$2000-3000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">Interests</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Food, culture, work..."
                          rows={4}
                          className="font-mono text-sm"
                          {...field}
                        />
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
                            <SelectValue placeholder="Select AI Mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quick">Quick Mode</SelectItem>
                          <SelectItem value="standard">Standard Mode</SelectItem>
                          <SelectItem value="detailed">Detailed Mode</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="aiMode" value={field.value} />
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">
                        {field.value === 'quick' && '~10s | Concise results'}
                        {field.value === 'standard' && '~20s | Balanced details'}
                        {field.value === 'detailed' && '~40s | Comprehensive analysis'}
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
        <ItineraryDisplay result={state} />
      </div>
    </div>
  );
}

function SubmitButton() {
  // i18n removed
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-mono" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Plane className="mr-2 h-4 w-4" />
          Generate Plan
        </>
      )}
    </Button>
  );
}

function ItineraryDisplay({ result }: { result: { data: any; error: string | null } }) {
  // i18n removed
  
  if (result.error) {
    return (
      <Card className="h-full flex items-center justify-center flex-col">
        <CardContent className="text-center p-6">
          <p className="text-destructive font-mono">ERROR: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.data) {
    return (
      <Card className="h-full flex items-center justify-center flex-col border-dashed">
        <CardContent className="text-center p-6">
          <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium font-headline text-primary">
            Your itinerary will appear here
          </h3>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            // Fill out the form to generate your AI trip plan
          </p>
        </CardContent>
      </Card>
    );
  }

  // Display result
  const { overview, dailyItinerary, budgetBreakdown, tips } = result.data;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">
            <MapPin className="inline h-6 w-6 mr-2" />
            {overview.destination}
          </CardTitle>
          <CardDescription className="font-mono text-sm">
            <Calendar className="inline h-4 w-4 mr-1" />
            {overview.totalDays} days · {overview.estimatedBudget}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{overview.summary}</p>
          <p className="text-xs text-muted-foreground mt-2 font-mono">
            Best time: {overview.bestTimeToVisit}
          </p>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-4">
        <h3 className="text-xl font-headline text-primary">DAILY_ITINERARY</h3>
        {dailyItinerary.map((day: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg font-headline text-accent">
                Day {day.day}: {day.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">Morning</p>
                <ul className="space-y-1 text-sm">
                  {day.morning.activities.map((act: string, i: number) => (
                    <li key={i}>• {act}</li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-accent mt-1">{day.morning.cost}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">Afternoon</p>
                <ul className="space-y-1 text-sm">
                  {day.afternoon.activities.map((act: string, i: number) => (
                    <li key={i}>• {act}</li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-accent mt-1">{day.afternoon.cost}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-muted-foreground mb-2">Evening</p>
                <ul className="space-y-1 text-sm">
                  {day.evening.activities.map((act: string, i: number) => (
                    <li key={i}>• {act}</li>
                  ))}
                </ul>
                <p className="text-xs font-mono text-accent mt-1">{day.evening.cost}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-sm font-semibold">
                  <DollarSign className="inline h-4 w-4" />
                  Total: {day.totalDayCost}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-headline text-primary">
            BUDGET_BREAKDOWN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.entries(budgetBreakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono capitalize">{key}:</span>
                <span className="font-semibold">{value as string}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      {tips && tips.length > 0 && (
        <Card className="bg-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline text-accent">
              <Coffee className="inline h-5 w-5 mr-2" />
              TRAVEL_TIPS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {tips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
