// معالجة تسجيل الدخول عبر Google
function handleGoogleSignIn(response) {
    // فك تشفير بيانات اعتماد Google
    const responsePayload = decodeJWT(response.credential);
    
    if (responsePayload) {
        // استخراج معلومات المستخدم
        const user = {
            id: responsePayload.sub,
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture,
            verified: responsePayload.email_verified
        };
        
        // حفظ بيانات المستخدم في التخزين المحلي
        saveUserToStorage(user);
        
        // تحديث واجهة المستخدم
        updateUIForAuthState(user);
        
        // إظهار رسالة ترحيب
        showNotification(`مرحباً ${user.name}! تم تسجيل الدخول بنجاح.`);
        
        // تحميل مواقع المستخدم
        loadUserSites();
    }
}

// فك تشفير JWT (بسيط - في الإنتاج استخدم مكتبة مناسبة)
function decodeJWT(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('خطأ في فك تشفير JWT:', error);
        return null;
    }
}

// تسجيل الخروج
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // مسح بيانات المستخدم من التخزين المحلي
            localStorage.removeItem('ai_website_user');
            
            // تحديث واجهة المستخدم
            updateUIForAuthState(null);
            
            // إعادة تحميل صفحة Google Sign-In
            if (window.google && google.accounts && google.accounts.id) {
                google.accounts.id.disableAutoSelect();
            }
            
            // إظهار رسالة
            showNotification('تم تسجيل الخروج بنجاح.');
        });
    }
});

// إظهار إشعار
function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // إضافة أنماط الإشعار
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            max-width: 400px;
            margin: 0 auto;
            background-color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            border-right: 4px solid #2ecc71;
        }
        
        .notification.error {
            border-right-color: #e74c3c;
        }
        
        .notification i {
            font-size: 1.2rem;
            color: #2ecc71;
        }
        
        .notification.error i {
            color: #e74c3c;
        }
        
        .notification span {
            flex: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: #7f8c8d;
            cursor: pointer;
            font-size: 1rem;
        }
        
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // إضافة حدث إغلاق الإشعار
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    // إزالة الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}
