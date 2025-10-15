1. What is JSX, and why is it used?
 ans:
JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows writing HTML-like code inside JavaScript. JSX makes the code easier to read and write by allowing developers to describe the UI in a familiar way. Under the hood, JSX is transformed into regular JavaScript function calls that React can understand. It improves the development experience by making the structure of the UI more intuitive.

2. What is the difference between State and Props?
ans:
State is a data structure that belongs to a component and can be changed over time. It represents the component’s internal data and determines how the UI looks or behaves.
Props (short for properties) are read-only data passed from a parent component to a child component. Props allow components to be reusable and configurable but cannot be modified by the child component.

3. What is the useState hook, and how does it work?
ans:
The useState hook is a special function in React that allows functional components to have state. It returns an array with two elements: the current state value and a function to update that state. When the state is updated using this function, React automatically re-renders the component to reflect the changes in the UI.

4. How can you share state between components in React?
ans:
State can be shared between components in React by lifting the state up to their closest common parent component. The parent holds the state and passes it down to child components via props. This ensures that multiple components can access and respond to the same piece of data in a controlled way.

5. How is event handling done in React?
ans:
Event handling in React is done using camelCase event handler attributes in JSX, similar to handling events in HTML but with some differences. Functions are used as event handlers, and React automatically handles the binding of this in class components. Event handlers receive a synthetic event object, which normalizes browser differences for consistency.


