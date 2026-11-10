import React, { useState, useMemo } from "react";
import {
  Users,
  Package,
  LayoutDashboard,
  Search,
  Plus,
  Edit,
  Trash2,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Grid,
  List,
  Filter,
  MoreVertical,
  Bell,
  ChevronDown,
  Shield,
  UserCheck,
  Tag,
} from "lucide-react";
import ProductModal from "./components/ProductModal";
import UserModal from "./components/UserModal";
import { useEffect } from "react";
import fetchProducts, {
  addNewProduct,
  deleteProduct,
  updateProduct,
} from "../api/productApi";
import fetchUsers from "../api/userApi";

export default function App() {
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'users' | 'products'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // CRUD State for Users
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // null = add, object = edit

  // CRUD State for Products
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");
  const [productViewMode, setProductViewMode] = useState("grid"); // 'grid' | 'table'
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  //-- product api

  useEffect(() => {
    const getProducts = async () => {
      try {
        const products = await fetchProducts();
        const users = await fetchUsers();
        setUsers(users);
        setProducts(products);
      } catch (error) {
        console.log("API Error:", error);
      }
    };
    getProducts();
  }, []);

  // --- HANDLERS FOR USERS ---
  const handleSaveUser = (userData) => {
    if (currentUser) {
      // Edit
      setUsers(
        users.map((u) => (u.id === currentUser.id ? { ...u, ...userData } : u)),
      );
    } else {
      // Add
      const newUser = {
        ...userData,
        id: Date.now(),
        avatar:
          userData.avatar ||
          `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      };
      setUsers([newUser, ...users]);
    }
    setIsUserModalOpen(false);
    setCurrentUser(null);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // --- HANDLERS FOR PRODUCTS ---
  const handleSaveProduct = async (productData) => {
    const stockNum = parseInt(productData.stock, 10) || 0;
    const status =
      stockNum === 0
        ? "Out of Stock"
        : stockNum < 15
          ? "Low Stock"
          : "In Stock";

    if (currentProduct) {
      // Edit

      const data = { ...productData, _id: currentProduct._id, status: status };

      const updatedProduct = await updateProduct(data);
      if (updatedProduct) {
        setProducts(
          products.map((p) =>
            p._id === currentProduct._id
              ? {
                  ...p,
                  ...productData,
                  price: parseFloat(productData.price),
                  stock: stockNum,
                  status,
                }
              : p,
          ),
        );
      }
    } else {
      // Add
      const payload = {
        ...productData,
        price: parseFloat(productData.price),
        stock: stockNum,
        status,
        image:
          productData.image ||
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300",
      };

      const newProduct = await addNewProduct(payload);

      setProducts((prev) => [newProduct, ...prev]);
    }

    setIsProductModalOpen(false);
    setCurrentProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    const response = await deleteProduct(id);
    
    if (response) {
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === "All" || u.role === userRoleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, userSearch, userRoleFilter]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(productSearch.toLowerCase());
      const matchesCat =
        productCategoryFilter === "All" || p.category === productCategoryFilter;
      return matchesQuery && matchesCat;
    });
  }, [products, productSearch, productCategoryFilter]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LAYOUT WRAPPER */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside
          className={`
          fixed lg:static  inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col justify-between transform 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}
        >
          <div>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                  E
                </div>
                <span className="font-bold text-lg tracking-wide text-slate-100">
                  EcomAdmin
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="p-4 space-y-1.5">
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Overview
              </button>

              <button
                onClick={() => {
                  setActiveTab("products");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "products"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Package className="w-5 h-5" />
                Products Management
              </button>

              <button
                onClick={() => {
                  setActiveTab("users");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "users"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Users className="w-5 h-5" />
                Users Management
              </button>
            </nav>
          </div>

          {/* User Footer Profile */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                alt="Admin Avatar"
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  Shiv Raj Singh
                </p>
                <p className="text-xs text-slate-400 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 h-screen flex flex-col min-w-0 overflow-hidden">
          {/* HEADER */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Header Search */}
              <div className="relative hidden sm:block w-64 lg:w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Global search..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Header Right Tools */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              <div className="h-6 w-px bg-slate-200"></div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt="Admin Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  Shiv Raj Singh
                </span>
              </div>
            </div>
          </header>

          {/* DYNAMIC TAB BODY */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 max-w-7xl mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    System Dashboard
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Welcome back, Shiv. Here is what is happening today.
                  </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total Users
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {users.length}
                      </h3>
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3.5 h-3.5" /> +12.5% this month
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total Products
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        {products.length}
                      </h3>
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3.5 h-3.5" /> +4 new added
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Total Sales
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        $0
                      </h3>
                      <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-2">
                        <TrendingUp className="w-3.5 h-3.5" /> +8.2% vs last
                        week
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Pending Orders
                      </p>
                      <h3 className="text-2xl font-bold text-slate-900 mt-1">
                        0
                      </h3>
                      <span className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-2">
                        Requires action
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Grid Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                      Recent Platform Activity
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          title: "New User Registered",
                          desc: "Eleanor Pena created an account.",
                          time: "10 mins ago",
                          icon: UserCheck,
                          color: "text-indigo-600 bg-indigo-50",
                        },
                        {
                          title: "Product Out of Stock",
                          desc: "Ergonomic Leather Desk Chair hit 0 stock.",
                          time: "1 hour ago",
                          icon: XCircle,
                          color: "text-rose-600 bg-rose-50",
                        },
                        {
                          title: "New Order Received",
                          desc: "Order #48293 placed for $299.99",
                          time: "3 hours ago",
                          icon: CheckCircle,
                          color: "text-emerald-600 bg-emerald-50",
                        },
                        {
                          title: "User Updated",
                          desc: "Wade Warren changed role to Editor.",
                          time: "5 hours ago",
                          icon: Shield,
                          color: "text-amber-600 bg-amber-50",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                        >
                          <div className={`p-2.5 rounded-xl ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                          <span className="text-xs text-slate-400">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stock Alert Summary */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 mb-4">
                        Stock Overview
                      </h2>
                      <div className="space-y-4">
                        {products.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="font-medium text-slate-700 truncate max-w-37.5">
                              {p.title}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                p.stock === 0
                                  ? "bg-rose-100 text-rose-700"
                                  : p.stock < 15
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                              }`}
                            >
                              {p.stock} units
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("products")}
                      className="mt-6 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Manage Inventory
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === "users" && (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      User Management
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage accounts, roles, and user statuses.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUser(null);
                      setIsUserModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add User
                  </button>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Filter className="w-4 h-4" /> Role:
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Roles</option>
                      <option value="Admin">Admin</option>
                      <option value="Editor">Editor</option>
                      <option value="Customer">Customer</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          <th className="py-3.5 px-6">User</th>
                          <th className="py-3.5 px-6">Role</th>
                          <th className="py-3.5 px-6">Status</th>
                          <th className="py-3.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="hover:bg-slate-50/80 transition-colors"
                            >
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-semibold text-slate-900">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === "Admin"
                                      ? "bg-indigo-100 text-indigo-800"
                                      : user.role === "Editor"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-4 px-6">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.status === "Active"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-rose-100 text-rose-800"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-600" : "bg-rose-600"}`}
                                  ></span>
                                  {user.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setCurrentUser(user);
                                      setIsUserModalOpen(true);
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-8 text-slate-400"
                            >
                              No users match your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      Product Catalog
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                      Manage catalog details, pricing, and inventory.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentProduct(null);
                      setIsProductModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>

                {/* Filters & View Toggle */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                      <Tag className="w-4 h-4" /> Category:
                    </div>
                    <select
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                      className="border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Categories</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Apparel">Apparel</option>
                    </select>

                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                    {/* View Switcher */}
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                      <button
                        onClick={() => setProductViewMode("grid")}
                        className={`p-1.5 rounded-lg transition-all ${productViewMode === "grid" ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProductViewMode("table")}
                        className={`p-1.5 rounded-lg transition-all ${productViewMode === "table" ? "bg-white shadow text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Products Grid View */}
                {productViewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                        >
                          <div>
                            <div className="h-48 w-full bg-slate-100 relative overflow-hidden">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-cover"
                              />
                              <span
                                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                  p.status === "In Stock"
                                    ? "bg-emerald-500 text-white"
                                    : p.status === "Low Stock"
                                      ? "bg-amber-500 text-white"
                                      : "bg-rose-500 text-white"
                                }`}
                              >
                                {p.status}
                              </span>
                            </div>
                            <div className="p-5">
                              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                {p.category}
                              </span>
                              <h3 className="font-bold text-slate-900 mt-2 text-base line-clamp-1">
                                {p.title}
                              </h3>
                              <div className="mt-4 flex items-center justify-between">
                                <span className="text-xl font-bold text-slate-900">
                                  ${p.price.toFixed(2)}
                                </span>
                                <span className="text-xs font-medium text-slate-500">
                                  Stock: {p.stock}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setCurrentProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
                        No products found matching filters.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Products Table View */
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="py-3.5 px-6">Product</th>
                            <th className="py-3.5 px-6">Category</th>
                            <th className="py-3.5 px-6">Price</th>
                            <th className="py-3.5 px-6">Stock</th>
                            <th className="py-3.5 px-6">Status</th>
                            <th className="py-3.5 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((p) => (
                              <tr
                                key={p.id}
                                className="hover:bg-slate-50/80 transition-colors"
                              >
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={p.image}
                                      alt={p.title}
                                      className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                                    />
                                    <span className="font-semibold text-slate-900">
                                      {p.title}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-slate-600">
                                  {p.category}
                                </td>
                                <td className="py-4 px-6 font-semibold text-slate-900">
                                  ${p.price.toFixed(2)}
                                </td>
                                <td className="py-4 px-6 text-slate-600">
                                  {p.stock}
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      p.status === "In Stock"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : p.status === "Low Stock"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {p.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setCurrentProduct(p);
                                        setIsProductModalOpen(true);
                                      }}
                                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p._id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="6"
                                className="text-center py-8 text-slate-400"
                              >
                                No products match your criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* USER MODAL (ADD / EDIT) */}
      {isUserModalOpen && (
        <UserModal
          user={currentUser}
          onClose={() => setIsUserModalOpen(false)}
          onSave={handleSaveUser}
        />
      )}

      {/* PRODUCT MODAL (ADD / EDIT) */}
      {isProductModalOpen && (
        <ProductModal
          product={currentProduct}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
