/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Wallet, 
  ShoppingBag, 
  HelpCircle, 
  Moon, 
  Sun, 
  Plus, 
  Send, 
  Copy, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Settings,
  Users,
  Database,
  Check,
  X,
  Edit,
  Trash2,
  Bell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserProfile, Order, Transaction, ServiceItem } from './types';
import { supabase } from './supabase';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Data
// Moved to state inside App component for admin editability

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'wallet' | 'order' | 'help'>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [tgUsernameInput, setTgUsernameInput] = useState('');
  const [subPage, setSubPage] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddFund, setShowAddFund] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [paymentStep, setPaymentStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [trxId, setTrxId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // User Management
  const [allUsers, setAllUsers] = useState<UserProfile[]>([
    { telegramUsername: '@Devoloper_Emon', displayName: 'Developer Emon', photoUrl: 'https://ui-avatars.com/api/?name=Emon&background=random', balance: 1000 },
    { telegramUsername: '@user1', displayName: 'User One', photoUrl: 'https://ui-avatars.com/api/?name=U1&background=random', balance: 500 },
    { telegramUsername: '@user2', displayName: 'User Two', photoUrl: 'https://ui-avatars.com/api/?name=U2&background=random', balance: 200 },
  ]);

  // App Settings & Data (Editable by Admin)
  const [appNotice, setAppNotice] = useState('ঈদ ধামাকা অফার! সব সার্ভিসে ২০% পর্যন্ত ডিসকাউন্ট।');
  const [developerName, setDeveloperName] = useState('Developer Emon');
  const [developerTelegram, setDeveloperTelegram] = useState('@Devoloper_Emon');
  const [developerPhone, setDeveloperPhone] = useState('+880123456789');
  const [telegramChannel, setTelegramChannel] = useState('https://t.me/your_admin_id');

  const [vpnServices, setVpnServices] = useState<ServiceItem[]>([
    { id: 'vpn-1', name: 'Nord VPN', price: 500, category: 'vpn', image: 'https://picsum.photos/seed/nord/100/100', isAvailable: true },
    { id: 'vpn-2', name: 'Express VPN', price: 700, category: 'vpn', image: 'https://picsum.photos/seed/express/100/100', isAvailable: true },
    { id: 'vpn-3', name: 'Super VPN', price: 300, category: 'vpn', image: 'https://picsum.photos/seed/super/100/100', isAvailable: false },
  ]);

  const [fbServices, setFbServices] = useState<ServiceItem[]>([
    { id: 'fb-1', name: '1000xxxxx ID', price: 150, category: 'facebook', isAvailable: true },
    { id: 'fb-2', name: '615xxxxxx ID', price: 200, category: 'facebook', isAvailable: true },
  ]);

  const [igServices, setIgServices] = useState<ServiceItem[]>([
    { id: 'ig-1', name: 'Instagram ID', price: 250, category: 'instagram', isAvailable: true },
  ]);

  const [smmServices, setSmmServices] = useState<ServiceItem[]>([
    { id: 'smm-1', name: 'Facebook Follower', price: 50, category: 'smm', isAvailable: true },
    { id: 'smm-2', name: 'Facebook BD Follower', price: 80, category: 'smm', isAvailable: true },
    { id: 'smm-3', name: 'Facebook React', price: 30, category: 'smm', isAvailable: true },
    { id: 'smm-4', name: 'Facebook Reels View', price: 20, category: 'smm', isAvailable: true },
    { id: 'smm-5', name: 'Instagram Follower', price: 60, category: 'smm', isAvailable: true },
    { id: 'smm-6', name: 'Instagram Like', price: 25, category: 'smm', isAvailable: true },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 'bkash', name: 'Bkash', number: '01700000000', logo: 'https://picsum.photos/seed/bkash/100/100', color: 'bg-pink-500' },
    { id: 'nagad', name: 'Nagad', number: '01800000000', logo: 'https://picsum.photos/seed/nagad/100/100', color: 'bg-orange-500' },
    { id: 'rocket', name: 'Rocket', number: '01900000000', logo: 'https://picsum.photos/seed/rocket/100/100', color: 'bg-purple-600' },
    { id: 'binance', name: 'Binance', number: 'TXXXXXXXXXXXX', logo: 'https://picsum.photos/seed/binance/100/100', color: 'bg-yellow-500' },
  ]);

  // Customizable Image URLs (Mocked)
  const [appLogo, setAppLogo] = useState('https://picsum.photos/seed/store/100/100');
  const [serviceLogos, setServiceLogos] = useState({
    vpn: 'https://picsum.photos/seed/vpnicon/100/100',
    fb: 'https://picsum.photos/seed/fbicon/100/100',
    ig: 'https://picsum.photos/seed/igicon/100/100',
    smm: 'https://picsum.photos/seed/smmicon/100/100'
  });
  const [paymentLogos, setPaymentLogos] = useState({
    Bkash: 'https://picsum.photos/seed/bkash/100/100',
    Nagad: 'https://picsum.photos/seed/nagad/100/100',
    Rocket: 'https://picsum.photos/seed/rocket/100/100',
    Binance: 'https://picsum.photos/seed/binance/100/100'
  });

  const isAdmin = profile?.telegramUsername === developerTelegram;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Settings
        const { data: settingsData } = await supabase.from('settings').select('*').single();
        if (settingsData) {
          setAppNotice(settingsData.app_notice);
          setAppLogo(settingsData.app_logo);
          setDeveloperName(settingsData.developer_name);
          setDeveloperTelegram(settingsData.developer_telegram);
          setDeveloperPhone(settingsData.developer_phone);
          setTelegramChannel(settingsData.telegram_channel);
          if (settingsData.payment_methods) {
            setPaymentMethods(settingsData.payment_methods);
          }
        } else {
          // Seed initial settings if empty
          const initialSettings = {
            id: 1,
            app_notice: 'Strong Agency-এ স্বাগতম!',
            app_logo: 'https://picsum.photos/seed/store/100/100',
            developer_name: 'Developer Emon',
            developer_telegram: '@Devoloper_Emon',
            developer_phone: '+880123456789',
            telegram_channel: 'https://t.me/your_admin_id',
            payment_methods: [
              { id: 'bkash', name: 'Bkash', number: '01700000000', logo: 'https://picsum.photos/seed/bkash/100/100', color: 'bg-pink-500' },
              { id: 'nagad', name: 'Nagad', number: '01800000000', logo: 'https://picsum.photos/seed/nagad/100/100', color: 'bg-orange-500' },
              { id: 'rocket', name: 'Rocket', number: '01900000000', logo: 'https://picsum.photos/seed/rocket/100/100', color: 'bg-purple-600' },
              { id: 'binance', name: 'Binance', number: 'TXXXXXXXXXXXX', logo: 'https://picsum.photos/seed/binance/100/100', color: 'bg-yellow-500' },
            ]
          };
          await supabase.from('settings').insert([initialSettings]);
          setAppNotice(initialSettings.app_notice);
          setAppLogo(initialSettings.app_logo);
          setDeveloperName(initialSettings.developer_name);
          setDeveloperTelegram(initialSettings.developer_telegram);
          setDeveloperPhone(initialSettings.developer_phone);
          setTelegramChannel(initialSettings.telegram_channel);
          setPaymentMethods(initialSettings.payment_methods);
        }

        // Fetch Services
        const { data: servicesData } = await supabase.from('services').select('*');
        if (servicesData && servicesData.length > 0) {
          setVpnServices(servicesData.filter((s: any) => s.category === 'vpn').map((s: any) => ({ ...s, isAvailable: s.is_available })));
          setFbServices(servicesData.filter((s: any) => s.category === 'facebook').map((s: any) => ({ ...s, isAvailable: s.is_available })));
          setIgServices(servicesData.filter((s: any) => s.category === 'instagram').map((s: any) => ({ ...s, isAvailable: s.is_available })));
          setSmmServices(servicesData.filter((s: any) => s.category === 'smm').map((s: any) => ({ ...s, isAvailable: s.is_available })));
        } else {
          // Seed initial services if empty
          const initialServices = [
            { id: 'vpn-1', name: 'Nord VPN', price: 500, category: 'vpn', image: 'https://picsum.photos/seed/nord/100/100', is_available: true },
            { id: 'vpn-2', name: 'Express VPN', price: 700, category: 'vpn', image: 'https://picsum.photos/seed/express/100/100', is_available: true },
            { id: 'vpn-3', name: 'Super VPN', price: 300, category: 'vpn', image: 'https://picsum.photos/seed/super/100/100', is_available: true },
            { id: 'fb-1', name: '1000xxxxx ID', price: 150, category: 'facebook', is_available: true },
            { id: 'fb-2', name: '615xxxxxx ID', price: 200, category: 'facebook', is_available: true },
            { id: 'ig-1', name: 'Instagram ID', price: 250, category: 'instagram', is_available: true },
            { id: 'smm-1', name: 'Facebook Follower', price: 50, category: 'smm', is_available: true },
            { id: 'smm-2', name: 'Facebook BD Follower', price: 80, category: 'smm', is_available: true },
            { id: 'smm-3', name: 'Facebook React', price: 30, category: 'smm', is_available: true },
            { id: 'smm-4', name: 'Facebook Reels View', price: 20, category: 'smm', is_available: true },
            { id: 'smm-5', name: 'Instagram Follower', price: 60, category: 'smm', is_available: true },
            { id: 'smm-6', name: 'Instagram Like', price: 25, category: 'smm', is_available: true },
          ];
          await supabase.from('services').insert(initialServices);
          
          setVpnServices(initialServices.filter(s => s.category === 'vpn').map(s => ({ ...s, isAvailable: s.is_available })));
          setFbServices(initialServices.filter(s => s.category === 'facebook').map(s => ({ ...s, isAvailable: s.is_available })));
          setIgServices(initialServices.filter(s => s.category === 'instagram').map(s => ({ ...s, isAvailable: s.is_available })));
          setSmmServices(initialServices.filter(s => s.category === 'smm').map(s => ({ ...s, isAvailable: s.is_available })));
        }

        // Fetch all users for admin
        const { data: usersData } = await supabase.from('users').select('*');
        if (usersData) {
          const mappedUsers = usersData.map((u: any) => ({
            telegramUsername: u.telegram_username,
            displayName: u.display_name,
            photoUrl: u.photo_url,
            balance: u.balance
          }));
          setAllUsers(mappedUsers);
          
          // If a user was previously "logged in"
          const savedUser = localStorage.getItem('strongagency_user');
          if (savedUser) {
            const matchedUser = mappedUsers.find((u: any) => u.telegramUsername === savedUser);
            if (matchedUser) setProfile(matchedUser);
          }
        }

        // Fetch Orders & Transactions
        const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData) {
          setOrders(ordersData.map((o: any) => ({
            id: o.id,
            userId: o.user_id,
            serviceName: o.service_name,
            price: o.price,
            status: o.status,
            createdAt: o.created_at
          })));
        }

        const { data: trxData } = await supabase.from('transactions').select('*').order('created_at', { ascending: false });
        if (trxData) {
          setTransactions(trxData.map((t: any) => ({
            id: t.id,
            userId: t.user_id,
            amount: t.amount,
            type: t.type,
            method: t.method,
            transactionId: t.transaction_id,
            status: t.status,
            createdAt: t.created_at
          })));
        }

      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.message?.includes('relation "users" does not exist')) {
          console.error("DATABASE ERROR: Tables are missing. Please run the SQL code provided.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleAddProfile = async () => {
    if (!tgUsernameInput) return;
    
    // Normalize username (ensure it starts with @ and is trimmed)
    const trimmedInput = tgUsernameInput.trim();
    const normalizedUsername = trimmedInput.startsWith('@') ? trimmedInput : `@${trimmedInput}`;

    try {
      // Check if user already exists
      console.log("Checking user:", normalizedUsername);
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('telegram_username', normalizedUsername)
        .maybeSingle();

      if (fetchError) {
        console.error("Supabase fetch error:", fetchError);
        throw fetchError;
      }

      if (existingUser) {
        console.log("User found:", existingUser);
        // User exists, "log them in"
        const userProfile: UserProfile = {
          telegramUsername: existingUser.telegram_username,
          displayName: existingUser.display_name,
          photoUrl: existingUser.photo_url,
          balance: existingUser.balance
        };
        setProfile(userProfile);
        localStorage.setItem('strongagency_user', userProfile.telegramUsername);
      } else {
        console.log("Creating new user:", normalizedUsername);
        // Create new user
        const newProfile: UserProfile = {
          telegramUsername: normalizedUsername,
          displayName: normalizedUsername,
          photoUrl: `https://ui-avatars.com/api/?name=${normalizedUsername.replace('@', '')}&background=random`,
          balance: 0
        };

        const { error: insertError } = await supabase.from('users').insert([{
          telegram_username: newProfile.telegramUsername,
          display_name: newProfile.displayName,
          photo_url: newProfile.photoUrl,
          balance: newProfile.balance
        }]);

        if (insertError) {
          console.error("Supabase insert error:", insertError);
          throw insertError;
        }

        setProfile(newProfile);
        localStorage.setItem('strongagency_user', newProfile.telegramUsername);
        
        setAllUsers(prev => [...prev, newProfile]);
      }
      
      setShowAddProfile(false);
      setTgUsernameInput('');
    } catch (error: any) {
      console.error("Error handling profile:", error);
      alert(`প্রোফাইল প্রসেস করতে সমস্যা হয়েছে: ${error.message || 'Unknown error'}`);
    }
  };

  const handleBuy = async (service: ServiceItem) => {
    if (!profile) {
      alert('অনুগ্রহ করে আগে প্রোফাইল যুক্ত করুন');
      return;
    }
    if (profile.balance < service.price) {
      alert('আপনার ব্যালেন্স পর্যাপ্ত নয়');
      return;
    }

    const newBalance = profile.balance - service.price;

    try {
      // 1. Update User Balance
      const { error: userError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('telegram_username', profile.telegramUsername);
      
      if (userError) throw userError;

      // 2. Add Order
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        userId: profile.telegramUsername,
        serviceName: service.name,
        price: service.price,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      const { error: orderError } = await supabase.from('orders').insert([{
        id: newOrder.id,
        user_id: newOrder.userId,
        service_name: newOrder.serviceName,
        price: newOrder.price,
        status: newOrder.status,
        created_at: newOrder.createdAt
      }]);

      if (orderError) throw orderError;

      // 3. Add Transaction
      const newTrx: Transaction = {
        id: Math.random().toString(36).substr(2, 9),
        userId: profile.telegramUsername,
        amount: service.price,
        type: 'spend',
        status: 'success',
        createdAt: new Date().toISOString()
      };

      const { error: trxError } = await supabase.from('transactions').insert([{
        id: newTrx.id,
        user_id: newTrx.userId,
        amount: newTrx.amount,
        type: newTrx.type,
        status: newTrx.status,
        created_at: newTrx.createdAt
      }]);

      if (trxError) throw trxError;

      // Update Local State
      setProfile({ ...profile, balance: newBalance });
      setAllUsers(allUsers.map((u: any) => u.telegramUsername === profile.telegramUsername ? { ...u, balance: newBalance } : u));
      setOrders([newOrder, ...orders]);
      setTransactions([newTrx, ...transactions]);

      alert('অর্ডার সফল হয়েছে! এডমিন শীঘ্রই আপনার সাথে যোগাযোগ করবে।');
      setSubPage(null);
    } catch (error) {
      console.error("Error buying service:", error);
      alert("অর্ডার করতে সমস্যা হয়েছে।");
    }
  };

  const handleAddFund = () => {
    if (!fundAmount || isNaN(Number(fundAmount))) return;
    setPaymentStep(2);
  };

  const [isSubmittingTrx, setIsSubmittingTrx] = useState(false);

  const submitAddFund = async () => {
    if (!trxId) {
      alert("দয়া করে ট্রানজেকশন আইডিটি দিন।");
      return;
    }
    if (!profile) {
      alert("প্রোফাইল পাওয়া যায়নি। দয়া করে আবার চেষ্টা করুন।");
      return;
    }
    
    setIsSubmittingTrx(true);
    const newTrx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      userId: profile.telegramUsername,
      amount: Number(fundAmount),
      type: 'add',
      method: selectedMethod!,
      transactionId: trxId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('transactions').insert([{
        id: newTrx.id,
        user_id: newTrx.userId,
        amount: newTrx.amount,
        type: newTrx.type,
        method: newTrx.method,
        transaction_id: newTrx.transactionId,
        status: newTrx.status,
        created_at: newTrx.createdAt
      }]);

      if (error) throw error;

      setTransactions([newTrx, ...transactions]);
      
      setShowAddFund(false);
      setShowSuccess(true);
      
      // Reset form
      setPaymentStep(1);
      setFundAmount('');
      setTrxId('');
      setSelectedMethod(null);

    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("ট্রানজেকশন সেভ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmittingTrx(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen blue-gradient flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4">
            <ShoppingBag className="text-primary w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold tracking-wider">Strong Agency</h1>
          <div className="mt-8 flex space-x-2">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className="w-3 h-3 bg-white rounded-full"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className="w-3 h-3 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen pb-24 transition-colors duration-300", isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}>
      {/* Header */}
      <header className={cn("sticky top-0 z-40 p-4 flex items-center justify-between shadow-md border-b", isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200")}>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 blue-gradient rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img src={appLogo} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="font-bold text-xl tracking-tight">Strong Agency</span>
        </div>
        <button 
          onClick={toggleTheme}
          className={cn("p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-sm", isDarkMode ? "bg-slate-800 text-yellow-400" : "bg-slate-100 text-slate-700 border border-slate-200")}
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {subPage ? (
            <motion.div
              key="subpage"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <button onClick={() => setSubPage(null)} className="mb-4 flex items-center text-primary font-medium">
                <ChevronRight className="rotate-180 w-5 h-5 mr-1" /> ফিরে যান
              </button>
              
              {subPage === 'vpn' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">VPN সার্ভিস</h2>
                  {vpnServices.map(vpn => (
                    <div key={vpn.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img src={vpn.image} alt={vpn.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold">{vpn.name}</h3>
                            <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", vpn.isAvailable !== false ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                              {vpn.isAvailable !== false ? 'অ্যাভেলেবেল' : 'অ্যাভেলেবেল নেই'}
                            </span>
                          </div>
                          <p className="text-sm opacity-70">প্রিমিয়াম একাউন্ট</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-primary mb-2">৳{vpn.price}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => setSubPage(null)} className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-500">বাতিল</button>
                          <button 
                            disabled={vpn.isAvailable === false}
                            onClick={() => handleBuy(vpn)} 
                            className={cn("px-3 py-1 text-xs rounded-lg text-white", vpn.isAvailable !== false ? "bg-primary" : "bg-slate-500 opacity-50 cursor-not-allowed")}
                          >
                            কিনুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {subPage === 'facebook' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Facebook ID</h2>
                  {fbServices.map(fb => (
                    <div key={fb.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold">{fb.name}</h3>
                          <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", fb.isAvailable !== false ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                            {fb.isAvailable !== false ? 'অ্যাভেলেবেল' : 'অ্যাভেলেবেল নেই'}
                          </span>
                        </div>
                        <p className="text-sm opacity-70">পিসি ক্লোন আইডি</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-primary mb-2">৳{fb.price}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => setSubPage(null)} className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-500">বাতিল</button>
                          <button 
                            disabled={fb.isAvailable === false}
                            onClick={() => handleBuy(fb)} 
                            className={cn("px-3 py-1 text-xs rounded-lg text-white", fb.isAvailable !== false ? "bg-primary" : "bg-slate-500 opacity-50 cursor-not-allowed")}
                          >
                            কিনুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {subPage === 'instagram' && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Instagram ID</h2>
                  {igServices.map(ig => (
                    <div key={ig.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold">{ig.name}</h3>
                          <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", ig.isAvailable !== false ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                            {ig.isAvailable !== false ? 'অ্যাভেলেবেল' : 'অ্যাভেলেবেল নেই'}
                          </span>
                        </div>
                        <p className="text-sm opacity-70">ওল্ড আইডি</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-primary mb-2">৳{ig.price}</span>
                        <div className="flex space-x-2">
                          <button onClick={() => setSubPage(null)} className="px-3 py-1 text-xs rounded-lg bg-red-500/20 text-red-500">বাতিল</button>
                          <button 
                            disabled={ig.isAvailable === false}
                            onClick={() => handleBuy(ig)} 
                            className={cn("px-3 py-1 text-xs rounded-lg text-white", ig.isAvailable !== false ? "bg-primary" : "bg-slate-500 opacity-50 cursor-not-allowed")}
                          >
                            কিনুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {subPage === 'smm' && (
                <div className="space-y-3">
                  <h2 className="text-xl font-bold mb-4">SMS/SMM সার্ভিস</h2>
                  {smmServices.map(smm => (
                    <div key={smm.id} className="glass p-3 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{smm.name}</span>
                        <span className={cn("text-[7px] px-1 py-0.5 rounded-full font-bold uppercase", smm.isAvailable !== false ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                          {smm.isAvailable !== false ? 'অ্যাভেলেবেল' : 'অ্যাভেলেবেল নেই'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-primary font-bold">৳{smm.price}</span>
                        <button 
                          disabled={smm.isAvailable === false}
                          onClick={() => handleBuy(smm)} 
                          className={cn("px-4 py-1 text-white text-xs rounded-lg flex items-center", smm.isAvailable !== false ? "bg-primary" : "bg-slate-500 opacity-50 cursor-not-allowed")}
                        >
                          কিনুন <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {activeTab === 'home' && (
                <>
                  {/* Discount Card */}
                  <div className="blue-gradient p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-2xl font-bold mb-1">নোটিশ!</h2>
                      <p className="opacity-90 text-sm">{appNotice}</p>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  </div>

                  {/* Profile Card */}
                  <div className="glass p-5 rounded-3xl">
                    {!profile ? (
                      <div className="flex flex-col items-center py-4">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3">
                          <Plus className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="font-bold mb-2">প্রোফাইল নেই</h3>
                        <button 
                          onClick={() => setShowAddProfile(true)}
                          className="px-8 py-2 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30"
                        >
                          অ্যাড প্রোফাইল
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img src={profile.photoUrl} alt="Profile" className="w-14 h-14 rounded-2xl border-2 border-primary/30" referrerPolicy="no-referrer" />
                          <div>
                            <h3 className="font-bold text-lg">{profile.displayName}</h3>
                            <p className="text-xs opacity-60">@{profile.telegramUsername}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-60 mb-1">ব্যালেন্স</p>
                          <p className="text-xl font-black text-primary">৳{profile.balance}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Services */}
                  <div>
                    <p className="text-sm font-bold opacity-60 mb-4 uppercase tracking-widest">অ্যাভেলেবেল সার্ভিস</p>
                    <div className="space-y-3">
                      <ServiceCard isDarkMode={isDarkMode} image={serviceLogos.vpn} title="VPN সেল" onClick={() => setSubPage('vpn')} />
                      <ServiceCard isDarkMode={isDarkMode} image={serviceLogos.fb} title="FB আইডি সেল" onClick={() => setSubPage('facebook')} />
                      <ServiceCard isDarkMode={isDarkMode} image={serviceLogos.ig} title="IG আইডি সেল" onClick={() => setSubPage('instagram')} />
                      <ServiceCard isDarkMode={isDarkMode} image={serviceLogos.smm} title="SMM সার্ভিস" onClick={() => setSubPage('smm')} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div className="blue-gradient p-8 rounded-3xl text-white flex flex-col items-center shadow-2xl">
                    <p className="opacity-80 mb-2">মোট ব্যালেন্স</p>
                    <h2 className="text-4xl font-black mb-6">৳{profile?.balance || 0}</h2>
                    <button 
                      onClick={() => setShowAddFund(true)}
                      className="px-10 py-3 bg-white text-primary rounded-2xl font-bold flex items-center shadow-xl"
                    >
                      <Plus className="w-5 h-5 mr-2" /> এড ফান্ড
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-4">পেমেন্ট হিস্টোরি</h3>
                    <div className="space-y-3">
                      {transactions.filter(t => t.userId === profile?.telegramUsername).length === 0 ? (
                        <div className="text-center py-10 opacity-40">কোন হিস্টোরি নেই</div>
                      ) : (
                        transactions.filter(t => t.userId === profile?.telegramUsername).map(trx => (
                          <div key={trx.id} className="glass p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", trx.type === 'add' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                                {trx.type === 'add' ? <Plus className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-90" />}
                              </div>
                              <div>
                                <h4 className="font-bold">{trx.type === 'add' ? 'ব্যালেন্স যুক্ত' : 'সার্ভিস ক্রয়'}</h4>
                                <p className="text-xs opacity-50">{new Date(trx.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={cn("font-bold", trx.type === 'add' ? "text-green-500" : "text-red-500")}>
                                {trx.type === 'add' ? '+' : '-'}৳{trx.amount}
                              </p>
                              <p className="text-[10px] opacity-40">{trx.status}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'order' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold mb-6">আপনার অর্ডারসমূহ</h2>
                  {orders.filter(o => o.userId === profile?.telegramUsername).length === 0 ? (
                    <div className="text-center py-20 opacity-40">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-4" />
                      <p>এখনো কোন অর্ডার করেননি</p>
                    </div>
                  ) : (
                    orders.filter(o => o.userId === profile?.telegramUsername).map(order => (
                      <div key={order.id} className="glass p-4 rounded-2xl">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg">{order.serviceName}</h3>
                            <p className="text-xs opacity-50">ID: #{order.id}</p>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                            order.status === 'pending' ? "bg-yellow-500/20 text-yellow-500" : 
                            order.status === 'success' ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                          )}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                          <span className="text-sm opacity-60">{new Date(order.createdAt).toLocaleString()}</span>
                          <span className="font-bold text-primary">৳{order.price}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'help' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="glass p-6 rounded-3xl flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 blue-gradient rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="text-white" />
                      </div>
                      <span className="font-bold">How to Buy</span>
                    </button>
                    <button className="glass p-6 rounded-3xl flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                        <MessageCircle className="text-white" />
                      </div>
                      <span className="font-bold">Chat Admin</span>
                    </button>
                  </div>

                  <button 
                    onClick={() => window.open(telegramChannel, '_blank')}
                    className="w-full blue-gradient p-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    <span>Join Our Telegram Channel</span>
                  </button>

                  <div className="animated-border p-[2px] rounded-3xl">
                    <div className={cn("p-6 rounded-3xl flex flex-col items-center", isDarkMode ? "bg-slate-900" : "bg-white")}>
                      <img src="https://picsum.photos/seed/dev/100/100" alt="Dev" className="w-20 h-20 rounded-full border-4 border-primary/20 mb-4" />
                      <h3 className="text-xl font-bold">{developerName}</h3>
                      <p className="text-primary font-medium mb-4">Full Stack Developer</p>
                      <div className="w-full space-y-3">
                        <div className="flex items-center justify-between p-3 glass rounded-xl">
                          <span className="text-sm opacity-60">Telegram</span>
                          <span className="font-bold">{developerTelegram}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 glass rounded-xl">
                          <span className="text-sm opacity-60">Phone</span>
                          <span className="font-bold">{developerPhone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <button 
                      onClick={() => setShowAdminPanel(true)}
                      className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-transparent">
        <div className="max-w-md mx-auto flex justify-between items-center gap-2">
          <NavButton isDarkMode={isDarkMode} active={activeTab === 'home'} icon={<Home />} label="Home" onClick={() => { setActiveTab('home'); setSubPage(null); }} />
          <NavButton isDarkMode={isDarkMode} active={activeTab === 'wallet'} icon={<Wallet />} label="Wallet" onClick={() => { setActiveTab('wallet'); setSubPage(null); }} />
          <NavButton isDarkMode={isDarkMode} active={activeTab === 'order'} icon={<ShoppingBag />} label="Order" onClick={() => { setActiveTab('order'); setSubPage(null); }} />
          <NavButton isDarkMode={isDarkMode} active={activeTab === 'help'} icon={<HelpCircle />} label="Help" onClick={() => { setActiveTab('help'); setSubPage(null); }} />
        </div>
      </nav>

      {/* Modals */}
      <AnimatePresence>
        {showAddProfile && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProfile(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={cn("relative w-full max-w-xs p-6 rounded-3xl shadow-2xl z-10", isDarkMode ? "bg-slate-900" : "bg-white")}
            >
              <h2 className="text-xl font-bold mb-4">টেলিগ্রাম ইউজারনেম</h2>
              <input 
                type="text" 
                placeholder="@username"
                value={tgUsernameInput}
                onChange={(e) => setTgUsernameInput(e.target.value)}
                className="w-full p-4 rounded-2xl glass border-2 border-primary/20 mb-6 outline-none focus:border-primary transition-colors"
              />
              <button 
                onClick={handleAddProfile}
                className="w-full py-4 blue-gradient text-white rounded-2xl font-bold shadow-lg"
              >
                সাবমিট করুন
              </button>
            </motion.div>
          </div>
        )}

        {showAddFund && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowAddFund(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={cn("relative w-full max-w-sm p-6 rounded-3xl shadow-2xl z-10", isDarkMode ? "bg-slate-900" : "bg-white")}
            >
              {paymentStep === 1 ? (
                <>
                  <h2 className="text-2xl font-bold mb-2">এড ফান্ড</h2>
                  <p className="text-sm opacity-60 mb-6">আপনি কত টাকা এড করতে চান?</p>
                  <input 
                    type="number" 
                    placeholder="৳0.00"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    className="w-full p-4 text-2xl font-bold rounded-2xl glass border-2 border-primary/20 mb-6 outline-none focus:border-primary text-center"
                  />
                  <button 
                    onClick={handleAddFund}
                    className="w-full py-4 blue-gradient text-white rounded-2xl font-bold"
                  >
                    নেক্সট
                  </button>
                </>
              ) : !selectedMethod ? (
                <>
                  <h2 className="text-xl font-bold mb-6">পেমেন্ট মেথড সিলেক্ট করুন</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {paymentMethods.map(method => (
                      <MethodBtn 
                        key={method.id}
                        isDarkMode={isDarkMode} 
                        image={method.logo} 
                        name={method.name} 
                        color={method.color} 
                        onClick={() => setSelectedMethod(method.name)} 
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{selectedMethod} পেমেন্ট</h2>
                    <button onClick={() => setSelectedMethod(null)} className="text-primary text-sm">পরিবর্তন</button>
                  </div>
                  <div className="glass p-4 rounded-2xl mb-6">
                    <p className="text-xs opacity-60 mb-1">পেমেন্ট নাম্বার</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {paymentMethods.find(m => m.name === selectedMethod)?.number || '01700000000'}
                      </span>
                      <button 
                        onClick={() => { 
                          const num = paymentMethods.find(m => m.name === selectedMethod)?.number || '01700000000';
                          navigator.clipboard.writeText(num); 
                          alert('নাম্বার কপি হয়েছে!'); 
                        }}
                        className="p-2 bg-primary/10 text-primary rounded-lg"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <p className="text-xs opacity-70 leading-relaxed">
                      ১. উপরের নাম্বারে সেন্ড মানি করুন।<br/>
                      ২. ট্রানজেকশন আইডিটি নিচের বক্সে দিন।<br/>
                      ৩. সাবমিট বাটনে ক্লিক করুন।
                    </p>
                    <input 
                      type="text" 
                      placeholder="Transaction ID"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      className="w-full p-4 rounded-2xl glass border-2 border-primary/20 outline-none focus:border-primary"
                    />
                  </div>
                  <button 
                    onClick={submitAddFund}
                    disabled={isSubmittingTrx}
                    className={cn(
                      "w-full py-4 blue-gradient text-white rounded-2xl font-bold transition-all",
                      isSubmittingTrx ? "opacity-50 cursor-not-allowed" : "active:scale-95"
                    )}
                  >
                    {isSubmittingTrx ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={cn("relative w-full max-w-xs p-8 rounded-[40px] shadow-2xl z-10 flex flex-col items-center text-center", isDarkMode ? "bg-slate-900" : "bg-white")}
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <CheckCircle2 className="text-white w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">সফল হয়েছে!</h2>
              <p className="opacity-70 mb-8">আপনার ট্রানজেকশন আইডিটি সফলভাবে সাবমিট করা হয়েছে। এডমিন চেক করে ব্যালেন্স যুক্ত করে দিবে।</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full py-4 blue-gradient text-white rounded-2xl font-bold shadow-xl"
              >
                ঠিক আছে
              </button>
            </motion.div>
          </div>
        )}

        {showAdminPanel && isAdmin && (
          <AdminPanel 
            isDarkMode={isDarkMode}
            onClose={() => setShowAdminPanel(false)}
            appNotice={appNotice}
            setAppNotice={setAppNotice}
            developerName={developerName}
            setDeveloperName={setDeveloperName}
            developerTelegram={developerTelegram}
            setDeveloperTelegram={setDeveloperTelegram}
            developerPhone={developerPhone}
            setDeveloperPhone={setDeveloperPhone}
            telegramChannel={telegramChannel}
            setTelegramChannel={setTelegramChannel}
            vpnServices={vpnServices}
            setVpnServices={setVpnServices}
            fbServices={fbServices}
            setFbServices={setFbServices}
            igServices={igServices}
            setIgServices={setIgServices}
            smmServices={smmServices}
            setSmmServices={setSmmServices}
            paymentMethods={paymentMethods}
            setPaymentMethods={setPaymentMethods}
            transactions={transactions}
            setTransactions={setTransactions}
            orders={orders}
            setOrders={setOrders}
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            profile={profile}
            setProfile={setProfile}
            appLogo={appLogo}
            setAppLogo={setAppLogo}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminPanel({ 
  isDarkMode, 
  onClose,
  appNotice, setAppNotice,
  developerName, setDeveloperName,
  developerTelegram, setDeveloperTelegram,
  developerPhone, setDeveloperPhone,
  telegramChannel, setTelegramChannel,
  vpnServices, setVpnServices,
  fbServices, setFbServices,
  igServices, setIgServices,
  smmServices, setSmmServices,
  paymentMethods, setPaymentMethods,
  transactions, setTransactions,
  orders, setOrders,
  allUsers, setAllUsers,
  profile, setProfile,
  appLogo, setAppLogo
}: any) {
  const [adminTab, setAdminTab] = useState<'settings' | 'services' | 'payments' | 'orders' | 'users'>('settings');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const approveTransaction = async (trxId: string) => {
    const trx = transactions.find((t: any) => t.id === trxId);
    if (!trx) return;

    try {
      // 1. Update Transaction Status
      const { error: trxError } = await supabase
        .from('transactions')
        .update({ status: 'success' })
        .eq('id', trxId);
      
      if (trxError) throw trxError;

      // 2. Fetch current user balance to be safe
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('balance')
        .eq('telegram_username', trx.userId)
        .single();
      
      if (userFetchError) throw userFetchError;

      const newBalance = (userData?.balance || 0) + trx.amount;

      // 3. Update User Balance
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('telegram_username', trx.userId);
      
      if (userUpdateError) throw userUpdateError;

      // Update local state
      setTransactions(transactions.map((t: any) => t.id === trxId ? { ...t, status: 'success' } : t));
      setAllUsers(allUsers.map((u: any) => u.telegramUsername === trx.userId ? { ...u, balance: newBalance } : u));
      if (profile && trx.userId === profile.telegramUsername) {
        setProfile({ ...profile, balance: newBalance });
      }
      
      alert('ট্রানজেকশন অ্যাপ্রুভ করা হয়েছে।');
    } catch (error) {
      console.error("Error approving transaction:", error);
      alert("ট্রানজেকশন অ্যাপ্রুভ করতে সমস্যা হয়েছে।");
    }
  };

  const rejectTransaction = async (trxId: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', trxId);
      
      if (error) throw error;

      setTransactions(transactions.map((t: any) => t.id === trxId ? { ...t, status: 'rejected' } : t));
      alert('ট্রানজেকশন রিজেক্ট করা হয়েছে।');
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      alert("ট্রানজেকশন রিজেক্ট করতে সমস্যা হয়েছে।");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw error;

      setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status } : o));
      alert(`অর্ডার স্ট্যাটাস ${status} করা হয়েছে।`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("অর্ডার স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।");
    }
  };

  const saveSettings = async () => {
    try {
      const { error } = await supabase.from('settings').upsert([{
        id: 1,
        app_notice: appNotice,
        app_logo: appLogo,
        developer_name: developerName,
        developer_telegram: developerTelegram,
        developer_phone: developerPhone,
        telegram_channel: telegramChannel,
        payment_methods: paymentMethods
      }]);

      if (error) throw error;
      alert("সেটিংস সেভ করা হয়েছে।");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("সেটিংস সেভ করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className={cn("fixed inset-0 z-[80] flex flex-col", isDarkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900")}
    >
      <header className={cn("p-4 flex items-center justify-between border-b", isDarkMode ? "bg-slate-900 border-white/5" : "bg-white border-slate-200")}>
        <div className="flex items-center space-x-2">
          <Settings className="text-primary" />
          <h2 className="font-bold text-xl">Admin Panel</h2>
        </div>
        <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex overflow-x-auto p-2 space-x-2 no-scrollbar bg-primary/5">
        <AdminTabBtn active={adminTab === 'settings'} icon={<Settings />} label="Settings" onClick={() => setAdminTab('settings')} />
        <AdminTabBtn active={adminTab === 'services'} icon={<Database />} label="Services" onClick={() => setAdminTab('services')} />
        <AdminTabBtn active={adminTab === 'payments'} icon={<Wallet />} label="Payments" onClick={() => setAdminTab('payments')} />
        <AdminTabBtn active={adminTab === 'orders'} icon={<ShoppingBag />} label="Orders" onClick={() => setAdminTab('orders')} />
        <AdminTabBtn active={adminTab === 'users'} icon={<Users />} label="Users" onClick={() => setAdminTab('users')} />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-10">
        {adminTab === 'settings' && (
          <div className="space-y-4">
            <AdminInput label="App Logo URL" value={appLogo} onChange={setAppLogo} />
            <AdminInput label="App Notice" value={appNotice} onChange={setAppNotice} isTextArea />
            <AdminInput label="Developer Name" value={developerName} onChange={setDeveloperName} />
            <AdminInput label="Developer Telegram" value={developerTelegram} onChange={setDeveloperTelegram} />
            <AdminInput label="Developer Phone" value={developerPhone} onChange={setDeveloperPhone} />
            <AdminInput label="Telegram Channel Link" value={telegramChannel} onChange={setTelegramChannel} />
            <button 
              onClick={saveSettings}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg"
            >
              Save All Settings
            </button>
          </div>
        )}

        {adminTab === 'services' && (
          <div className="space-y-8">
            <ServiceEditor title="VPN Services" category="vpn" services={vpnServices} setServices={setVpnServices} />
            <ServiceEditor title="Facebook Services" category="facebook" services={fbServices} setServices={setFbServices} />
            <ServiceEditor title="Instagram Services" category="instagram" services={igServices} setServices={setIgServices} />
            <ServiceEditor title="SMS/SMM সার্ভিস" category="smm" services={smmServices} setServices={setSmmServices} />
          </div>
        )}

        {adminTab === 'payments' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Payment Methods</h3>
            {paymentMethods.map((method: any, idx: number) => (
              <div key={method.id} className="glass p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-3">
                  <img src={method.logo} alt="" className="w-10 h-10 rounded-lg" />
                  <span className="font-bold">{method.name}</span>
                </div>
                <AdminInput 
                  label="Name" 
                  value={method.name} 
                  onChange={(val: string) => {
                    const newMethods = [...paymentMethods];
                    newMethods[idx].name = val;
                    setPaymentMethods(newMethods);
                  }} 
                />
                <AdminInput 
                  label="Logo URL" 
                  value={method.logo} 
                  onChange={(val: string) => {
                    const newMethods = [...paymentMethods];
                    newMethods[idx].logo = val;
                    setPaymentMethods(newMethods);
                  }} 
                />
                <AdminInput 
                  label="Number/Address" 
                  value={method.number} 
                  onChange={(val: string) => {
                    const newMethods = [...paymentMethods];
                    newMethods[idx].number = val;
                    setPaymentMethods(newMethods);
                  }} 
                />
              </div>
            ))}
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Wallet className="w-5 h-5 mr-2" /> Add Fund Requests
              </h3>
              <div className="space-y-3">
                {transactions.filter((t: any) => t.type === 'add' && t.status === 'pending').length === 0 ? (
                  <p className="opacity-40 text-center py-4">No pending requests</p>
                ) : (
                  transactions.filter((t: any) => t.type === 'add' && t.status === 'pending').map((trx: any) => (
                    <div key={trx.id} className="glass p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between">
                        <span className="font-bold">৳{trx.amount}</span>
                        <span className="text-xs opacity-50">{trx.method}</span>
                      </div>
                      <p className="text-sm">User: {trx.userId}</p>
                      <p className="text-xs font-mono bg-black/20 p-2 rounded">TrxID: {trx.transactionId}</p>
                      <div className="flex space-x-2 pt-2">
                        <button onClick={() => approveTransaction(trx.id)} className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center">
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </button>
                        <button onClick={() => rejectTransaction(trx.id)} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-bold flex items-center justify-center">
                          <X className="w-4 h-4 mr-1" /> Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2" /> Pending Orders
              </h3>
              <div className="space-y-3">
                {orders.filter((o: any) => o.status === 'pending').length === 0 ? (
                  <p className="opacity-40 text-center py-4">No pending orders</p>
                ) : (
                  orders.filter((o: any) => o.status === 'pending').map((order: any) => (
                    <div key={order.id} className="glass p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between">
                        <span className="font-bold text-lg">{order.serviceName}</span>
                        <span className="text-primary font-bold">৳{order.price}</span>
                      </div>
                      <div className="flex items-center justify-between p-2 glass rounded-xl bg-black/10">
                        <div className="flex flex-col">
                          <span className="text-[10px] opacity-50 uppercase font-bold">User</span>
                          <span className="text-sm font-bold">{order.userId}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => copyToClipboard(order.userId)}
                            className="p-2 bg-primary/20 text-primary rounded-lg"
                            title="Copy Username"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => window.open(`https://t.me/${order.userId.replace('@', '')}`, '_blank')}
                            className="p-2 bg-blue-500/20 text-blue-500 rounded-lg"
                            title="Open Telegram"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex space-x-2 pt-2">
                        <button onClick={() => updateOrderStatus(order.id, 'success')} className="flex-1 py-3 bg-green-500 text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-lg shadow-green-500/20">
                          <Check className="w-4 h-4 mr-1" /> Complete
                        </button>
                        <button onClick={() => updateOrderStatus(order.id, 'failed')} className="flex-1 py-3 bg-red-500 text-white rounded-xl text-sm font-bold flex items-center justify-center shadow-lg shadow-red-500/20">
                          <X className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'users' && (
          <div className="space-y-4">
            <h3 className="font-bold text-lg">User Management</h3>
            <div className="space-y-3">
              {allUsers.map((user: any, idx: number) => (
                <div key={user.telegramUsername} className="glass p-4 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={user.photoUrl} alt="" className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-bold">{user.displayName}</p>
                        <p className="text-xs opacity-50">{user.telegramUsername}</p>
                        <p className="text-xs font-bold text-primary mt-1">Balance: ৳{user.balance}</p>
                        {(() => {
                          const userTrxs = transactions.filter((t: any) => t.userId === user.telegramUsername);
                          const lastTrx = userTrxs[0]; // Latest one
                          if (lastTrx) {
                            return (
                              <div className={`mt-2 p-2 rounded-xl border ${lastTrx.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                                <div className="flex justify-between items-center mb-1">
                                  <p className={`text-[10px] font-bold uppercase ${lastTrx.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {lastTrx.status === 'pending' ? 'Pending Trx' : 'Last Trx'}
                                  </p>
                                  <p className={`text-[10px] font-bold ${lastTrx.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                                    ৳{lastTrx.amount}
                                  </p>
                                </div>
                                <p className={`text-[10px] font-mono break-all ${lastTrx.status === 'pending' ? 'text-yellow-500' : 'text-green-500'}`}>
                                  ID: {lastTrx.transactionId}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this user?')) {
                          try {
                            const { error } = await supabase
                              .from('users')
                              .delete()
                              .eq('telegram_username', user.telegramUsername);
                            
                            if (error) throw error;
                            
                            setAllUsers(allUsers.filter((u: any) => u.telegramUsername !== user.telegramUsername));
                            if (profile && profile.telegramUsername === user.telegramUsername) {
                              setProfile(null);
                              localStorage.removeItem('strongagency_user');
                            }
                          } catch (error) {
                            console.error("Error deleting user:", error);
                            alert("ইউজার ডিলিট করতে সমস্যা হয়েছে।");
                          }
                        }
                      }}
                      className="p-2 text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold opacity-60 uppercase">Edit Balance</p>
                    <div className="flex space-x-2">
                      <input 
                        type="number" 
                        value={user.balance} 
                        onChange={(e) => {
                          const newUsers = [...allUsers];
                          newUsers[idx].balance = Number(e.target.value);
                          setAllUsers(newUsers);
                        }}
                        className="flex-1 p-3 rounded-xl glass border border-primary/20 outline-none focus:border-primary"
                      />
                      <button 
                        onClick={async () => {
                          try {
                            const { error } = await supabase
                              .from('users')
                              .update({ balance: user.balance })
                              .eq('telegram_username', user.telegramUsername);
                            
                            if (error) throw error;
                            
                            if (profile && profile.telegramUsername === user.telegramUsername) {
                              setProfile({ ...profile, balance: user.balance });
                            }
                            alert("ব্যালেন্স আপডেট করা হয়েছে।");
                          } catch (error) {
                            console.error("Error updating user balance:", error);
                            alert("ব্যালেন্স আপডেট করতে সমস্যা হয়েছে।");
                          }
                        }}
                        className="px-4 bg-primary text-white rounded-xl font-bold text-xs"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function AdminTabBtn({ active, icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all",
        active ? "bg-primary text-white shadow-lg" : "opacity-60"
      )}
    >
      {React.cloneElement(icon, { className: "w-4 h-4" })}
      <span className="text-sm font-bold">{label}</span>
    </button>
  );
}

function AdminInput({ label, value, onChange, isTextArea }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold opacity-60 uppercase ml-1">{label}</label>
      {isTextArea ? (
        <textarea 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 rounded-2xl glass border border-primary/20 outline-none focus:border-primary min-h-[100px]"
        />
      ) : (
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 rounded-2xl glass border border-primary/20 outline-none focus:border-primary"
        />
      )}
    </div>
  );
}

function ServiceEditor({ title, category, services, setServices }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('https://picsum.photos/seed/service/100/100');

  const addService = async () => {
    if (!newName || !newPrice) {
      alert("দয়া করে নাম এবং দাম লিখুন।");
      return;
    }

    const serviceId = `${category}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newService: ServiceItem = { 
      id: serviceId, 
      name: newName, 
      price: Number(newPrice), 
      category: category,
      image: category === 'smm' ? '' : (newImage || 'https://picsum.photos/seed/service/100/100'),
      isAvailable: true
    };

    try {
      const { error } = await supabase.from('services').insert([{
        id: newService.id,
        name: newService.name,
        price: newService.price,
        category: newService.category,
        image: newService.image,
        is_available: newService.isAvailable
      }]);

      if (error) throw error;
      
      // Use functional update to ensure we have the latest state
      setServices((prev: any) => [...prev, newService]);
      
      setIsAdding(false);
      setNewName('');
      setNewPrice('');
      setNewImage('https://picsum.photos/seed/service/100/100');
      alert("সার্ভিসটি সফলভাবে যুক্ত করা হয়েছে।");
    } catch (error: any) {
      console.error("Error adding service:", error);
      alert(`সার্ভিস যুক্ত করতে সমস্যা হয়েছে: ${error.message || 'Unknown error'}`);
    }
  };

  const deleteService = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই সার্ভিসটি ডিলিট করতে চান?')) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        setServices((prev: any) => prev.filter((s: any) => s.id !== id));
        alert("সার্ভিসটি ডিলিট করা হয়েছে।");
      } catch (error: any) {
        console.error("Error deleting service:", error);
        alert(`সার্ভিস ডিলিট করতে সমস্যা হয়েছে: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const startEditing = (service: any) => {
    setEditingId(service.id);
    setEditName(service.name);
    setEditPrice(service.price.toString());
    setEditImage(service.image || '');
  };

  const saveEdit = async () => {
    if (editingId) {
      try {
        const { error } = await supabase
          .from('services')
          .update({ name: editName, price: Number(editPrice), image: editImage })
          .eq('id', editingId);
        
        if (error) throw error;

        setServices((prev: any) => prev.map((s: any) => 
          s.id === editingId ? { ...s, name: editName, price: Number(editPrice), image: editImage } : s
        ));
        setEditingId(null);
        alert("সার্ভিসটি আপডেট করা হয়েছে।");
      } catch (error: any) {
        console.error("Error saving service edit:", error);
        alert(`সার্ভিস এডিট করতে সমস্যা হয়েছে: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const toggleAvailability = async (id: string) => {
    const service = services.find((s: any) => s.id === id);
    if (!service) return;

    const newStatus = service.isAvailable === false ? true : false;

    try {
      const { error } = await supabase
        .from('services')
        .update({ is_available: newStatus })
        .eq('id', id);
      
      if (error) throw error;

      setServices((prev: any) => prev.map((s: any) => 
        s.id === id ? { ...s, isAvailable: newStatus } : s
      ));
    } catch (error: any) {
      console.error("Error toggling availability:", error);
      alert(`অ্যাভেলেবিলিটি পরিবর্তন করতে সমস্যা হয়েছে: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className={cn("p-2 rounded-lg shadow-lg transition-all", isAdding ? "bg-red-500 text-white" : "bg-primary text-white")}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass p-4 rounded-2xl space-y-3 border border-primary/20">
              <p className="text-xs font-bold opacity-60 uppercase">Add New Service</p>
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="w-full p-3 rounded-xl glass border border-primary/20 outline-none focus:border-primary"
                placeholder="Service Name"
              />
              <input 
                type="number" 
                value={newPrice} 
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full p-3 rounded-xl glass border border-primary/20 outline-none focus:border-primary"
                placeholder="Price (৳)"
              />
              {category !== 'smm' && (
                <input 
                  type="text" 
                  value={newImage} 
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full p-3 rounded-xl glass border border-primary/20 outline-none focus:border-primary"
                  placeholder="Image URL"
                />
              )}
              <button 
                onClick={addService}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold shadow-lg"
              >
                Add Service
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {services.map((s: any) => (
          <div key={s.id} className="glass p-4 rounded-2xl space-y-3">
            {editingId === s.id ? (
              <div className="space-y-3">
                <input 
                  type="text" 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2 rounded-lg glass border border-primary/20 outline-none"
                  placeholder="Service Name"
                />
                <input 
                  type="number" 
                  value={editPrice} 
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full p-2 rounded-lg glass border border-primary/20 outline-none"
                  placeholder="Price"
                />
                <input 
                  type="text" 
                  value={editImage} 
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full p-2 rounded-lg glass border border-primary/20 outline-none"
                  placeholder="Image URL"
                />
                <div className="flex space-x-2">
                  <button onClick={saveEdit} className="flex-1 py-2 bg-green-500 text-white rounded-lg font-bold text-sm">Save</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-slate-500 text-white rounded-lg font-bold text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold">{s.name}</p>
                    <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase", s.isAvailable !== false ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                      {s.isAvailable !== false ? 'অ্যাভেলেবেল' : 'অ্যাভেলেবেল নেই'}
                    </span>
                  </div>
                  <p className="text-sm text-primary font-bold">৳{s.price}</p>
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => toggleAvailability(s.id)} 
                    className={cn("p-2 rounded-lg transition-colors", s.isAvailable !== false ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10")}
                    title={s.isAvailable !== false ? "Mark as Unavailable" : "Mark as Available"}
                  >
                    {s.isAvailable !== false ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>
                  <button onClick={() => startEditing(s)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteService(s.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick, isDarkMode }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void, isDarkMode: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center py-2 px-1 rounded-2xl transition-all duration-300 shadow-lg",
        active 
          ? "bg-primary text-white scale-105" 
          : (isDarkMode ? "bg-slate-900 text-white opacity-60" : "bg-white text-slate-900 opacity-60")
      )}
    >
      <div className={cn("mb-1")}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );
}

function ServiceCard({ image, title, onClick, isDarkMode }: { image: string, title: string, onClick: () => void, isDarkMode: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-2xl flex items-center justify-between transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm border",
        isDarkMode 
          ? "bg-slate-900/50 border-white/5 text-white" 
          : "bg-white border-slate-200 text-slate-900"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md">
          <img src={image} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <span className="font-bold text-lg">{title}</span>
      </div>
      <div className={cn("p-2 rounded-full", isDarkMode ? "bg-white/5" : "bg-slate-100")}>
        <ChevronRight className="w-5 h-5 text-primary" />
      </div>
    </button>
  );
}

function MethodBtn({ name, color, onClick, image, isDarkMode }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-4 rounded-3xl flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg border",
        color,
        isDarkMode ? "border-white/10" : "border-black/5"
      )}
    >
      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <span className="font-bold text-sm text-white">{name}</span>
    </button>
  );
}
