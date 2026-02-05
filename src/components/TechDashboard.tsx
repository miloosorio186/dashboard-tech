'use client';

import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingCart,
    Package,
    Activity,
    Settings,
    Bell,
    Search,
    Menu,
    ChevronRight,
    Terminal,
    Cpu,
    HardDrive,
    Wifi,
    Battery,
    Zap,
    RefreshCw,
    Download,
    Filter,
    Plus,
    LogOut,
    Command
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLenis } from 'lenis/react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { dataService, User, Product, Cart } from '../services/dataService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

export default function TechDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [recentSales, setRecentSales] = useState<Cart[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useLenis(({ scroll }) => {
        // Scroll logic if needed
    });

    // Reset scroll when tab changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [activeTab]);

    const refreshData = async () => {
        setRefreshing(true);
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
            console.error("Failed to refresh data", error);
        } finally {
            setTimeout(() => setRefreshing(false), 800); // Artificial delay to show animation
        }
    };

    const handleExport = (type: 'inventory' | 'transactions' | 'analytics') => {
        const dateStr = new Date().toISOString().split('T')[0];

        if (type === 'inventory') {
            // Export as Excel
            const worksheet = XLSX.utils.json_to_sheet(products);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(data, `inventory_export_${dateStr}.xlsx`);
        } else if (type === 'transactions') {
            // Export as TXT
            const content = recentSales.map(sale =>
                `Order #${sale.id} | User: ${sale.userId} | Items: ${sale.totalProducts} | Total: $${sale.discountedTotal}`
            ).join('\n');
            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            saveAs(blob, `transactions_log_${dateStr}.txt`);
        } else if (type === 'analytics') {
            // Export Analytics Summary as Excel
            const wb = XLSX.utils.book_new();

            // Sales Data Sheet
            const salesWS = XLSX.utils.json_to_sheet(recentSales.map(s => ({
                ID: s.id,
                Total: s.total,
                Discounted: s.discountedTotal,
                Items: s.totalProducts
            })));
            XLSX.utils.book_append_sheet(wb, salesWS, "Sales Data");

            // Product Categories Sheet
            const categoryCounts = products.reduce((acc, product) => {
                acc[product.category] = (acc[product.category] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
            const catData = Object.entries(categoryCounts).map(([cat, count]) => ({ Category: cat, Count: count }));
            const catWS = XLSX.utils.json_to_sheet(catData);
            XLSX.utils.book_append_sheet(wb, catWS, "Categories");

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(data, `analytics_report_${dateStr}.xlsx`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine greeting based on time
                const hour = new Date().getHours();
                let greeting = "Good morning";
                if (hour >= 12 && hour < 17) greeting = "Good afternoon";
                else if (hour >= 17) greeting = "Good evening";

                // Fetch initial data
                const [usersData, productsData, cartsData] = await Promise.all([
                    dataService.getUsers(),
                    dataService.getProducts(),
                    dataService.getCarts()
                ]);

                setUsers(usersData);
                setProducts(productsData);
                setRecentSales(cartsData);
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = users.filter(u =>
        u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.company.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredSales = recentSales.filter(s =>
        s.id.toString().includes(searchQuery)
    );

    // Animation Variants
    const pageVariants: Variants = {
        initial: {
            opacity: 0,
            scale: 0.92,
            filter: 'blur(10px)'
        },
        animate: {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.8,
                staggerChildren: 0.05
            }
        },
        exit: {
            opacity: 0,
            x: 100,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const itemVariants: Variants = {
        initial: { opacity: 0, scale: 0.8, y: 10 },
        animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 350 } }
    };

    // Render Content Switch
    const renderContent = () => {
        // Data processing for Analytics
        const salesData = recentSales.slice(0, 10).map(cart => ({
            name: `Ord #${cart.id}`,
            regular: cart.total,
            discounted: cart.discountedTotal
        }));

        const categoryCounts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const categoryData = Object.entries(categoryCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        switch (activeTab) {
            case 'analytics':
                return (
                    <motion.div
                        key="analytics"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">System Analytics</h2>
                                <p className="text-muted-foreground">Deep dive into platform metrics and performance.</p>
                            </div>
                            <Button variant="outline" onClick={() => handleExport('analytics')}><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="col-span-1 shadow-md">
                                <CardHeader>
                                    <CardTitle>Revenue Trends</CardTitle>
                                    <CardDescription>Comparison of Regular vs Discounted Revenue (Last 10 Orders)</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRegular" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorDiscounted" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ fontSize: '12px' }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Area type="monotone" dataKey="regular" stroke="#8884d8" fillOpacity={1} fill="url(#colorRegular)" name="Regular Total" />
                                            <Area type="monotone" dataKey="discounted" stroke="#82ca9d" fillOpacity={1} fill="url(#colorDiscounted)" name="Discounted Total" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="col-span-1 shadow-md">
                                <CardHeader>
                                    <CardTitle>Inventory Distribution</CardTitle>
                                    <CardDescription>Top 5 Product Categories by Volume</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis dataKey="name" type="category" width={100} fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'transparent' }}
                                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={32} name="Product Count" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="col-span-1 lg:col-span-3 shadow-md">
                                <CardHeader>
                                    <CardTitle>Performance Metrics</CardTitle>
                                    <CardDescription>System response times and load averages (Simulated)</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={[
                                            { time: '00:00', load: 24, response: 120 },
                                            { time: '04:00', load: 15, response: 90 },
                                            { time: '08:00', load: 45, response: 240 },
                                            { time: '12:00', load: 78, response: 450 },
                                            { time: '16:00', load: 65, response: 320 },
                                            { time: '20:00', load: 40, response: 180 },
                                            { time: '23:59', load: 28, response: 140 },
                                        ]}>
                                            <defs>
                                                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
                                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                            <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                            <Area type="natural" dataKey="load" stroke="#f59e0b" fill="url(#colorLoad)" name="System Load %" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                );
            case 'users':
                return (
                    <motion.div
                        key="users"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Agent Management</h2>
                                <p className="text-muted-foreground">Manage authorized personnel and access levels.</p>
                            </div>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Agent
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user, index) => (
                                <motion.div
                                    key={user.id}
                                    variants={itemVariants}
                                >
                                    <Card className="hover:shadow-md transition-all h-full">
                                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                            <div className="h-12 w-12 rounded-full overflow-hidden bg-secondary">
                                                <img src={user.image} alt={user.firstName} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{user.firstName} {user.lastName}</CardTitle>
                                                <CardDescription className="text-xs">{user.company.title}</CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span>Department</span>
                                                    <span className="font-medium text-foreground">{user.company.department}</span>
                                                </div>
                                                <div className="flex justify-between pt-1">
                                                    <span>Status</span>
                                                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button variant="outline" className="w-full text-xs h-8">View Profile</Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'inventory':
                return (
                    <motion.div
                        key="inventory"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">System Inventory</h2>
                                <p className="text-muted-foreground">Hardware and software asset tracking.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                                <Button onClick={() => handleExport('inventory')}><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
                            </div>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            variants={itemVariants}
                                            className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="h-16 w-16 rounded bg-secondary flex-shrink-0 overflow-hidden border">
                                                <img src={product.thumbnail} alt={product.title} className="h-full w-full object-cover" />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h3 className="font-medium">{product.title}</h3>
                                                <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                                            </div>
                                            <div className="text-right mr-6">
                                                <div className="font-bold">${product.price}</div>
                                                <div className="text-xs text-muted-foreground">{product.stock} in stock</div>
                                            </div>
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            case 'transactions':
                return (
                    <motion.div
                        key="transactions"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Transaction Logs</h2>
                                <p className="text-muted-foreground">Real-time purchase and acquisition data.</p>
                            </div>
                            <Button variant="outline" onClick={() => handleExport('transactions')}>
                                <Download className="mr-2 h-4 w-4" /> Export Log
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <div className="p-4 bg-muted/30 border-b font-medium grid grid-cols-12 text-sm text-muted-foreground">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-3">User ID</div>
                                <div className="col-span-2">Items</div>
                                <div className="col-span-2">Total Amount</div>
                                <div className="col-span-2">Discounted</div>
                                <div className="col-span-2 text-right">Action</div>
                            </div>
                            <div className="divide-y">
                                {filteredSales.map((cart, index) => (
                                    <motion.div
                                        key={cart.id}
                                        variants={itemVariants}
                                        className="p-4 grid grid-cols-12 text-sm items-center hover:bg-muted/20"
                                    >
                                        <div className="col-span-1 font-mono">#{cart.id}</div>
                                        <div className="col-span-3 flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs">
                                                {cart.userId}
                                            </div>
                                            <span className="text-muted-foreground">User {cart.userId}</span>
                                        </div>
                                        <div className="col-span-2">{cart.totalProducts} items</div>
                                        <div className="col-span-2 text-muted-foreground line-through">${cart.total}</div>
                                        <div className="col-span-2 font-bold text-green-600">${cart.discountedTotal}</div>
                                        <div className="col-span-2 text-right">
                                            <Button variant="ghost" size="sm" className="h-8">Details</Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );
            case 'settings':
                return (
                    <motion.div
                        key="settings"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
                                <p className="text-muted-foreground">Configure global preferences and system parameters.</p>
                            </div>
                        </div>
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Configuration</CardTitle>
                                    <CardDescription>System-wide settings and preferences.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Dark Mode</div>
                                            <div className="text-sm text-muted-foreground">Enable system-wide dark appearance (Disabled by Policy)</div>
                                        </div>
                                        <Button variant="outline" disabled>Disabled</Button>
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <div className="font-medium">Data Refresh Rate</div>
                                            <div className="text-sm text-muted-foreground">Interval for fetching new data.</div>
                                        </div>
                                        <Button variant="outline">5 Minutes</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                );
            case 'notifications':
                return (
                    <motion.div
                        key="notifications"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                                <p className="text-muted-foreground">System alerts and messages.</p>
                            </div>
                            <Button variant="outline">Mark all as read</Button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <CardContent className="p-4 flex items-start gap-4">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                            <Bell className="h-4 w-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">System Update Available</p>
                                            <p className="text-xs text-muted-foreground">A new patch v2.4.1 is ready for installation. Schedule a restart.</p>
                                            <p className="text-[10px] text-muted-foreground pt-1">2 hours ago</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                );
            case 'overview':
            default:
                return (
                    <motion.div
                        key="overview"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                                <p className="text-muted-foreground mt-1">Real-time system metrics and platform analysis.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => alert("System logs downloaded!")}>
                                    <Terminal className="mr-2 h-4 w-4" />
                                    View Logs
                                </Button>
                                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                                <Button onClick={() => handleExport('inventory')}><Download className="mr-2 h-4 w-4" /> Export Excel</Button>
                            </div>
                        </div>

                        {/* KPI Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setActiveTab('users')}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{users.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1 text-green-600 font-medium flex items-center">
                                        +20.1% from last month
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setActiveTab('inventory')}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Inventory</CardTitle>
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{products.length}</div>
                                    <p className="text-xs text-muted-foreground mt-1 text-blue-600 font-medium">
                                        +15 new items added
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:border-primary/50 transition-colors shadow-sm">
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

                            <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setActiveTab('transactions')}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">${recentSales.reduce((acc, curr) => acc + curr.discountedTotal, 0).toFixed(2)}</div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Across {recentSales.length} active carts
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Transactions & Highlights */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            <Card className="xl:col-span-2 shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Recent Transactions</CardTitle>
                                        <CardDescription>Live financial data stream from client carts.</CardDescription>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>View All</Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {filteredSales.slice(0, 4).map((cart, index) => (
                                            <motion.div
                                                key={cart.id}
                                                variants={itemVariants}
                                                className="flex items-center justify-between group hover:bg-muted/30 p-2 rounded-lg transition-colors -mx-2"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-secondary text-xs font-bold text-muted-foreground">
                                                        #{cart.id}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">Order Transaction</p>
                                                        <p className="text-xs text-muted-foreground">User ID: {cart.userId} • {cart.totalProducts} items</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono font-bold">${cart.discountedTotal}</div>
                                                    <Badge variant="outline" className="mt-1 text-[10px] h-5 px-1.5 border-green-200 text-green-700 bg-green-50">Completed</Badge>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="xl:col-span-1 shadow-sm h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle>Active Agents</CardTitle>
                                    <CardDescription>
                                        {users.length} active users on the network currently.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
                                    <div className="space-y-4">
                                        {filteredUsers.map((user, index) => (
                                            <motion.div
                                                key={user.id}
                                                variants={itemVariants}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/30 p-2 rounded-md transition-colors -mx-2"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border">
                                                            <img className="aspect-square h-full w-full" src={user.image} alt={user.firstName} />
                                                        </span>
                                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background bg-green-500" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.company.title}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant="outline" onClick={() => setActiveTab('users')}>View All Agents</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </motion.div>
                );
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <div className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Nexus_OS...</div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans">

            {/* Sidebar Navigation */}
            <aside className={`w-72 border-r bg-card hidden md:flex flex-col fixed h-full z-10 transition-all duration-300`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg text-primary-foreground shadow-sm">
                            <Command className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="font-bold text-lg tracking-tight block">Nexus_OS</span>
                            <span className="text-[10px] text-muted-foreground font-mono">v2.4.0-stable</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Platform</h4>
                        <div className="space-y-1">
                            {[
                                { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
                                { id: 'analytics', icon: Activity, label: 'Analytics' },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? "secondary" : "ghost"}
                                    className={`w-full justify-start font-normal ${activeTab === item.id ? "bg-secondary font-medium" : ""}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Management</h4>
                        <div className="space-y-1">
                            {[
                                { id: 'users', icon: Users, label: 'Agents' },
                                { id: 'inventory', icon: Package, label: 'Inventory' },
                                { id: 'transactions', icon: ShoppingCart, label: 'Transactions' },
                                { id: 'notifications', icon: Bell, label: 'Notifications' },
                                { id: 'settings', icon: Settings, label: 'Settings' },
                            ].map((item) => (
                                <Button
                                    key={item.id}
                                    variant={activeTab === item.id ? "secondary" : "ghost"}
                                    className={`w-full justify-start font-normal ${activeTab === item.id ? "bg-secondary font-medium" : ""}`}
                                    onClick={() => setActiveTab(item.id)}
                                >
                                    <item.icon className="mr-3 h-4 w-4" />
                                    {item.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white text-xs font-bold border-2 border-background shadow-sm">
                            AD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@control.online</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto text-muted-foreground hover:text-foreground">
                            <LogOut className="h-4 w-4" onClick={() => window.location.reload()} />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen transition-all duration-300 bg-muted/10">

                {/* Top Header */}
                <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-primary"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className={`gap-2 ${refreshing ? 'opacity-70 cursor-wait' : ''}`}
                            onClick={refreshData}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <Button variant="ghost" size="icon" className="text-muted-foreground relative" onClick={() => setActiveTab('notifications')}>
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-background"></span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setActiveTab('settings')}>
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="p-8 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
                    <AnimatePresence mode="wait">
                        {renderContent()}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
