import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    // Check auth state on mount
    useEffect(() => {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedAuth));
        }
        setIsInitializing(false);
    }, []);

    const login = (email) => {
        const mockUser = { email, name: email.split('@')[0] };
        setIsAuthenticated(true);
        setUser(mockUser);
        localStorage.setItem('auth', JSON.stringify(mockUser));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('auth');
    };

    if (isInitializing) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
