'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFormState, useFormStatus } from 'react-dom';
import React from 'react';

import { compareVisaAction } from '@/app/actions/compare-visas';
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
import { Loader2, Files, ListChecks } from 'lucide-react';
import { useI18n } from '@/lib/i18n-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  nationality: z.string().min(2, 'Please enter a valid nationality.'),
});

type FormValues = z.infer<typeof formSchema>;

const initialState = {
  data: null,
  error: null,
};


export default function VisaComparer() {
  const [state, formAction] = useFormState(compareVisaAction, initialState);
  const { t } = useI18n();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationality: 'American',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className='font-headline'>{t.visaFormTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                action={formAction}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.nationality}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.nationalityPlaceholder} {...field} />
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
            <Files className="mr-2 h-4 w-4" />
            {t.compareVisas}
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
                    <Files className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">{t.visaPlaceholderTitle}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t.visaPlaceholderSubtitle}
                    </p>
                </CardContent>
            </Card>
        )
    }

    const { introduction, visaOptions } = result.data;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className='text-xl font-headline text-primary'>{t.visaSummaryTitle}</CardTitle>
                    <CardDescription>{introduction}</CardDescription>
                </CardHeader>
            </Card>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {visaOptions.map((option, index) => (
                <Card key={index}>
                  <AccordionItem value={`item-${index}`} className="border-b-0">
                    <AccordionTrigger className="p-6 text-left hover:no-underline">
                        <div className='flex flex-col'>
                            <span className="font-headline text-lg text-accent">{option.country}</span>
                            <span className='text-foreground'>{option.visaName}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">{t.visaKeyFacts}</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {option.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{t.visaSummary}</h4>
                            <p className="text-muted-foreground">{option.summary}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">{t.visaNotes}</h4>
                            <p className="text-muted-foreground">{option.notes}</p>
                          </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Card>
              ))}
            </Accordion>
        </div>
    )
}
