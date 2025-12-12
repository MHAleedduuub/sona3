// التحكم في التنقل بين الأقسام
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة التطبيق
    initApp();
    
    // إدارة التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // تحديث الروابط النشطة
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // إظهار القسم المحدد وإخفاء الآخرين
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
            
            // إذا كان القسم هو "استكشاف"، قم بتحميل المواقع المنشورة
            if (targetId === 'explore') {
                loadPublishedSites();
            }
            
            // إذا كان القسم هو "مواقعي"، قم بتحميل مواقع المستخدم
            if (targetId === 'my-sites') {
                loadUserSites();
            }
        });
    });
    
    // زر البدء بالبناء
    const startBuildingBtn = document.getElementById('start-building');
    if (startBuildingBtn) {
        startBuildingBtn.addEventListener('click', function() {
            // الانتقال إلى قسم البناء
            document.querySelector('a[href="#builder"]').click();
        });
    }
    
    // زر إنشاء أول موقع
    const createFirstSiteBtn = document.getElementById('create-first-site');
    if (createFirstSiteBtn) {
        createFirstSiteBtn.addEventListener('click', function() {
            document.querySelector('a[href="#builder"]').click();
        });
    }
    
    // عداد الأحرف في وصف الموقع
    const siteDescription = document.getElementById('site-description');
    const charCount = document.getElementById('char-count');
    
    if (siteDescription && charCount) {
        siteDescription.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
    
    // التحكم في محرر الكود
    const editorTabs = document.querySelectorAll('.editor-tab');
    const codeEditors = document.querySelectorAll('.code-editor');
    
    editorTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // تحديث التبويبات النشطة
            editorTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // إظهار محرر الكود المناسب
            codeEditors.forEach(editor => {
                if (editor.id === `${tabName}-editor`) {
                    editor.classList.add('active');
                } else {
                    editor.classList.remove('active');
                }
            });
        });
    });
    
    // إغلاق محرر الكود
    const closeEditorBtn = document.getElementById('close-editor');
    if (closeEditorBtn) {
        closeEditorBtn.addEventListener('click', function() {
            document.getElementById('code-editor-section').classList.add('hidden');
        });
    }
    
    // فتح محرر الكود
    const editCodeBtn = document.getElementById('edit-code');
    if (editCodeBtn) {
        editCodeBtn.addEventListener('click', function() {
            document.getElementById('code-editor-section').classList.remove('hidden');
        });
    }
    
    // تحديث المعاينة من محرر الكود
    const updatePreviewBtn = document.getElementById('update-preview');
    if (updatePreviewBtn) {
        updatePreviewBtn.addEventListener('click', updatePreviewFromEditor);
    }
    
    // إدارة النافذة المنبثقة للنشر
    const publishModal = document.getElementById('publish-modal');
    const closePublishModalBtn = document.getElementById('close-publish-modal');
    const cancelPublishBtn = document.getElementById('cancel-publish');
    
    if (closePublishModalBtn) {
        closePublishModalBtn.addEventListener('click', function() {
            publishModal.classList.add('hidden');
        });
    }
    
    if (cancelPublishBtn) {
        cancelPublishBtn.addEventListener('click', function() {
            publishModal.classList.add('hidden');
        });
    }
    
    // زر النشر
    const publishSiteBtn = document.getElementById('publish-site');
    if (publishSiteBtn) {
        publishSiteBtn.addEventListener('click', function() {
            // التحقق من تسجيل الدخول أولاً
            const user = getUserFromStorage();
            if (!user) {
                alert('يجب تسجيل الدخول أولاً لنشر موقعك');
                return;
            }
            
            // فتح نافذة النشر
            publishModal.classList.remove('hidden');
        });
    }
    
    // تأكيد النشر
    const confirmPublishBtn = document.getElementById('confirm-publish');
    if (confirmPublishBtn) {
        confirmPublishBtn.addEventListener('click', publishSite);
    }
    
    // زر حفظ الموقع
    const saveSiteBtn = document.getElementById('save-site');
    if (saveSiteBtn) {
        saveSiteBtn.addEventListener('click', saveSite);
    }
    
    // زر توليد الموقع باستخدام الذكاء الاصطناعي
    const generateSiteBtn = document.getElementById('generate-site');
    if (generateSiteBtn) {
        generateSiteBtn.addEventListener('click', generateSiteWithAI);
    }
    
    // تحميل المواقع المنشورة عند فتح صفحة الاستكشاف
    if (window.location.hash === '#explore') {
        loadPublishedSites();
    }
});

