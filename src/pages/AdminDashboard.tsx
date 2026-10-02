import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Package, 
  Flag, 
  Ban, 
  LogOut, 
  Check, 
  Trash2, 
  UserX, 
  Users, 
  Store, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Laptop,
  Utensils,
  Shirt,
  GraduationCap
} from 'lucide-react';
import Logo from '../components/Logo';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

interface ListingItem {
  id: string;
  title: string;
  seller: string;
  sellerName: string;
  price: number;
  category: 'Textbooks' | 'Electronics' | 'Cafeteria Food' | 'Thrift' | 'Campus Services';
  status: 'Live' | 'Under Review' | 'Flagged';
  date: string;
  reportReason?: string;
}

interface SellerApproval {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  submittedDate: string;
  idCardVerified: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onLogout, 
  onNavigateHome 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'moderation' | 'approvals' | 'reports' | 'banned'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Live' | 'Under Review' | 'Flagged'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Mock Moderation Data
  const [listings, setListings] = useState<ListingItem[]>([
    {
      id: 'LST-101',
      title: 'CSE207 Data Structures (Seymour Lipschutz) - Like New',
      seller: '2022-1-60-019@ewubd.edu',
      sellerName: 'Tanvir Ahmed',
      price: 350,
      category: 'Textbooks',
      status: 'Live',
      date: 'Today, 10:15 AM'
    },
    {
      id: 'LST-102',
      title: 'EWU Cafeteria 5-Day Lunch Meal Tokens (Discounted)',
      seller: '2023-2-10-112@ewubd.edu',
      sellerName: 'Farhana Kabir',
      price: 480,
      category: 'Cafeteria Food',
      status: 'Under Review',
      date: 'Today, 11:30 AM'
    },
    {
      id: 'LST-103',
      title: 'Casio fx-991EX ClassWiz Engineering Calculator',
      seller: '2021-3-80-045@ewubd.edu',
      sellerName: 'Sadman Sakib',
      price: 1800,
      category: 'Electronics',
      status: 'Live',
      date: 'Yesterday'
    },
    {
      id: 'LST-104',
      title: 'EWU Pharmacy Lab Coat (Size L) & Safety Goggles',
      seller: '2024-1-70-089@ewubd.edu',
      sellerName: 'Nusrat Jahan',
      price: 450,
      category: 'Thrift',
      status: 'Under Review',
      date: 'Yesterday'
    },
    {
      id: 'LST-105',
      title: 'Unauthorized Midterm Exam Solution Cheatsheet Bundle',
      seller: '2020-2-30-551@ewubd.edu',
      sellerName: 'Unknown Student',
      price: 1200,
      category: 'Campus Services',
      status: 'Flagged',
      date: 'Oct 01, 2026',
      reportReason: 'Academic dishonesty violation reported by 4 students'
    },
    {
      id: 'LST-106',
      title: 'MAT101 Differential Calculus (Anton Bivens Davis 10th Ed)',
      seller: '2023-1-60-310@ewubd.edu',
      sellerName: 'Arafat Hossain',
      price: 280,
      category: 'Textbooks',
      status: 'Live',
      date: 'Sep 30, 2026'
    },
    {
      id: 'LST-107',
      title: 'Wacom One Drawing Tablet for Graphic Design / UI',
      seller: '2022-2-40-108@ewubd.edu',
      sellerName: 'Mahir Faisal',
      price: 4200,
      category: 'Electronics',
      status: 'Live',
      date: 'Sep 29, 2026'
    }
  ]);

  // Mock Seller Approvals
  const [approvals, setApprovals] = useState<SellerApproval[]>([
    {
      id: 'APP-01',
      name: 'Rashedul Islam',
      email: '2023-1-60-888@ewubd.edu',
      studentId: '2023-1-60-888',
      department: 'Computer Science & Engineering',
      submittedDate: 'Oct 02, 2026',
      idCardVerified: true
    },
    {
      id: 'APP-02',
      name: 'Sumaiya Rahman',
      email: '2024-2-10-333@ewubd.edu',
      studentId: '2024-2-10-333',
      department: 'Business Administration (BBA)',
      submittedDate: 'Oct 02, 2026',
      idCardVerified: true
    },
    {
      id: 'APP-03',
      name: 'Zawad Tahmid',
      email: '2022-3-50-201@ewubd.edu',
      studentId: '2022-3-50-201',
      department: 'Electrical & Electronic Engineering',
      submittedDate: 'Oct 01, 2026',
      idCardVerified: false
    }
  ]);

