'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        setError('Failed to fetch users')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        欢迎使用 Fluffy
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">项目特点</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary-600">轻量级架构</h3>
            <p className="text-gray-600 mt-2">专为50用户规模设计的简洁架构</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary-600">Google Cloud</h3>
            <p className="text-gray-600 mt-2">基于GCP的可靠云服务</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary-600">现代技术栈</h3>
            <p className="text-gray-600 mt-2">Next.js + Node.js + PostgreSQL</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">用户列表</h2>
        {loading && <p>加载中...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="space-y-2">
            {users.length > 0 ? (
              users.map(user => (
                <div key={user.id} className="p-3 border rounded hover:bg-gray-50">
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">暂无用户数据</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}