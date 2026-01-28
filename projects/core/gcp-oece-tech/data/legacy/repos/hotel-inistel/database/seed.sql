-- Hotel Inistel PostgreSQL Seed Data
-- 初始化演示数据
-- 创建时间: 2024-09-24

-- 插入默认租户数据
INSERT INTO tenants (id, name, domain, settings) VALUES 
(1, 'Hotel Inistel Demo', 'demo.hotel-inistel.com', '{"currency": "USD", "timezone": "Asia/Bangkok", "language": "zh-CN", "max_rooms": 50, "max_users": 50}')
ON CONFLICT (id) DO NOTHING;

-- 重置序列
SELECT setval('tenants_id_seq', COALESCE((SELECT MAX(id) FROM tenants), 1));

-- 插入默认管理员用户
-- 密码: admin123 (已加密)
INSERT INTO users (tenant_id, username, email, password_hash, role, first_name, last_name) VALUES 
(1, 'admin', 'admin@hotel-inistel.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCO0KLLWxC6LJhcHpfC6lTKKzKS0YX6YkG', 'admin', 'System', 'Administrator'),
(1, 'manager', 'manager@hotel-inistel.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCO0KLLWxC6LJhcHpfC6lTKKzKS0YX6YkG', 'manager', 'Hotel', 'Manager'),
(1, 'staff', 'staff@hotel-inistel.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCO0KLLWxC6LJhcHpfC6lTKKzKS0YX6YkG', 'staff', 'Front Desk', 'Staff')
ON CONFLICT (tenant_id, email) DO NOTHING;

-- 插入房间类型
INSERT INTO room_types (tenant_id, name, description, base_price, max_occupancy, amenities) VALUES 
(1, '标准间', '舒适的标准双人间，配备现代化设施', 120.00, 2, '["免费WiFi", "空调", "液晶电视", "迷你吧", "保险箱", "吹风机"]'),
(1, '豪华间', '宽敞的豪华房间，享受优质服务体验', 200.00, 2, '["免费WiFi", "空调", "智能电视", "迷你吧", "阳台", "浴缸", "咖啡机", "保险箱"]'),
(1, '行政套房', '奢华套房，配备独立客厅和办公区域', 350.00, 4, '["免费WiFi", "空调", "智能电视", "迷你吧", "阳台", "按摩浴缸", "客厅", "小厨房", "办公桌", "保险箱"]'),
(1, '总统套房', '顶级奢华套房，尊享至臻服务', 800.00, 6, '["免费WiFi", "空调", "智能电视系统", "私人酒吧", "大阳台", "按摩浴缸", "独立客厅", "厨房", "办公室", "健身设备", "管家服务"]')
ON CONFLICT DO NOTHING;

-- 插入房间 (总共50间房，符合用户需求)
INSERT INTO rooms (tenant_id, room_number, room_type_id, floor, status) VALUES 
-- 1楼 - 标准间 (101-115)
(1, '101', 1, 1, 'available'), (1, '102', 1, 1, 'available'), (1, '103', 1, 1, 'occupied'), 
(1, '104', 1, 1, 'available'), (1, '105', 1, 1, 'available'), (1, '106', 1, 1, 'available'),
(1, '107', 1, 1, 'available'), (1, '108', 1, 1, 'maintenance'), (1, '109', 1, 1, 'available'),
(1, '110', 1, 1, 'available'), (1, '111', 1, 1, 'available'), (1, '112', 1, 1, 'available'),
(1, '113', 1, 1, 'occupied'), (1, '114', 1, 1, 'available'), (1, '115', 1, 1, 'available'),

-- 2楼 - 标准间和豪华间 (201-215)
(1, '201', 1, 2, 'available'), (1, '202', 1, 2, 'occupied'), (1, '203', 1, 2, 'available'),
(1, '204', 2, 2, 'available'), (1, '205', 2, 2, 'occupied'), (1, '206', 2, 2, 'available'),
(1, '207', 2, 2, 'available'), (1, '208', 2, 2, 'available'), (1, '209', 2, 2, 'available'),
(1, '210', 2, 2, 'occupied'), (1, '211', 2, 2, 'available'), (1, '212', 2, 2, 'available'),
(1, '213', 2, 2, 'available'), (1, '214', 2, 2, 'available'), (1, '215', 2, 2, 'available'),

-- 3楼 - 豪华间 (301-315)
(1, '301', 2, 3, 'available'), (1, '302', 2, 3, 'available'), (1, '303', 2, 3, 'occupied'),
(1, '304', 2, 3, 'available'), (1, '305', 2, 3, 'available'), (1, '306', 2, 3, 'available'),
(1, '307', 2, 3, 'available'), (1, '308', 2, 3, 'occupied'), (1, '309', 2, 3, 'available'),
(1, '310', 2, 3, 'available'), (1, '311', 2, 3, 'available'), (1, '312', 2, 3, 'available'),
(1, '313', 2, 3, 'available'), (1, '314', 2, 3, 'available'), (1, '315', 2, 3, 'available'),

