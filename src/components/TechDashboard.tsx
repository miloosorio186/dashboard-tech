
'use client';

import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Package,
    Activity,
    Settings,
    Bell,
    Search,
    Command,
    ChevronRight,
    Cpu,
    Database,
    Globe,
    Shield,
    Terminal,
    ShoppingCart
} from 'lucide-react';
import { dataService, User, Product, Cart, Post } from '../services/dataService';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function TechDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [recentSales, setRecentSales] = useState<Cart[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersData, productsData, cartsData] = await Promise.all([
                    dataService.getUsers(),
                    dataService.getProducts(),
                    dataService.getCarts()
                ]);
                setUsers(usersData);
                setProducts(productsData);
                setRecentSales(cartsData);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-medium text-muted-foreground animate-pulse">Initializing System...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">

            {/* Sidebar Navigation */}
            <aside className="w-72 border-r bg-card/30 hidden md:flex flex-col fixed h-full z-10 backdrop-blur-sm">
                <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 border border-primary/20 flex items-center justify-center rounded-lg text-primary">
                            <Command className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight block">Nexus_OS</span>
                            <span className="text-[10px] text-muted-foreground font-mono">v2.4.0-stable</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Platform</h4>
                        {[
                            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                            { id: 'analytics', icon: Activity, label: 'Analytics' },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={`w-full justify-start mb-1 ${activeTab === item.id ? "bg-secondary" : ""}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Management</h4>
                        {[
                            { id: 'users', icon: Users, label: 'Agents' },
                            { id: 'inventory', icon: Package, label: 'Inventory' },
                            { id: 'transactions', icon: ShoppingCart, label: 'Transactions' },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={`w-full justify-start mb-1 ${activeTab === item.id ? "bg-secondary" : ""}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className="mr-3 h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@control.online</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen transition-all duration-300">

                {/* Top Header */}
                <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search system resources..."
                                className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="outline" className="gap-1.5 py-1.5 hidden sm:flex">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="font-mono text-xs">ONLINE</span>
                        </Badge>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Bell className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">

                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                            <p className="text-muted-foreground mt-1">Real-time system metrics and platform analysis.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="hidden sm:flex">
                                <Terminal className="mr-2 h-4 w-4" />
                                View Logs
                            </Button>
                            <Button size="sm">
                                <ChevronRight className="mr-2 h-4 w-4" />
                                Generate Report
                            </Button>
                        </div>
                    </div>

                    {/* KPI Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{users.length}</div>
                                <p className="text-xs text-muted-foreground mt-1 text-green-500 font-medium flex items-center">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Inventory</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{products.length}</div>
                                <p className="text-xs text-muted-foreground mt-1 text-blue-500 font-medium">
                                    +15 new items added
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">System Load</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24%</div>
                                <div className="w-full bg-secondary h-1.5 mt-3 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full w-[24%]"></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Network Status</CardTitle>
                                <Shield className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Secure</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    0 threats detected
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                        {/* Feed / Activity */}
                        <div className="xl:col-span-2 space-y-8">
                            <Card className="col-span-1">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Transactions</CardTitle>
                                        <CardDescription>Live financial data stream from client carts.</CardDescription>
                                    </div>
                                    <Badge variant="secondary">Live</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {recentSales.map((cart) => (
                                            <div key={cart.id} className="flex items-center justify-between group">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-secondary/50 text-xs font-bold text-muted-foreground">
                                                        #{cart.id}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Order Transaction</p>
                                                        <p className="text-xs text-muted-foreground">User ID: {cart.userId} • {cart.totalProducts} items</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono font-bold">${cart.discountedTotal}</div>
                                                    <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1.5">Completed</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                                <Card className="col-span-4">
                                    <CardHeader>
                                        <CardTitle>Inventory Highlights</CardTitle>
                                        <CardDescription>Top performing products this quarter</CardDescription>
                                    </CardHeader>
                                    <CardContent className="pl-2">
                                        {/* Simplified Chart Placeholder or Product List */}
                                        <div className="space-y-4 px-4">
                                            {products.slice(0, 3).map(product => (
                                                <div key={product.id} className="flex items-center gap-4 border p-3 rounded-lg bg-card/50 hover:bg-muted/50 transition-colors">
                                                    <div className="h-12 w-12 rounded-md overflow-hidden bg-background border">
                                                        <img src={product.thumbnail} alt="" className="h-full w-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-semibold truncate">{product.title}</h4>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="text-[10px] font-normal">{product.category}</Badge>
                                                            <span className="text-xs text-muted-foreground">★ {product.rating}</span>
                                                        </div>
                                                    </div>
                                                    <div className="font-mono font-medium text-sm">
                                                        ${product.price}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Side Panel / Users */}
                        <div className="xl:col-span-1">
                            <Card className="h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle>Active Agents</CardTitle>
                                    <CardDescription>
                                        {users.length} active users on the network currently.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto pr-2">
                                    <div className="space-y-4">
                                        {users.map(user => (
                                            <div key={user.id} className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded-md transition-colors -mx-2">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                            <img className="aspect-square h-full w-full" src={user.image} alt={user.firstName} />
                                                        </span>
                                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background bg-green-500" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.company.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline">View All Agents</Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
