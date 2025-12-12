// متغيرات التهيئة
let currentGeneratedSite = null;

// توليد موقع باستخدام الذكاء الاصطناعي
async function generateSiteWithAI() {
    const user = getUserFromStorage();
    if (!user) {
        alert('يجب تسجيل الدخول أولاً لاستخدام الذكاء الاصطناعي');
        return;
    }
    
    const siteDescription = document.getElementById('site-description').value;
    const siteTitle = document.getElementById('site-title').value || 'موقع جديد';
    const siteCategory = document.getElementById('site-category').value;
    const aiModel = document.getElementById('ai-model').value;
    
    if (!siteDescription.trim()) {
        alert('يرجى إدخال وصف للموقع الذي تريد إنشاءه');
        return;
    }
    
    // إظهار مؤشر التحميل
    showLoadingIndicator();
    
    try {
        // في تطبيق حقيقي، هنا سيكون هناك طلب إلى خادم Groq AI
        // لأغراض العرض، سنستخدم أمثلة محددة مسبقاً
        
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // توليد الموقع بناءً على الوصف
        const generatedSite = await mockAIRequest(siteDescription, siteTitle, siteCategory, aiModel);
        
        // حفظ الموقع المُنشَئ
        currentGeneratedSite = generatedSite;
        
        // تحميل الكود في المحرر
        document.getElementById('html-editor').value = generatedSite.html;
        document.getElementById('css-editor').value = generatedSite.css;
        document.getElementById('js-editor').value = generatedSite.js;
        
        // تحديث المعاينة
        updatePreviewFromEditor();
        
        // إظهار رسالة نجاح
        showNotification('تم إنشاء الموقع بنجاح باستخدام الذكاء الاصطناعي!', 'success');
        
        // تفعيل أزرار الحفظ والنشر
        document.getElementById('save-site').disabled = false;
        document.getElementById('publish-site').disabled = false;
        
    } catch (error) {
        console.error('خطأ في توليد الموقع:', error);
        showNotification('حدث خطأ أثناء إنشاء الموقع. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
        // إخفاء مؤشر التحميل
        hideLoadingIndicator();
    }
}

// محاكاة طلب الذكاء الاصطناعي
async function mockAIRequest(description, title, category, model) {
    // هذا مثال محاكاة - في التطبيق الحقيقي، استخدم Groq API
  
    // إنشاء موقع بناءً على الوصف
    let html, css, js;
    
    if (description.includes('مطعم') || description.includes('طعام') || description.includes('أكل')) {
        // موقع مطعم
        html = generateRestaurantHTML(title);
        css = generateRestaurantCSS();
        js = generateRestaurantJS();
    } else if (description.includes('متجر') || description.includes('بيع') || description.includes('تسوق')) {
        // موقع متجر إلكتروني
        html = generateEcommerceHTML(title);
        css = generateEcommerceCSS();
        js = generateEcommerceJS();
    } else if (description.includes('مدونة') || description.includes('مقال') || description.includes('كتابة')) {
        // موقع مدونة
        html = generateBlogHTML(title);
        css = generateBlogCSS();
        js = generateBlogJS();
    } else if (description.includes('معرض') || description.includes('أعمال') || description.includes('تصميم')) {
        // موقع معرض أعمال
        html = generatePortfolioHTML(title);
        css = generatePortfolioCSS();
        js = generatePortfolioJS();
    } else {
        // موقع عام
        html = generateGenericHTML(title, description);
        css = generateGenericCSS();
        js = generateGenericJS();
    }
    
    return {
        html,
        css,
        js,
        title,
        description,
        category,
        model
    };
}

// إظهار مؤشر التحميل
function showLoadingIndicator() {
    // إنشاء مؤشر التحميل
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'ai-loading-indicator';
    loadingIndicator.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>الذكاء الاصطناعي يقوم بإنشاء موقعك...</p>
            <p class="loading-sub">هذه العملية قد تستغرق بضع ثوانٍ</p>
        </div>
    `;
    
    // إضافة الأنماط
    const style = document.createElement('style');
    style.textContent = `
        #ai-loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 4000;
        }
        
        .loading-content {
            background-color: white;
            padding: 40px;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .loading-spinner {
            width: 60px;
            height: 60px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #4361ee;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        .loading-content p {
            margin: 10px 0;
            font-weight: 600;
            color: #333;
        }
        
        .loading-sub {
            font-size: 0.9rem;
            color: #666;
            font-weight: normal;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(loadingIndicator);
}

// إخفاء مؤشر التحميل
function hideLoadingIndicator() {
    const indicator = document.getElementById('ai-loading-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// ============ أمثلة لمواقع HTML/CSS/JS ============

// موقع مطعم
function generateRestaurantHTML(title) {
    return `
<header class="restaurant-header">
    <nav>
        <div class="logo">${title}</div>
        <ul class="nav-links">
            <li><a href="#home">الرئيسية</a></li>
            <li><a href="#menu">قائمة الطعام</a></li>
            <li><a href="#about">عن المطعم</a></li>
            <li><a href="#contact">اتصل بنا</a></li>
        </ul>
        <button class="reservation-btn">حجز طاولة</button>
    </nav>
</header>

<main>
    <section id="home" class="hero-section">
        <div class="hero-content">
            <h1>أطيب المأكولات العربية</h1>
            <p>نقدم لكم أشهى الأطباق العربية بأجود المكونات</p>
            <a href="#menu" class="cta-button">تصفح قائمة الطعام</a>
        </div>
    </section>
    
    <section id="menu" class="menu-section">
        <h2 class="section-title">قائمة الطعام</h2>
        <div class="menu-items">
            <div class="menu-item">
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="وجبة">
                <h3>كبسة دجاج</h3>
                <p>أرز مع دجاج مطبوخ بطريقة تقليدية</p>
                <span class="price">45 ر.س</span>
            </div>
            <div class="menu-item">
                <img src="https://images.unsplash.com/photo-1563379091339-03246963d9d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="وجبة">
                <h3>مندي لحم</h3>
                <p>لحم ضأن مطبوخ في التنور التقليدي</p>
                <span class="price">60 ر.س</span>
            </div>
            <div class="menu-item">
                <img src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="وجبة">
                <h3>سلطة عربية</h3>
                <p>سلطة طازجة من الخضار الموسمية</p>
                <span class="price">25 ر.س</span>
            </div>
        </div>
    </section>
    
    <section id="contact" class="contact-section">
        <h2 class="section-title">اتصل بنا</h2>
        <div class="contact-content">
            <div class="contact-info">
                <h3>معلومات الاتصال</h3>
                <p><i class="fas fa-map-marker-alt"></i> العنوان: الرياض، شارع الملك فهد</p>
                <p><i class="fas fa-phone"></i> الهاتف: 0112345678</p>
                <p><i class="fas fa-envelope"></i> البريد: info@${generateSlug(title)}.com</p>
                <p><i class="fas fa-clock"></i> ساعات العمل: ٤:٠٠ مساءً - ١٢:٠٠ منتصف الليل</p>
            </div>
            <form class="reservation-form">
                <h3>حجز طاولة</h3>
                <input type="text" placeholder="الاسم" required>
                <input type="tel" placeholder="رقم الهاتف" required>
                <input type="number" placeholder="عدد الأشخاص" min="1" required>
                <input type="datetime-local" required>
                <button type="submit">تأكيد الحجز</button>
            </form>
        </div>
    </section>
</main>

<footer>
    <p>© 2023 ${title}. جميع الحقوق محفوظة.</p>
    <div class="social-links">
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-snapchat"></i></a>
    </div>
</footer>
    `;
}

function generateRestaurantCSS() {
    return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Cairo', sans-serif;
}

body {
    background-color: #f9f5f0;
    color: #333;
    line-height: 1.6;
}

.restaurant-header {
    background-color: #8b4513;
    color: white;
    padding: 1rem 2rem;
}

.restaurant-header nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: #ffd700;
}

.reservation-btn {
    background-color: #ffd700;
    color: #333;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
}

.reservation-btn:hover {
    background-color: #ffed4e;
}

.hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
    background-size: cover;
    background-position: center;
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    display: inline-block;
    background-color: #8b4513;
    color: white;
    padding: 1rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    margin-top: 2rem;
    transition: background-color 0.3s;
}

.cta-button:hover {
    background-color: #a0522d;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin: 3rem 0;
    color: #8b4513;
}

.menu-items {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.menu-item {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.menu-item:hover {
    transform: translateY(-10px);
}

.menu-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.menu-item h3 {
    padding: 1rem 1rem 0.5rem;
    color: #8b4513;
}

.menu-item p {
    padding: 0 1rem;
    color: #666;
}

.price {
    display: block;
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: #8b4513;
}

.contact-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.contact-info {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.contact-info h3 {
    margin-bottom: 1rem;
    color: #8b4513;
}

.contact-info p {
    margin: 1rem 0;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.reservation-form {
    background-color: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.reservation-form h3 {
    margin-bottom: 1.5rem;
    color: #8b4513;
}

.reservation-form input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.reservation-form button {
    width: 100%;
    padding: 1rem;
    background-color: #8b4513;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.reservation-form button:hover {
    background-color: #a0522d;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
}

.social-links {
    margin-top: 1rem;
}

.social-links a {
    color: white;
    font-size: 1.5rem;
    margin: 0 0.5rem;
    transition: color 0.3s;
}

.social-links a:hover {
    color: #ffd700;
}
    `;
}

function generateRestaurantJS() {
    return `
// معالجة نموذج الحجز
document.querySelector('.reservation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[type="text"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const people = this.querySelector('input[type="number"]').value;
    const datetime = this.querySelector('input[type="datetime-local"]').value;
    
    if (name && phone && people && datetime) {
        alert('شكراً لك ${title}!\nتم استلام طلب حجز الطاولة بنجاح.\nسنقوم بالاتصال بك لتأكيد الحجز.');
        this.reset();
    } else {
        alert('يرجى ملء جميع الحقول المطلوبة.');
    }
});

// زر الحجز في الشريط العلوي
document.querySelector('.reservation-btn').addEventListener('click', function() {
    document.querySelector('.reservation-form').scrollIntoView({ behavior: 'smooth' });
});
    `;
}

// موقع متجر إلكتروني
function generateEcommerceHTML(title) {
    return `
<header class="store-header">
    <div class="header-top">
        <div class="logo">${title}</div>
        <div class="header-actions">
            <div class="search-box">
                <input type="text" placeholder="ابحث عن منتج...">
                <button><i class="fas fa-search"></i></button>
            </div>
            <div class="user-cart">
                <a href="#" class="cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </a>
            </div>
        </div>
    </div>
    <nav class="store-nav">
        <a href="#" class="active">الرئيسية</a>
        <a href="#">الأجهزة الإلكترونية</a>
        <a href="#">الملابس</a>
        <a href="#">الأثاث</a>
        <a href="#">العروض</a>
    </nav>
</header>

<main>
    <section class="hero-banner">
        <div class="banner-content">
            <h1>تسوق بأفضل الأسعار</h1>
            <p>خصم يصل إلى 50% على مجموعة المنتجات المختارة</p>
            <a href="#" class="shop-now-btn">تسوق الآن</a>
        </div>
    </section>
    
    <section class="featured-products">
        <h2 class="section-title">منتجات مميزة</h2>
        <div class="products-grid">
            <!-- المنتجات سيتم إضافتها بواسطة JavaScript -->
        </div>
    </section>
    
    <section class="categories">
        <h2 class="section-title">الفئات</h2>
        <div class="categories-grid">
            <div class="category-card">
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="إلكترونيات">
                <h3>الأجهزة الإلكترونية</h3>
            </div>
            <div class="category-card">
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="ملابس">
                <h3>الملابس</h3>
            </div>
            <div class="category-card">
                <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" alt="أثاث">
                <h3>الأثاث</h3>
            </div>
        </div>
    </section>
</main>

<footer class="store-footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3>${title}</h3>
            <p>متجرك الإلكتروني الموثوق لأفضل المنتجات بأفضل الأسعار</p>
        </div>
        <div class="footer-section">
            <h3>روابط سريعة</h3>
            <a href="#">شروط الاستخدام</a>
            <a href="#">سياسة الخصوصية</a>
            <a href="#">سياسة الإرجاع</a>
        </div>
        <div class="footer-section">
            <h3>اتصل بنا</h3>
            <p>البريد: support@${generateSlug(title)}.com</p>
            <p>الهاتف: 8001234567</p>
        </div>
    </div>
    <div class="footer-bottom">
        <p>© 2023 ${title}. جميع الحقوق محفوظة.</p>
    </div>
</footer>

<!-- سلة التسوق -->
<div class="cart-sidebar">
    <div class="cart-header">
        <h3>سلة التسوق</h3>
        <button class="close-cart"><i class="fas fa-times"></i></button>
    </div>
    <div class="cart-items">
        <!-- عناصر السلة ستظهر هنا -->
    </div>
    <div class="cart-total">
        <p>الإجمالي: <span class="total-price">0 ر.س</span></p>
        <button class="checkout-btn">إتمام الشراء</button>
    </div>
</div>
    `;
}

function generateEcommerceCSS() {
    return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Cairo', sans-serif;
}

body {
    background-color: #f5f5f5;
}

.store-header {
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2c3e50;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.search-box {
    display: flex;
    border: 2px solid #3498db;
    border-radius: 25px;
    overflow: hidden;
}

.search-box input {
    border: none;
    padding: 0.5rem 1rem;
    width: 250px;
    outline: none;
}

.search-box button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
}

.cart-icon {
    position: relative;
    color: #2c3e50;
    font-size: 1.5rem;
    text-decoration: none;
}

.cart-count {
    position: absolute;
    top: -10px;
    left: -10px;
    background-color: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.store-nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
    background-color: #2c3e50;
    max-width: 1200px;
    margin: 0 auto;
}

.store-nav a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.store-nav a:hover, .store-nav a.active {
    background-color: #3498db;
}

.hero-banner {
    background: linear-gradient(rgba(44, 62, 80, 0.8), rgba(44, 62, 80, 0.8)),
                url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
    background-size: cover;
    background-position: center;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
}

.banner-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.shop-now-btn {
    display: inline-block;
    background-color: #3498db;
    color: white;
    padding: 1rem 2rem;
    border-radius: 5px;
    text-decoration: none;
    margin-top: 2rem;
    font-size: 1.1rem;
    transition: background-color 0.3s;
}

.shop-now-btn:hover {
    background-color: #2980b9;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin: 3rem 0;
    color: #2c3e50;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.product-card {
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.product-card:hover {
    transform: translateY(-10px);
}

.product-img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.product-info {
    padding: 1.5rem;
}

.product-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
}

.product-price {
    color: #e74c3c;
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.add-to-cart {
    width: 100%;
    padding: 0.8rem;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.add-to-cart:hover {
    background-color: #27ae60;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.category-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    height: 300px;
}

.category-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.category-card:hover img {
    transform: scale(1.1);
}

.category-card h3 {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(44, 62, 80, 0.8);
    color: white;
    padding: 1rem;
    text-align: center;
    margin: 0;
}

.store-footer {
    background-color: #2c3e50;
    color: white;
    margin-top: 4rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

.footer-section h3 {
    margin-bottom: 1rem;
    color: #3498db;
}

.footer-section a {
    display: block;
    color: #ecf0f1;
    text-decoration: none;
    margin-bottom: 0.5rem;
    transition: color 0.3s;
}

.footer-section a:hover {
    color: #3498db;
}

.footer-bottom {
    text-align: center;
    padding: 1.5rem;
    background-color: #1a252f;
}

.cart-sidebar {
    position: fixed;
    top: 0;
    left: -400px;
    width: 350px;
    height: 100%;
    background-color: white;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    transition: left 0.3s;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.cart-sidebar.active {
    left: 0;
}

.cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background-color: #2c3e50;
    color: white;
}

.close-cart {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

.cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
}

.cart-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    gap: 1rem;
}

.cart-item-img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
}

.cart-item-info {
    flex: 1;
}

.cart-item-title {
    font-weight: bold;
    margin-bottom: 0.3rem;
}

.cart-item-price {
    color: #e74c3c;
    font-weight: bold;
}

.cart-total {
    padding: 1.5rem;
    background-color: #f8f9fa;
    border-top: 1px solid #eee;
}

.total-price {
    font-size: 1.5rem;
    color: #e74c3c;
    font-weight: bold;
}

.checkout-btn {
    width: 100%;
    padding: 1rem;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    cursor: pointer;
    margin-top: 1rem;
}
    `;
}

function generateEcommerceJS() {
    return `
// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "هاتف ذكي",
        price: 1999,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "الأجهزة الإلكترونية"
    },
    {
        id: 2,
        name: "لابتوب",
        price: 3499,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "الأجهزة الإلكترونية"
    },
    {
        id: 3,
        name: "سماعات رأس",
        price: 299,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "الأجهزة الإلكترونية"
    },
    {
        id: 4,
        name: "ساعة ذكية",
        price: 899,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        category: "الأجهزة الإلكترونية"
    }
];

// سلة التسوق
let cart = [];

// عرض المنتجات
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = \`
            <img src="\${product.image}" alt="\${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">\${product.name}</h3>
                <p class="product-price">\${product.price} ر.س</p>
                <button class="add-to-cart" data-id="\${product.id}">
                    <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                </button>
            </div>
        \`;
        
        productsGrid.appendChild(productCard);
    });
    
    // إضافة أحداث لأزرار "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('تمت إضافة المنتج إلى السلة');
}

// تحديث واجهة سلة التسوق
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const totalPrice = document.querySelector('.total-price');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">سلة التسوق فارغة</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = \`
                    <img src="\${item.image}" alt="\${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <div class="cart-item-title">\${item.name}</div>
                        <div class="cart-item-price">\${item.price} ر.س × \${item.quantity}</div>
                    </div>
                    <button class="remove-item" data-id="\${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                \`;
                
                cartItems.appendChild(cartItem);
            });
            
            // أحداث إزالة العناصر
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }
    }
    
    if (totalPrice) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = \`\${total} ر.س\`;
    }
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// إظهار إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #2ecc71;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideDown 0.3s ease;
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// أحداث السلة
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCartUI();
    
    // فتح وإغلاق السلة
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
        });
    }
    
    if (closeCart && cartSidebar) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // إتمام الشراء
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('سلة التسوق فارغة');
                return;
            }
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(\`شكراً لشرائك!\nإجمالي الطلب: \${total} ر.س\`);
            
            cart = [];
            updateCartUI();
            cartSidebar.classList.remove('active');
        });
    }
    
    // البحث
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const query = searchInput.value.toLowerCase();
            if (query) {
                const filteredProducts = products.filter(product => 
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                
                if (filteredProducts.length === 0) {
                    alert('لم يتم العثور على منتجات تطابق بحثك');
                } else {
                    alert(\`تم العثور على \${filteredProducts.length} منتج\`);
                }
            }
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
});
    `;
}

// يمكن إضافة دوال إضافية لمواقع أخرى (مدونة، معرض أعمال، إلخ)
// ولكن لضمان عدم تجاوز الحد المسموح، سأضيف دوال عامة

function generateGenericHTML(title, description) {
    return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        /* سيتم إضافة CSS هنا */
    </style>
</head>
<body>
    <header>
        <h1>${title}</h1>
        <p>موقع تم إنشاؤه باستخدام الذكاء الاصطناعي</p>
    </header>
    
    <main>
        <section>
            <h2>مرحباً بكم في ${title}</h2>
            <p>${description.substring(0, 200)}...</p>
        </section>
        
        <section>
            <h2>معلومات الموقع</h2>
            <p>تم إنشاء هذا الموقع تلقائياً باستخدام منشئ المواقع الذكي.</p>
            <p>يمكنك تعديل هذا الموقع كما تريد باستخدام أدوات التحرير المتاحة.</p>
        </section>
    </main>
    
    <footer>
        <p>© ${new Date().getFullYear()} ${title}</p>
        <p>تم الإنشاء باستخدام الذكاء الاصطناعي</p>
    </footer>
    
    <script>
        // سيتم إضافة JavaScript هنا
    </script>
</body>
</html>
    `;
}

function generateGenericCSS() {
    return `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Cairo', sans-serif;
}

body {
    background-color: #f0f2f5;
    color: #333;
    line-height: 1.6;
}

header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-align: center;
    padding: 4rem 2rem;
}

header h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

header p {
    font-size: 1.2rem;
    opacity: 0.9;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    background-color: white;
    border-radius: 10px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

section h2 {
    color: #667eea;
    margin-bottom: 1rem;
    border-bottom: 2px solid #f0f2f5;
    padding-bottom: 0.5rem;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 2rem;
    margin-top: 3rem;
}

footer p {
    margin-bottom: 0.5rem;
}
    `;
}

function generateGenericJS() {
    return `
// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل الموقع بنجاح!');
    
    // تأثير بسيط للعناوين
    const headers = document.querySelectorAll('h1, h2');
    headers.forEach(header => {
        header.style.opacity = '0';
        header.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 300);
    });
    
    // تحديث سنة حقوق النشر تلقائياً
    const yearElement = document.querySelector('footer p:first-child');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
});
    `;
}
