import { createContext, useContext, useState, ReactNode, FC } from 'react';

interface AuthContextType {
  phoneNum: string;
  setPhoneNum: (phoneNum: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [phoneNum, setPhoneNum] = useState<string>('');

  return (
    <AuthContext.Provider value={{ phoneNum, setPhoneNum }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
