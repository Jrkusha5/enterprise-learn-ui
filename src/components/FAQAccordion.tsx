import React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  value: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

interface FAQAccordionProps {
  items: FAQItem[];
  defaultValue?: string;
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items, defaultValue }) => {
  return (
    <AccordionPrimitive.Root
      type="single"
      collapsible
      defaultValue={defaultValue}
      className="w-full"
    >
      {items.map((item) => (
        <AccordionPrimitive.Item
          key={item.value}
          value={item.value}
          className="border-b border-gray-800"
        >
          <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
              className={cn(
                "group flex flex-1 items-center justify-between gap-4 py-6 text-left transition-all outline-none",
                "focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900"
              )}
            >
              <span
                className={cn(
                  "flex-1 text-lg font-semibold transition-colors",
                  "group-data-[state=open]:text-green-400 group-data-[state=open]:hover:text-green-300",
                  "group-data-[state=closed]:text-white group-data-[state=closed]:hover:text-gray-300"
                )}
              >
                {item.question}
              </span>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0 ml-4">
                <Plus className="w-4 h-4 text-white group-data-[state=open]:hidden" />
                <Minus className="w-4 h-4 text-white hidden group-data-[state=open]:block" />
              </div>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="text-gray-400 pb-6 text-base leading-relaxed">
              {item.answer}
            </div>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
};