-- 4楼 - 行政套房 (401-408)
(1, '401', 3, 4, 'available'), (1, '402', 3, 4, 'occupied'), (1, '403', 3, 4, 'available'),
(1, '404', 3, 4, 'available'), (1, '405', 3, 4, 'available'), (1, '406', 3, 4, 'available'),
(1, '407', 3, 4, 'available'), (1, '408', 3, 4, 'available'),

-- 5楼 - 总统套房 (501-502)
(1, '501', 4, 5, 'available'), (1, '502', 4, 5, 'occupied')
ON CONFLICT (tenant_id, room_number) DO NOTHING;

-- 插入演示客户
INSERT INTO customers (tenant_id, first_name, last_name, email, phone, nationality, id_number) VALUES 
(1, '张', '三', 'zhang.san@example.com', '+86-138-0013-8000', '中国', 'CN123456789'),
(1, 'John', 'Smith', 'john.smith@example.com', '+1-555-0123', '美国', 'US987654321'),
(1, '田中', '太郎', 'tanaka.taro@example.com', '+81-90-1234-5678', '日本', 'JP456789123'),
(1, 'Maria', 'Garcia', 'maria.garcia@example.com', '+34-666-123-456', '西班牙', 'ES789123456'),
(1, 'Kim', 'Min-jun', 'kim.minjun@example.com', '+82-10-1234-5678', '韩国', 'KR321654987')
ON CONFLICT DO NOTHING;

-- 插入演示预订
INSERT INTO bookings (tenant_id, customer_id, room_id, check_in_date, check_out_date, adults, children, total_amount, paid_amount, status, booking_source) VALUES 
(1, 1, 3, CURRENT_DATE, CURRENT_DATE + INTERVAL '3 days', 2, 0, 360.00, 360.00, 'checked_in', 'direct'),
(1, 2, 13, CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '2 days', 1, 0, 360.00, 180.00, 'checked_in', 'online'),
(1, 3, 18, CURRENT_DATE + INTERVAL '1 week', CURRENT_DATE + INTERVAL '10 days', 2, 1, 600.00, 0, 'confirmed', 'phone'),
(1, 4, 33, CURRENT_DATE + INTERVAL '2 weeks', CURRENT_DATE + INTERVAL '16 days', 2, 0, 400.00, 100.00, 'confirmed', 'email'),
(1, 5, 50, CURRENT_DATE + INTERVAL '1 month', CURRENT_DATE + INTERVAL '35 days', 4, 2, 4000.00, 1000.00, 'confirmed', 'travel_agent')
ON CONFLICT DO NOTHING;

-- 插入支付记录
INSERT INTO payments (tenant_id, booking_id, amount, payment_method, payment_status, transaction_id) VALUES 
(1, 1, 360.00, 'credit_card', 'completed', 'TXN001234567890'),
(1, 2, 180.00, 'cash', 'completed', 'CASH001234567'),
(1, 4, 100.00, 'bank_transfer', 'completed', 'BANK001234567'),
(1, 5, 1000.00, 'credit_card', 'completed', 'TXN009876543210')
ON CONFLICT DO NOTHING;

-- 插入维护记录
INSERT INTO maintenance_logs (tenant_id, room_id, issue_type, description, priority, status, assigned_to) VALUES 
(1, 8, '设备维修', '空调不制冷，需要检查制冷系统', 'high', 'in_progress', 3),
(1, 25, '清洁问题', '浴室排水不畅，需要疏通', 'medium', 'open', NULL),
(1, 40, '设施更换', '电视遥控器损坏，需要更换', 'low', 'resolved', 3)
ON CONFLICT DO NOTHING;

-- 插入客户评价
INSERT INTO reviews (tenant_id, booking_id, customer_id, rating, comment, is_public) VALUES 
(1, 1, 1, 5, '服务非常棒，房间很干净，位置也很好！强烈推荐！', TRUE),
(1, 2, 2, 4, 'Overall great experience. The staff was very helpful and the room was comfortable.', TRUE)
ON CONFLICT DO NOTHING;

-- 插入系统设置
INSERT INTO settings (tenant_id, key, value, description) VALUES 
(1, 'hotel_name', 'Hotel Inistel Demo', '酒店名称'),
(1, 'check_in_time', '14:00', '标准入住时间'),
(1, 'check_out_time', '12:00', '标准退房时间'),
(1, 'currency', 'USD', '默认货币'),
(1, 'tax_rate', '0.10', '税率 (10%)'),
(1, 'cancellation_policy', '24', '取消政策 (小时)'),
(1, 'max_advance_booking', '365', '最大提前预订天数'),
(1, 'contact_email', 'info@hotel-inistel.com', '联系邮箱'),
(1, 'contact_phone', '+66-2-123-4567', '联系电话'),
(1, 'address', '123 Sukhumvit Road, Bangkok, Thailand', '酒店地址')
ON CONFLICT (tenant_id, key) DO NOTHING;

-- 验证数据插入
SELECT 
    'Database seeded successfully!' as message,
    (SELECT COUNT(*) FROM tenants) as tenant_count,
    (SELECT COUNT(*) FROM users) as user_count,
    (SELECT COUNT(*) FROM rooms) as room_count,
    (SELECT COUNT(*) FROM room_types) as room_type_count,
    (SELECT COUNT(*) FROM customers) as customer_count,
    (SELECT COUNT(*) FROM bookings) as booking_count;
