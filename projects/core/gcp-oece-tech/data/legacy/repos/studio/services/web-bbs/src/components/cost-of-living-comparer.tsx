'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

import { analyzeCostOfLivingAction } from '@/app/actions/analyze-cost-of-living';
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
import { Loader2, DollarSign, TrendingUp, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  city1: z.string().min(2, 'Please enter a valid city name'),
  city2: z.string().min(2, 'Please enter a valid city name'),
  city3: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};

export default function CostOfLivingComparer() {
  const [state, formAction] = useFormState(analyzeCostOfLivingAction, initialState);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city1: 'Bangkok',
      city2: 'Lisbon',
      city3: 'Bali',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 h-full">
        <Card className="sticky top-24 h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="font-headline">COMPARE_CITIES</CardTitle>
            <CardDescription className="font-mono text-xs">
              // Enter 2-3 cities to analyze
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scrollbar-hide">
            <Form {...form}>
              <form action={formAction} className="space-y-4">
                <FormField
                  control={form.control}
                  name="city1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">City 1</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bangkok" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">City 2</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Lisbon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono">City 3 (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bali" {...field} />
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
      <div className="lg:col-span-2 h-full">
        <ComparisonDisplay result={state} />
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
          <TrendingUp className="mr-2 h-4 w-4" />
          ANALYZE_COSTS
        </>
      )}
    </Button>
  );
}

function ComparisonDisplay({ result }: { result: { data: any; error: string | null } }) {
  if (result.error) {
    return (
      <Card className="h-full flex items-center justify-center flex-col">
        <CardContent className="text-center p-6">
          <p className="text-destructive">Error: {result.error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result.data) {
    return (
      <Card className="h-full flex items-center justify-center flex-col border-dashed">
        <CardContent className="text-center p-6">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium font-headline text-primary">
            COST_ANALYSIS
          </h3>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            // Enter cities to compare living costs
          </p>
        </CardContent>
      </Card>
    );
  }

  const { summary, cities, recommendations } = result.data;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-headline text-primary">
            ANALYSIS_SUMMARY
          </CardTitle>
          <CardDescription>{summary}</CardDescription>
        </CardHeader>
      </Card>

      {/* Recommendations */}
      <Card className="bg-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg font-headline text-accent flex items-center gap-2">
            <Award className="h-5 w-5" />
            RECOMMENDATIONS
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto scrollbar-hide space-y-6">
          <div>
            <p className="text-xs font-mono text-muted-foreground">Best Value</p>
            <p className="text-sm font-semibold">{recommendations.bestValue}</p>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground">Best Quality</p>
            <p className="text-sm font-semibold">{recommendations.bestQuality}</p>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground">Best for Remote Work</p>
            <p className="text-sm font-semibold">{recommendations.bestForRemoteWork}</p>
          </div>
        </CardContent>
      </Card>

      {/* City Comparisons */}
      <div className="grid grid-cols-1 gap-6">
        {cities.map((city, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-headline text-primary">
                    {city.name}
                  </CardTitle>
                  <CardDescription className="font-mono">{city.country}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground">Digital Nomad Score</p>
                  <p className="text-3xl font-bold text-accent">{city.digitalNomadScore}/10</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Budget Ranges */}
              <div>
                <h4 className="font-semibold font-mono text-sm mb-3">MONTHLY_BUDGET</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground font-mono">Budget</p>
                    <p className="font-semibold">${city.budgetRanges.budget}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-accent/10">
                    <p className="text-xs text-muted-foreground font-mono">Comfortable</p>
                    <p className="font-semibold text-accent">${city.budgetRanges.comfortable}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground font-mono">Luxury</p>
                    <p className="font-semibold">${city.budgetRanges.luxury}</p>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div>
                <h4 className="font-semibold font-mono text-sm mb-3">COST_BREAKDOWN</h4>
                <div className="space-y-3">
                  {Object.entries(city.costBreakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-mono capitalize">{key}</span>
                        <span className="font-semibold">${value.amount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality of Life */}
              <div>
                <h4 className="font-semibold font-mono text-sm mb-3">QUALITY_OF_LIFE</h4>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono">Infrastructure</span>
                      <span>{city.qualityOfLife.infrastructure}/10</span>
                    </div>
                    <Progress value={city.qualityOfLife.infrastructure * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono">Safety</span>
                      <span>{city.qualityOfLife.safety}/10</span>
                    </div>
                    <Progress value={city.qualityOfLife.safety * 10} />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-mono">Healthcare</span>
                      <span>{city.qualityOfLife.healthcare}/10</span>
                    </div>
                    <Progress value={city.qualityOfLife.healthcare * 10} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground font-mono">Internet</p>
                      <p className="text-sm">{city.qualityOfLife.internetSpeed}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-mono">Climate</p>
                      <p className="text-sm">{city.qualityOfLife.climate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="font-semibold font-mono text-sm mb-2">HIGHLIGHTS</h4>
                <ul className="space-y-1">
                  {city.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-accent">▸</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arbitrage Opportunity */}
              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-semibold font-mono text-sm mb-2 text-accent">
                  ARBITRAGE_OPPORTUNITY
                </h4>
                <p className="text-sm text-foreground/90">{city.arbitrageOpportunity}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