// تهيئة التطبيق
function initApp() {
    // التحقق من حالة تسجيل الدخول
    const user = getUserFromStorage();
    updateUIForAuthState(user);
    
    // تحميل مواقع المستخدم إذا كان مسجلاً دخولاً
    if (user) {
        loadUserSites();
    }
}

// تحديث واجهة المستخدم بناءً على حالة المصادقة
function updateUIForAuthState(user) {
    const userInfo = document.getElementById('user-info');
    const loginSection = document.getElementById('login-section');
    
    if (user) {
        // إظهار معلومات المستخدم وإخفاء قسم تسجيل الدخول
        if (userInfo && loginSection) {
            userInfo.classList.remove('hidden');
            loginSection.classList.add('hidden');
            
            // تحديث صورة واسم المستخدم
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            
            if (userAvatar) userAvatar.src = user.picture || 'https://via.placeholder.com/40';
            if (userName) userName.textContent = user.name;
        }
        
        // تفعيل أزرار الحفظ والنشر
        const saveBtn = document.getElementById('save-site');
        const publishBtn = document.getElementById('publish-site');
        
        if (saveBtn) saveBtn.disabled = false;
        if (publishBtn) publishBtn.disabled = false;
    } else {
        // إخفاء معلومات المستخدم وإظهار قسم تسجيل الدخول
        if (userInfo && loginSection) {
            userInfo.classList.add('hidden');
            loginSection.classList.remove('hidden');
        }
        
        // تعطيل أزرار الحفظ والنشر
        const saveBtn = document.getElementById('save-site');
        const publishBtn = document.getElementById('publish-site');
        
        if (saveBtn) saveBtn.disabled = true;
        if (publishBtn) publishBtn.disabled = true;
    }
}

// الحصول على بيانات المستخدم من التخزين المحلي
function getUserFromStorage() {
    const userData = localStorage.getItem('ai_website_user');
    return userData ? JSON.parse(userData) : null;
}

// حفظ بيانات المستخدم في التخزين المحلي
function saveUserToStorage(user) {
    localStorage.setItem('ai_website_user', JSON.stringify(user));
}

// تحديث المعاينة من محرر الكود
function updatePreviewFromEditor() {
    const htmlCode = document.getElementById('html-editor').value;
    const cssCode = document.getElementById('css-editor').value;
    const jsCode = document.getElementById('js-editor').value;
    
    // إنشاء كود HTML كامل
    const fullHTML = `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>${cssCode}</style>
        </head>
        <body>
            ${htmlCode}
            <script>${jsCode}<\/script>
        </body>
        </html>
    `;
    
    // تحديث المعاينة
    const previewFrame = document.getElementById('site-preview');
    const previewPlaceholder = document.getElementById('preview-placeholder');
    
    if (previewFrame && previewPlaceholder) {
        previewFrame.srcdoc = fullHTML;
        previewPlaceholder.classList.add('hidden');
        previewFrame.classList.remove('hidden');
    }
}

