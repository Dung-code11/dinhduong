import { createContext,useState,useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        if(email === "test@example.com" && password ==="123456"){
            setUser({email});
            return false;
        }
        return false;
        };
        const logout = () => setUser(null);

        return(
            <AuthContext.Provider value={{ user,login,logout }}>
                {children}
            </AuthContext.Provider>
        );
    };

    export const useAuth = () => useContext(AuthContext);