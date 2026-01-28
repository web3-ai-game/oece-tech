-- 插入示例用户数据
INSERT INTO users (email, name, password, role) VALUES
('admin@example.com', '管理员', '$2b$10$rQZ8kHWJ5R5Z1Z8Z8Z8Z8O7/8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'ADMIN'),
('user1@example.com', '张三', '$2b$10$rQZ8kHWJ5R5Z1Z8Z8Z8Z8O7/8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'USER'),
('user2@example.com', '李四', '$2b$10$rQZ8kHWJ5R5Z1Z8Z8Z8Z8O7/8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'USER'),
('user3@example.com', '王五', '$2b$10$rQZ8kHWJ5R5Z1Z8Z8Z8Z8O7/8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8', 'USER');

-- 插入示例文章数据
INSERT INTO posts (title, content, published, "authorId") VALUES
('欢迎使用Fluffy', '这是一个基于Google Cloud的全栈应用示例。', true, 1),
('项目架构介绍', '本项目采用Next.js + Node.js + PostgreSQL的技术栈。', true, 1),
('部署指南', '详细的Google Cloud部署步骤...', false, 1),
('用户指南', '如何使用本系统的各项功能。', true, 2);