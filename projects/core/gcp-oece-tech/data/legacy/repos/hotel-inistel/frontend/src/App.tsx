import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } />
          {/* Hotel Management Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-6">仪表板</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
                  <p className="text-warm-600">欢迎使用 Hotel Inistel 酒店管理系统</p>
                  <p className="text-warm-500 mt-2">这是一个仪表板页面，显示酒店运营概览数据。</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-6">房间管理</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
                  <p className="text-warm-600">房间管理功能</p>
                  <p className="text-warm-500 mt-2">在这里可以管理酒店的所有房间信息、状态和分配。</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-6">预订管理</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
                  <p className="text-warm-600">预订管理系统</p>
                  <p className="text-warm-500 mt-2">管理客户预订、OTA对接和渠道管理。</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-6">客户管理</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
                  <p className="text-warm-600">客户关系管理</p>
                  <p className="text-warm-500 mt-2">管理会员系统、历史记录和积分管理。</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-3xl font-bold text-warm-800 mb-6">报表分析</h1>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
                  <p className="text-warm-600">数据分析和报表</p>
                  <p className="text-warm-500 mt-2">经营分析、趋势预测和决策支持。</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