  // Mock Banned Users
  const [bannedUsers, setBannedUsers] = useState([
    {
      email: '2019-1-10-001@ewubd.edu',
      name: 'Spam Account',
      reason: 'Repeated non-campus external commercial spamming',
      bannedDate: 'Sep 28, 2026'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleApproveListing = (id: string) => {
    setListings(prev => prev.map(item => item.id === id ? { ...item, status: 'Live' } : item));
    showToast(`Listing ${id} approved and is now Live.`);
  };

  const handleRemoveListing = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
    showToast(`Listing ${id} has been permanently removed from marketplace.`);
  };

  const handleBanSeller = (sellerEmail: string, sellerName: string) => {
    if (!bannedUsers.some(u => u.email === sellerEmail)) {
      setBannedUsers(prev => [
        ...prev,
        {
          email: sellerEmail,
          name: sellerName,
          reason: 'Banned by Admin for safety policy violation',
          bannedDate: 'Just now'
        }
      ]);
    }
    setListings(prev => prev.filter(item => item.seller !== sellerEmail));
    showToast(`Seller ${sellerEmail} has been banned and all their listings removed.`);
  };

  const handleApproveSeller = (id: string, name: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    showToast(`Seller account for ${name} has been verified and activated.`);
  };

  const handleRejectSeller = (id: string, name: string) => {
    setApprovals(prev => prev.filter(a => a.id !== id));
    showToast(`Application for ${name} has been rejected.`);
  };

  // Filtered Listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Textbooks': return <BookOpen className="w-3.5 h-3.5 text-blue-600" />;
      case 'Electronics': return <Laptop className="w-3.5 h-3.5 text-purple-600" />;
      case 'Cafeteria Food': return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
      case 'Thrift': return <Shirt className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Campus Services': return <GraduationCap className="w-3.5 h-3.5 text-teal-600" />;
      default: return <Package className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: 'Live' | 'Under Review' | 'Flagged') => {
    switch (status) {
      case 'Live':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Live</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Under Review</span>
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Flagged</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 antialiased selection:bg-[#00A86B] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F2C59] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400/40 animate-in fade-in slide-in-from-top-4">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#0B192C] text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800">
        
        {/* Sidebar Brand Header */}
        <div>
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Logo size="md" showTagline={true} />
          </div>

          <div className="px-4 py-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
              Management Modules
            </span>
          </div>

          {/* Navigation Items (LUCIDE ICONS ONLY) */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0F2C59] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                <span>Overview</span>
              </div>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-600'}`} />
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'approvals'
                  ? 'bg-[#0F2C59] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pending Seller Approvals</span>
              </div>
              {approvals.length > 0 && (
                <span className="bg-[#00A86B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {approvals.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('moderation')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'moderation'
                  ? 'bg-[#0F2C59] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-emerald-400" />
                <span>Listing Moderation</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {listings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-[#0F2C59] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-amber-400" />
                <span>Reported Items</span>
              </div>
              {listings.filter(i => i.status === 'Flagged').length > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {listings.filter(i => i.status === 'Flagged').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('banned')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'banned'
                  ? 'bg-[#0F2C59] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Ban className="w-4 h-4 text-red-400" />
                <span>Banned Users</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {bannedUsers.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Link */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Marketplace</span>
          </button>

          <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
            </span>
            <span className="text-slate-500 font-mono">v1.5.0</span>
          </div>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h1 className="text-xl font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
              <span>EWmart Safety & Control Center</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              East West University Verified Student Operations
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Admin profile pill */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
              <div className="w-6 h-6 rounded-full bg-[#0F2C59] text-white flex items-center justify-center text-[10px] font-bold">
                AD
              </div>
              <span>admin@ewubd.edu</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* 3. OVERVIEW STAT CARDS GRID (4 Cards with Lucide Icons) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Total Active Listings */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Total Active Listings
                </p>
                <h3 className="text-2xl font-black text-[#0F2C59] tracking-tight">
                  {listings.filter(i => i.status === 'Live').length + 1420}
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> +38 added today
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center shrink-0">
                <Package className="w-6 h-6" />
              </div>
            </div>

            {/* Card 2: Total Verified EWU Students */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Verified EWU Students
                </p>
                <h3 className="text-2xl font-black text-[#0F2C59] tracking-tight">
                  2,418
                </h3>
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3 text-[#00A86B]" /> 100% @ewubd.edu
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#00A86B]/10 text-[#00A86B] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Card 3: Pending Flagged Items */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Pending Flagged Items
                </p>
                <h3 className="text-2xl font-black text-[#0F2C59] tracking-tight">
                  {listings.filter(i => i.status === 'Flagged').length}
                </h3>
                <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3 h-3" /> Requires immediate action
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Flag className="w-6 h-6" />
              </div>
            </div>

            {/* Card 4: Active Sellers */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Active Campus Sellers
                </p>
                <h3 className="text-2xl font-black text-[#0F2C59] tracking-tight">
                  486
                </h3>
                <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-1">
                  <Store className="w-3 h-3" /> In Aftabnagar campus
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                <Store className="w-6 h-6" />
              </div>
            </div>

          </section>

          {/* TAB 1 & 2: LISTING MODERATION TABLE */}
          {(activeTab === 'overview' || activeTab === 'moderation') && (
            <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              
              {/* Table Header Controls */}
              <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#00A86B]" />
                    <span>Listing Moderation Queue</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Review, approve, or take down student listings
                  </p>
                </div>

                {/* Filter and Search */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search box */}
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search title, seller, ID..."
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F2C59]/10 focus:border-[#0F2C59]"
                    />
                  </div>

                  {/* Status filter buttons */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    {(['All', 'Live', 'Under Review', 'Flagged'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setStatusFilter(tab)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          statusFilter === tab
                            ? 'bg-white text-[#0F2C59] shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-6">Item Title</th>
                      <th className="py-3.5 px-4">Seller (@ewubd.edu)</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredListings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-medium">
                          No listings found matching your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredListings.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          
                          {/* Item Title */}
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900 max-w-xs truncate" title={item.title}>
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>ID: {item.id}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>
                            {item.reportReason && (
                              <div className="mt-1.5 text-[11px] text-red-600 font-semibold flex items-center gap-1 bg-red-50 p-1.5 rounded-lg">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>{item.reportReason}</span>
                              </div>
                            )}
                          </td>

                          {/* Seller */}
                          <td className="py-4 px-4">
                            <div className="font-bold text-slate-900">{item.sellerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{item.seller}</div>
                          </td>

                          {/* Price */}
                          <td className="py-4 px-4">
                            <span className="font-bold text-[#0F2C59] text-sm">৳{item.price.toLocaleString()}</span>
                          </td>

                          {/* Category with Lucide Icon */}
                          <td className="py-4 px-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                              {getCategoryIcon(item.category)}
                              <span>{item.category}</span>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4">
                            {getStatusBadge(item.status)}
                          </td>

                          {/* Action Buttons per row */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              
                              {/* Approve Button (Green outline button with Check icon) */}
                              {item.status !== 'Live' && (
                                <button
                                  onClick={() => handleApproveListing(item.id)}
                                  title="Approve listing"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500 text-emerald-700 bg-white hover:bg-emerald-50 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Approve</span>
                                </button>
                              )}

                              {/* Remove Item Button (Red outline button with Trash2 icon) */}
                              <button
                                onClick={() => handleRemoveListing(item.id)}
                                title="Remove listing from marketplace"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-red-400 text-red-700 bg-white hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                <span>Remove</span>
                              </button>

                              {/* Ban Seller Button (Dark Red button with UserX icon) */}
                              <button
                                onClick={() => handleBanSeller(item.seller, item.sellerName)}
                                title="Ban seller account from platform"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              >
                                <UserX className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Ban Seller</span>
                              </button>

                            </div>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Showing {filteredListings.length} of {listings.length} moderation records</span>
                <span className="font-semibold text-slate-600">All actions logged with @ewubd.edu administrative audit trail</span>
              </div>

            </section>
          )}

          {/* TAB 3: PENDING SELLER APPROVALS */}
          {activeTab === 'approvals' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00A86B]" />
                  <span>Pending EWU Student Seller Verifications</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Verify student identification cards prior to issuing seller rights
                </p>
              </div>

              {approvals.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium">
                  No pending seller approvals. All student applications have been reviewed!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvals.map(app => (
                    <div key={app.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-[#0F2C59] bg-[#0F2C59]/10 px-2 py-0.5 rounded-md">
                            {app.department}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {app.submittedDate}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base">{app.name}</h4>
                        <p className="text-xs text-slate-600 font-mono mt-0.5">{app.email}</p>
                        <p className="text-xs text-slate-500 mt-1">Student ID: <span className="font-bold text-slate-700">{app.studentId}</span></p>

                        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                          <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                          <span>EWU Portal ID Match Verified</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        <button
                          onClick={() => handleApproveSeller(app.id, app.name)}
                          className="flex-1 bg-[#00A86B] hover:bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Seller</span>
                        </button>
                        <button
                          onClick={() => handleRejectSeller(app.id, app.name)}
                          className="px-3 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 4: REPORTED ITEMS */}
          {activeTab === 'reports' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
                  <Flag className="w-5 h-5 text-amber-500" />
                  <span>Reported Listings Queue</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Items flagged by EWU students for safety, price gouging, or policy breaches
                </p>
              </div>

              {listings.filter(i => i.status === 'Flagged').length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm font-medium">
                  No flagged items pending review. All reports resolved!
                </div>
              ) : (
                <div className="space-y-3">
                  {listings.filter(i => i.status === 'Flagged').map(item => (
                    <div key={item.id} className="p-4 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold">
                            Policy Breach Report
                          </span>
                          <span className="text-xs text-slate-500">{item.id}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base mt-1">{item.title}</h4>
                        <p className="text-xs text-red-700 font-semibold mt-0.5">Reason: {item.reportReason}</p>
                        <p className="text-xs text-slate-500 mt-1">Listed by {item.sellerName} ({item.seller}) • ৳{item.price}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRemoveListing(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Listing</span>
                        </button>
                        <button
                          onClick={() => handleBanSeller(item.seller, item.sellerName)}
                          className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Ban User</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 5: BANNED USERS */}
          {activeTab === 'banned' && (
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-[#0F2C59] tracking-tight flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-600" />
                  <span>Banned Student Accounts</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Accounts blocked from posting, selling, or interacting on the campus marketplace
                </p>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {bannedUsers.map((user, idx) => (
                  <div key={idx} className="p-4 bg-white flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{user.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                      <p className="text-xs text-red-600 font-medium mt-0.5">Reason: {user.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded-full">
                        Banned
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{user.bannedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
