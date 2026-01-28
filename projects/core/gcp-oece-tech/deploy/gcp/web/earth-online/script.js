// ================================
// 地球 Online - JavaScript 交互
// ================================

// 頁面加載完成
window.addEventListener('DOMContentLoaded', () => {
    initMatrixBackground();
    initCounters();
    initScrollEffects();
    hideLoadingScreen();
});

// ================================
// Matrix 背景動畫
// ================================

function initMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00f3ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
    
    // 響應式調整
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ================================
// 數字滾動計數器
// ================================

function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target % 1 === 0 ? target : target.toFixed(1);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

// ================================
// 滾動效果
// ================================

function initScrollEffects() {
    // 卡片進入動畫
    const cards = document.querySelectorAll('.experiment-card, .feature-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
    
    // 導航欄背景
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 243, 255, 0.2)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// ================================
// 頁面導航
// ================================

function scrollToExperiments() {
    document.getElementById('experiments').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    closeMobileMenu();
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    closeMobileMenu();
}

// ================================
// 移動端菜單
// ================================

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.querySelector('.mobile-menu-btn');
    
    menu.classList.toggle('active');
    btn.classList.toggle('active');
    
    // 動畫效果
    const spans = btn.querySelectorAll('span');
    if (menu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const btn = document.querySelector('.mobile-menu-btn');
    
    menu.classList.remove('active');
    btn.classList.remove('active');
    
    const spans = btn.querySelectorAll('span');
    spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

// ================================
// 認證頁面
// ================================

function showAuth(type) {
    const authSection = document.getElementById('auth-section');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    authSection.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

function hideAuth() {
    const authSection = document.getElementById('auth-section');
    authSection.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchAuth(type) {
    event.preventDefault();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// ================================
// 表單處理
// ================================

function handleLogin(event) {
    event.preventDefault();
    
    showNotification('🔄 正在連線...', 'info');
    
    // 模擬登錄
    setTimeout(() => {
        showNotification('✅ 連線成功！歡迎回到地球 Online', 'success');
        hideAuth();
        
        // 這裡應該調用實際的登錄 API
        // const formData = new FormData(event.target);
        // loginUser(formData);
    }, 1500);
}

function handleRegister(event) {
    event.preventDefault();
    
    showNotification('🔄 正在創建賽博身份...', 'info');
    
    // 模擬註冊
    setTimeout(() => {
        showNotification('✅ 註冊成功！開始你的實驗之旅', 'success');
        hideAuth();
        
        // 這裡應該調用實際的註冊 API
        // const formData = new FormData(event.target);
        // registerUser(formData);
    }, 2000);
}

// ================================
// 實驗啟動
// ================================

function startExperiment(type) {
    showNotification('🚀 啟動實驗: ' + type, 'info');
    
    // 這裡應該跳轉到實驗頁面
    setTimeout(() => {
        window.location.href = `/experiments/${type}`;
    }, 1000);
}

// ================================
// 通知系統
// ================================

function showNotification(message, type = 'info') {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 樣式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        padding: '1rem 1.5rem',
        background: type === 'success' ? '#00ff88' : 
                    type === 'error' ? '#ff006e' : '#00f3ff',
        color: '#0a0a0f',
        borderRadius: '0.5rem',
        fontWeight: '700',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 10px 30px rgba(0, 243, 255, 0.5)'
    });
    
    document.body.appendChild(notification);
    
    // 3秒後移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ================================
// Demo 播放
// ================================

function playDemo() {
    showNotification('📺 正在加載演示視頻...', 'info');
    
    // 創建視頻彈窗
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-container">
            <button class="close-video" onclick="closeVideoModal()">✕</button>
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    
    Object.assign(modal.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        zIndex: '9999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
    });
    
    const container = modal.querySelector('.video-container');
    Object.assign(container.style, {
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        aspectRatio: '16/9',
        background: '#000',
        borderRadius: '1rem',
        overflow: 'hidden'
    });
    
    const closeBtn = modal.querySelector('.close-video');
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '-50px',
        right: '0',
        width: '40px',
        height: '40px',
        background: '#00f3ff',
        border: 'none',
        borderRadius: '50%',
        color: '#0a0a0f',
        fontSize: '1.5rem',
        cursor: 'pointer',
        zIndex: '10'
    });
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// ================================
// 加載屏幕
// ================================

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

// ================================
// 快捷鍵
// ================================

document.addEventListener('keydown', (e) => {
    // ESC 關閉彈窗
    if (e.key === 'Escape') {
        hideAuth();
        closeVideoModal();
    }
    
    // Ctrl/Cmd + K 打開搜索（未來功能）
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showNotification('🔍 搜索功能即將推出', 'info');
    }
});

// ================================
// 滾動進度條（可選）
// ================================

window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // 可以添加一個進度條元素來顯示
    // document.getElementById('progress-bar').style.width = scrolled + '%';
});

// ================================
// 性能優化 - 節流函數
// ================================

function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ================================
// Analytics（未來集成）
// ================================

function trackEvent(category, action, label) {
    // Google Analytics 或其他分析工具
    console.log('Track Event:', category, action, label);
    
    // 示例:
    // gtag('event', action, {
    //     event_category: category,
    //     event_label: label
    // });
}

// ================================
// Service Worker（PWA支持）
// ================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// ================================
// 複製到剪貼板
// ================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 已複製到剪貼板', 'success');
    }).catch(err => {
        showNotification('❌ 複製失敗', 'error');
    });
}

// ================================
// 分享功能
// ================================

async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            showNotification('✅ 分享成功', 'success');
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('分享失敗:', err);
            }
        }
    } else {
        // 備選方案：複製鏈接
        copyToClipboard(url);
    }
}

// ================================
// 深色/淺色模式切換（未來功能）
// ================================

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');
    
    const theme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    
    showNotification(`🎨 已切換到${theme === 'light' ? '淺色' : '深色'}模式`, 'info');
}

// ================================
// 頁面可見性 API
// ================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 頁面隱藏時暫停動畫以節省資源
        console.log('Page hidden - pausing animations');
    } else {
        // 頁面可見時恢復動畫
        console.log('Page visible - resuming animations');
    }
});

// ================================
// 錯誤處理
// ================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // 可以發送錯誤報告到服務器
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // 可以發送錯誤報告到服務器
});

console.log('🌍 地球 Online 已啟動');
console.log('Version: 1.0.0');
console.log('Powered by Gemini AI + GCP');
