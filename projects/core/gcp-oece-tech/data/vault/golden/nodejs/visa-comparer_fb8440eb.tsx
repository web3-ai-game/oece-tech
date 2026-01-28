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
// i18n removed
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
  // i18n removed

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationality: 'American',
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
      <div className="lg:col-span-1 h-full">
        <Card className="sticky top-24 h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <CardTitle className='font-headline'>NATIONALITY_INFO</CardTitle>
            <CardDescription className="font-mono text-xs">
              // Tell us your nationality
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto scrollbar-hide">
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
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., American" {...field} />
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
    // i18n removed
    return (
        <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Comparing...
          </>
        ) : (
          <>
            <Files className="mr-2 h-4 w-4" />
            Compare Visas
          </>
        )}
      </Button>
    )
}

function ComparisonDisplay({ result }: { result: { data: any; error: string | null } }) {
    // i18n removed
    if (result.error) {
      return (
        <Card className="h-full flex items-center justify-center">
            <CardContent className='text-center p-6'>
                <p className='text-destructive'>ERROR: {result.error}</p>
            </CardContent>
        </Card>
      )
    }

    if (!result.data) {
        return (
            <Card className="h-full flex items-center justify-center border-dashed">
                <CardContent className='text-center p-6'>
                    <Files className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Visa Comparison</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter your nationality to compare visa options
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
                    <CardTitle className='text-xl font-headline text-primary'>Visa Summary</CardTitle>
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
                            <h4 className="font-semibold mb-2">Key Facts</h4>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                              {option.keyFacts.map((fact, i) => <li key={i}>{fact}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Summary</h4>
                            <p className="text-muted-foreground">{option.summary}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Notes</h4>
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