// نشر الموقع
function publishSite() {
    const user = getUserFromStorage();
    if (!user) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }
    
    const siteUrl = document.getElementById('publish-url').value;
    const siteDescription = document.getElementById('publish-description').value;
    const privacySetting = document.querySelector('input[name="privacy"]:checked').value;
    
    if (!siteUrl) {
        alert('يرجى إدخال رابط للموقع');
        return;
    }
    
    // الحصول على بيانات الموقع الحالي
    const siteTitle = document.getElementById('site-title').value || 'موقع بدون عنوان';
    const siteCategory = document.getElementById('site-category').value;
    
    const htmlCode = document.getElementById('html-editor').value;
    const cssCode = document.getElementById('css-editor').value;
    const jsCode = document.getElementById('js-editor').value;
    
    if (!htmlCode) {
        alert('لا يوجد موقع ليتم نشره. يرجى إنشاء موقع أولاً.');
        return;
    }
    
    // إنشاء كائن الموقع
    const siteData = {
        id: generateId(),
        title: siteTitle,
        description: siteDescription,
        category: siteCategory,
        url: siteUrl,
        privacy: privacySetting,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        author: {
            id: user.id,
            name: user.name,
            picture: user.picture
        },
        createdAt: new Date().toISOString(),
        views: 0,
        likes: 0
    };
    
    // في تطبيق حقيقي، هنا سيكون هناك طلب إلى الخادم
    // لكن لأغراض العرض، سنستخدم التخزين المحلي
    
    // حفظ الموقع المنشور محلياً
    let publishedSites = JSON.parse(localStorage.getItem('published_sites') || '[]');
    publishedSites.push(siteData);
    localStorage.setItem('published_sites', JSON.stringify(publishedSites));
    
    // حفظ الموقع في قائمة مواقع المستخدم
    let userSites = JSON.parse(localStorage.getItem(`user_sites_${user.id}`) || '[]');
    
    // تحديث حالة الموقع إلى منشور
    const currentSite = userSites.find(site => site.id === siteData.id);
    if (currentSite) {
        currentSite.published = true;
        currentSite.publishedUrl = siteUrl;
        currentSite.publishedAt = new Date().toISOString();
    } else {
        siteData.published = true;
        siteData.publishedAt = new Date().toISOString();
        userSites.push(siteData);
    }
    
    localStorage.setItem(`user_sites_${user.id}`, JSON.stringify(userSites));
    
    // إغلاق نافذة النشر
    document.getElementById('publish-modal').classList.add('hidden');
    
    // إظهار رسالة نجاح
    alert('تم نشر موقعك بنجاح! يمكنك رؤيته الآن في قسم "استكشاف".');
    
    // تحديث قائمة المواقع
    loadUserSites();
    
    // الانتقال إلى صفحة الاستكشاف
    document.querySelector('a[href="#explore"]').click();
}

// حفظ الموقع
function saveSite() {
    const user = getUserFromStorage();
    if (!user) {
        alert('يجب تسجيل الدخول أولاً لحفظ موقعك');
        return;
    }
    
    const siteTitle = document.getElementById('site-title').value || 'موقع بدون عنوان';
    const siteDescription = document.getElementById('site-description').value;
    const siteCategory = document.getElementById('site-category').value;
    
    const htmlCode = document.getElementById('html-editor').value;
    const cssCode = document.getElementById('css-editor').value;
    const jsCode = document.getElementById('js-editor').value;
    
    if (!htmlCode) {
        alert('لا يوجد موقع ليتم حفظه');
        return;
    }
    
    // إنشاء كائن الموقع
    const siteData = {
        id: generateId(),
        title: siteTitle,
        description: siteDescription,
        category: siteCategory,
        html: htmlCode,
        css: cssCode,
        js: jsCode,
        authorId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: false
    };
    
    // حفظ الموقع محلياً
    let userSites = JSON.parse(localStorage.getItem(`user_sites_${user.id}`) || '[]');
    userSites.push(siteData);
    localStorage.setItem(`user_sites_${user.id}`, JSON.stringify(userSites));
    
    // إظهار رسالة نجاح
    alert('تم حفظ موقعك بنجاح! يمكنك رؤيته في قسم "مواقعي".');
    
    // تحديث قائمة المواقع
    loadUserSites();
}

