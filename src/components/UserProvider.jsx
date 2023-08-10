import React, { useState } from "react";
import { createContext } from "react";

const userContext = createContext({
  user: null,
  setUser: () => {},
});
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <userContext.Provider value={{ user, setUser }}>
      {children}
    </userContext.Provider>
  );
};

export function useUser() {
  const context = React.useContext(userContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
