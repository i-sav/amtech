import React, { createContext } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext<any>(undefined);

export const AuthProvider = (props: any) => {
  const currentUser = localStorage.getItem("AM-Tkn");
  if (currentUser === "" || currentUser === null) {
    return (
      <AuthContext.Provider value={[]}>{props.children}</AuthContext.Provider>
    );
  } else {
    const decodedUser = jwt_decode(JSON.stringify(currentUser));
    //setting user state to the decoded user

    return (
      <AuthContext.Provider value={decodedUser}>
        {props.children}
      </AuthContext.Provider>
    );
  }
};
