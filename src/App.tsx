import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';

const App = () => {
  return (
    <div>
      <h1>Welcome to the Accordion App</h1>
      <Accordion>
        <AccordionItem>
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>This is the content for item 1.</AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>This is the content for item 2.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default App;
