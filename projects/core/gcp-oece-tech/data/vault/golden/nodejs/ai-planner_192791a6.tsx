'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import React from 'react';
import { useI18n } from '@/lib/i18n-provider';

const formSchema = z.object({
  destination: z.string().min(1, 'Destination is required.'),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 day.').max(30, 'Duration cannot exceed 30 days.'),
  budget: z.enum(['budget', 'mid-range', 'luxury']),
  interests: z.string().min(10, 'Please describe your interests.'),
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};

function parseItinerary(itineraryText: string) {
    const lines = itineraryText.split('\n');
    let title = '';
    let summary = '';
    const itinerary: { day: number; title: string; description: string; activities: string[] }[] = [];
    let currentDay: { day: number; title: string; description: string; activities: string[] } | null = null;
  
    // Simple parsing logic. This could be improved.
    // Assumes a certain structure from the AI.
    let isSummary = true;
    for (const line of lines) {
      if (line.match(/^Day\s*\d+:/i)) {
        isSummary = false;
        if (currentDay) {
          itinerary.push(currentDay);
        }
        const dayMatch = line.match(/^Day\s*(\d+):(.*)/i);
        if (dayMatch) {
            currentDay = { day: parseInt(dayMatch[1]), title: dayMatch[2].trim(), description: '', activities: [] };
        }
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        if (currentDay) {
            currentDay.activities.push(line.substring(2).trim());
        }
      } else if (line.trim() !== '') {
          if (!currentDay) {
              if (!title) title = line.trim();
              else if (isSummary) summary += line.trim() + ' ';
          } else {
              if (!currentDay.description) currentDay.description = line.trim();
          }
      }
    }
  
    if (currentDay) {
      itinerary.push(currentDay);
    }

    if (!title && itinerary.length > 0) {
        title = `Your Trip Itinerary`;
    }
  
    return { title, summary: summary.trim(), itinerary };
}


export default function AiPlanner() {
  const [state, formAction] = useFormState(planTrip, initialState);
  const { t } = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: 'Thailand',
      duration: 7,
      budget: 'mid-range',
      interests: 'I love street food, exploring ancient temples, and finding cool coffee shops to work from. I\'m also interested in hiking and nature.',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className='font-headline'>{t.plannerFormTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                action={formAction}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.destination}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectDestination} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Thailand">{t.thailand}</SelectItem>
                          <SelectItem value="Vietnam">{t.vietnam}</SelectItem>
                          <SelectItem value="Indonesia">{t.indonesia}</SelectItem>
                          <SelectItem value="Malaysia">{t.malaysia}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.duration}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                      <FormLabel>{t.budget}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectBudget} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="budget">{t.budgetFriendly}</SelectItem>
                          <SelectItem value="mid-range">{t.midRange}</SelectItem>
                          <SelectItem value="luxury">{t.luxury}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.interests}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.interestsPlaceholder}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SubmitButton />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <ItineraryDisplay result={state} />
      </div>
    </div>
  );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useI18n();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.generating}
          </>
        ) : (
          <>
            <Wand2 className="mr-2 h-4 w-4" />
            {t.generateItinerary}
          </>
        )}
      </Button>
    )
}

function ItineraryDisplay({ result }: { result: typeof initialState }) {
    const { t } = useI18n();
    if (result.error) {
      return (
        <Card className="h-full flex items-center justify-center">
            <CardContent className='text-center p-6'>
                <p className='text-destructive'>{t.errorOccurred}: {result.error}</p>
            </CardContent>
        </Card>
      )
    }

    if (!result.data) {
        return (
            <Card className="h-full flex items-center justify-center border-dashed">
                <CardContent className='text-center p-6'>
                    <Wand2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">{t.itineraryPlaceholderTitle}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t.itineraryPlaceholderSubtitle}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const parsedData = parseItinerary(result.data.itinerary);


    return (
        <div className="space-y-6">
            <h2 className='text-3xl font-headline text-primary'>{parsedData.title}</h2>
            {parsedData.summary && <p>{parsedData.summary}</p>}
            {parsedData.itinerary.map((day, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className='text-accent font-headline'>Day {day.day}: {day.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {day.description && <p className='text-muted-foreground mb-4'>{day.description}</p>}
                        <ul className="space-y-2">
                            {day.activities.map((activity, i) => (
                                <li key={i} className='flex items-start'>
                                    <span className='text-primary font-bold mr-2'>-</span>
                                    <span>{activity}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