// تحميل مواقع المستخدم
function loadUserSites() {
    const user = getUserFromStorage();
    if (!user) return;
    
    const sitesList = document.getElementById('sites-list');
    if (!sitesList) return;
    
    // الحصول على مواقع المستخدم من التخزين المحلي
    const userSites = JSON.parse(localStorage.getItem(`user_sites_${user.id}`) || '[]');
    
    if (userSites.length === 0) {
        sitesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>لا توجد مواقع بعد</h3>
                <p>قم بإنشاء موقعك الأول باستخدام الذكاء الاصطناعي</p>
                <button id="create-first-site" class="btn-primary">
                    <i class="fas fa-plus"></i> أنشئ موقعك الأول
                </button>
            </div>
        `;
        
        // إعادة ربط حدث الزر
        document.getElementById('create-first-site')?.addEventListener('click', function() {
            document.querySelector('a[href="#builder"]').click();
        });
        
        return;
    }
    
    // عرض مواقع المستخدم
    let sitesHTML = '';
    
    userSites.forEach(site => {
        const date = new Date(site.createdAt).toLocaleDateString('ar-SA');
        
        sitesHTML += `
            <div class="site-card">
                <div class="site-thumbnail">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="site-info">
                    <h3 class="site-title">${site.title}</h3>
                    <p class="site-description">${site.description || 'لا يوجد وصف'}</p>
                    <div class="site-meta">
                        <span class="site-date">${date}</span>
                        <span class="site-status ${site.published ? 'published' : 'draft'}">
                            ${site.published ? 'منشور' : 'مسودة'}
                        </span>
                    </div>
                    <div class="site-actions">
                        <button class="btn-outline btn-small edit-site" data-id="${site.id}">
                            <i class="fas fa-edit"></i> تعديل
                        </button>
                        ${site.published ? `
                            <button class="btn-primary btn-small view-site" data-url="${site.publishedUrl}">
                                <i class="fas fa-eye"></i> عرض
                            </button>
                        ` : `
                            <button class="btn-outline btn-small publish-site" data-id="${site.id}">
                                <i class="fas fa-cloud-upload-alt"></i> نشر
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;
    });
    
    sitesList.innerHTML = sitesHTML;
    
    // ربط أحداث الأزرار
    document.querySelectorAll('.edit-site').forEach(btn => {
        btn.addEventListener('click', function() {
            const siteId = this.getAttribute('data-id');
            editSite(siteId);
        });
    });
    
    document.querySelectorAll('.view-site').forEach(btn => {
        btn.addEventListener('click', function() {
            const siteUrl = this.getAttribute('data-url');
            window.open(`/site/${siteUrl}`, '_blank');
        });
    });
    
    document.querySelectorAll('.publish-site').forEach(btn => {
        btn.addEventListener('click', function() {
            const siteId = this.getAttribute('data-id');
            prepareSiteForPublishing(siteId);
        });
    });
}

// تحميل المواقع المنشورة
function loadPublishedSites() {
    const exploreSites = document.getElementById('explore-sites');
    if (!exploreSites) return;
    
    // الحصول على المواقع المنشورة من التخزين المحلي
    const publishedSites = JSON.parse(localStorage.getItem('published_sites') || '[]');
    
    if (publishedSites.length === 0) {
        exploreSites.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-compass"></i>
                <h3>لا توجد مواقع منشورة بعد</h3>
                <p>كن أول من ينشر موقعاً على المنصة!</p>
            </div>
        `;
        return;
    }
    
    // عرض المواقع المنشورة
    let sitesHTML = '';
    
    publishedSites.forEach(site => {
        const date = new Date(site.createdAt).toLocaleDateString('ar-SA');
        
        sitesHTML += `
            <div class="site-card">
                <div class="site-thumbnail">
                    <i class="fas fa-globe"></i>
                </div>
                <div class="site-info">
                    <h3 class="site-title">${site.title}</h3>
                    <p class="site-description">${site.description || 'لا يوجد وصف'}</p>
                    <div class="site-meta">
                        <span class="site-author">
                            <i class="fas fa-user"></i> ${site.author.name}
                        </span>
                        <span class="site-date">${date}</span>
                    </div>
                    <div class="site-actions">
                        <button class="btn-primary btn-small view-published-site" data-url="${site.url}">
                            <i class="fas fa-eye"></i> زيارة الموقع
                        </button>
                        <button class="btn-outline btn-small like-site" data-id="${site.id}">
                            <i class="fas fa-heart"></i> <span>${site.likes || 0}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    exploreSites.innerHTML = sitesHTML;
    
    // ربط أحداث الأزرار
    document.querySelectorAll('.view-published-site').forEach(btn => {
        btn.addEventListener('click', function() {
            const siteUrl = this.getAttribute('data-url');
            viewPublishedSite(siteUrl);
        });
    });
    
    document.querySelectorAll('.like-site').forEach(btn => {
        btn.addEventListener('click', function() {
            const siteId = this.getAttribute('data-id');
            likeSite(siteId, this);
        });
    });
}

// عرض موقع منشور
function viewPublishedSite(siteUrl) {
    // في تطبيق حقيقي، هذا سيفتح الموقع في نافذة جديدة
    // لأغراض العرض، سنعرض معاينة
    alert(`سيتم فتح الموقع: ${siteUrl}\n\nفي التطبيق الكامل، سيفتح هذا الموقع في نافذة جديدة.`);
}

// الإعجاب بموقع
function likeSite(siteId, button) {
    const user = getUserFromStorage();
    if (!user) {
        alert('يجب تسجيل الدخول للإعجاب بالمواقع');
        return;
    }
    
    // تحديث عدد الإعجابات محلياً
    let publishedSites = JSON.parse(localStorage.getItem('published_sites') || '[]');
    const siteIndex = publishedSites.findIndex(site => site.id === siteId);
    
    if (siteIndex !== -1) {
        if (!publishedSites[siteIndex].likes) {
            publishedSites[siteIndex].likes = 0;
        }
        
        publishedSites[siteIndex].likes++;
        localStorage.setItem('published_sites', JSON.stringify(publishedSites));
        
        // تحديث الزر
        const likeCount = button.querySelector('span');
        if (likeCount) {
            likeCount.textContent = publishedSites[siteIndex].likes;
        }
        
        button.classList.add('liked');
        button.disabled = true;
    }
}

// تحضير الموقع للنشر
function prepareSiteForPublishing(siteId) {
    const user = getUserFromStorage();
    if (!user) return;
    
    const userSites = JSON.parse(localStorage.getItem(`user_sites_${user.id}`) || '[]');
    const site = userSites.find(s => s.id === siteId);
    
    if (!site) return;
    
    // تحميل بيانات الموقع في واجهة البناء
    document.getElementById('site-title').value = site.title || '';
    document.getElementById('site-description').value = site.description || '';
    document.getElementById('site-category').value = site.category || 'business';
    
    document.getElementById('html-editor').value = site.html || '';
    document.getElementById('css-editor').value = site.css || '';
    document.getElementById('js-editor').value = site.js || '';
    
    // تحديث المعاينة
    updatePreviewFromEditor();
    
    // الانتقال إلى قسم البناء
    document.querySelector('a[href="#builder"]').click();
    
    // فتح نافذة النشر
    document.getElementById('publish-modal').classList.remove('hidden');
    document.getElementById('publish-url').value = site.title ? generateSlug(site.title) : '';
    document.getElementById('publish-description').value = site.description || '';
}

// تحرير موقع موجود
function editSite(siteId) {
    const user = getUserFromStorage();
    if (!user) return;
    
    const userSites = JSON.parse(localStorage.getItem(`user_sites_${user.id}`) || '[]');
    const site = userSites.find(s => s.id === siteId);
    
    if (!site) return;
    
    // تحميل بيانات الموقع في واجهة البناء
    document.getElementById('site-title').value = site.title || '';
    document.getElementById('site-description').value = site.description || '';
    document.getElementById('site-category').value = site.category || 'business';
    
    document.getElementById('html-editor').value = site.html || '';
    document.getElementById('css-editor').value = site.css || '';
    document.getElementById('js-editor').value = site.js || '';
    
    // تحديث المعاينة
    updatePreviewFromEditor();
    
    // الانتقال إلى قسم البناء
    document.querySelector('a[href="#builder"]').click();
}

// توليد معرف فريد
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// توليد رابط مناسب من العنوان
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}
