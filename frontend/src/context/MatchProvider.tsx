import React from "react";
const MatchContext = React.createContext({});
export function useMatchContext() {
  return React.useContext(MatchContext);
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [User, SetUser] = React.useState(() => {
    return {};
  });
  return (
    <MatchContext.Provider value={{ User, SetUser }}>
      {children}
    </MatchContext.Provider>
  );
}
