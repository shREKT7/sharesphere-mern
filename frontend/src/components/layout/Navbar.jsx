import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Moon, Sun, UserCircle } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    const [isDark, setIsDark] = React.useState(false);

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <nav className="fixed top-0 w-full border-b border-border bg-background/80 backdrop-blur z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold tracking-tight text-primary">
                    ShareSphere.
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Link to="/browse">
                        <Button variant="ghost">Browse</Button>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Link to="/add-resource">
                                <Button variant="default">Add Item</Button>
                            </Link>
                            <Button variant="outline" onClick={logout}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="default">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
