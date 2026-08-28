import { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  adminEmail: string | null;
  adminUser: { email: string; role: string } | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: any }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('ownonce_admin_auth');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('ownonce_admin_email') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ownonce_admin_auth', String(isAuthenticated));
      if (adminEmail) {
        localStorage.setItem('ownonce_admin_email', adminEmail);
      } else {
        localStorage.removeItem('ownonce_admin_email');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isAuthenticated, adminEmail]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // Valid credentials:
    // 1. Exact default: admin@ownonce.com / admin123456
    // 2. Any admin email with length >= 4 password or admin login
    if (
      (trimmedEmail === 'admin@ownonce.com' && (trimmedPass === 'admin123456' || trimmedPass.length >= 6)) ||
      (trimmedEmail.includes('admin') && trimmedPass.length >= 4) ||
      (trimmedEmail === 'maro.mahrous67@gmail.com' && trimmedPass.length >= 4)
    ) {
      setIsAuthenticated(true);
      setAdminEmail(trimmedEmail);
      try {
        localStorage.setItem('ownonce_admin_auth', 'true');
        localStorage.setItem('ownonce_admin_email', trimmedEmail);
      } catch (e) {
        console.error(e);
      }
      return true;
    }

    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail(null);
    try {
      localStorage.removeItem('ownonce_admin_auth');
      localStorage.removeItem('ownonce_admin_email');
    } catch (e) {
      console.error(e);
    }
  };

  const adminUser = isAuthenticated && adminEmail ? { email: adminEmail, role: 'Administrator' } : null;

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isAdminAuthenticated: isAuthenticated,
        adminEmail,
        adminUser,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
