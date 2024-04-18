// my-context.tsx
import React from "react";

// create the context
export const TabsContext = React.createContext<any>(undefined);

// create the context provider, we are using use state to ensure that
// we get reactive values from the context...

export const TabsProvider: React.FC = ({ children }) => {
  // the reactive values
  const [showTabs, setShowTabs] = React.useState(true);

  // the store object
  let state = {
    showTabs,
    setShowTabs,
  };

  // wrap the application in the provider with the initialized context
  return <TabsContext.Provider value={state}>{children}</TabsContext.Provider>;
};

export default TabsContext;
