'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

import { compareCostOfLiving } from '@/app/actions/compare-cost-of-living';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Scale, BarChart2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  city1: z.string().min(1, 'Please select the first city.'),
  city2: z.string().min(1, 'Please select the second city.'),
}).refine(data => data.city1 !== data.city2, {
  message: 'Cities must be different.',
  path: ['city2'],
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};

const cityOptions = [
    { value: 'Bangkok, Thailand', label: 'bangkok' },
    { value: 'Chiang Mai, Thailand', label: 'chiangMai' },
    { value: 'Kuala Lumpur, Malaysia', label: 'kualaLumpur' },
    { value: 'Hanoi, Vietnam', label: 'hanoi' },
    { value: 'Ho Chi Minh City, Vietnam', label: 'hoChiMinhCity' },
    { value: 'Denpasar, Bali, Indonesia', label: 'bali' },
];

export default function CostOfLivingComparer() {
  const [state, formAction] = useFormState(compareCostOfLiving, initialState);
  const { t } = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city1: 'Bangkok, Thailand',
      city2: 'Chiang Mai, Thailand',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className='font-headline'>{t.costFormTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                action={formAction}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="city1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.city1}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCity} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cityOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{t[opt.label as keyof typeof t]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.city2}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t.selectCity} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                           {cityOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{t[opt.label as keyof typeof t]}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
        <ComparisonDisplay result={state} />
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
            {t.comparing}
          </>
        ) : (
          <>
            <Scale className="mr-2 h-4 w-4" />
            {t.compare}
          </>
        )}
      </Button>
    )
}

function ComparisonDisplay({ result }: { result: typeof initialState }) {
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
                    <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">{t.comparisonPlaceholderTitle}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t.comparisonPlaceholderSubtitle}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const { comparison, summary, city1, city2 } = result.data;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl font-headline text-primary'>{summary.title}</CardTitle>
                    <CardDescription>{summary.details}</CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='font-headline'>Detailed Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Item</TableHead>
                                <TableHead className='text-right'>{city1}</TableHead>
                                <TableHead className='text-right'>{city2}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparison.map((item) => (
                                <TableRow key={item.item}>
                                    <TableCell className="font-medium">{item.item}</TableCell>
                                    <TableCell className="text-right">{item.city1_cost}</TableCell>
                                    <TableCell className="text-right">{item.city2_cost}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
