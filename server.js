const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// اتصال MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-website-builder', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'خطأ في اتصال MongoDB:'));
db.once('open', () => {
    console.log('تم الاتصال بقاعدة البيانات بنجاح');
});

// نماذج البيانات
const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    picture: String,
    createdAt: { type: Date, default: Date.now }
});

const siteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    category: String,
    html: String,
    css: String,
    js: String,
    url: String,
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Site = mongoose.model('Site', siteSchema);

// المسارات
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// مسارات API

// حفظ/تحديث المستخدم
app.post('/api/user', async (req, res) => {
    try {
        const { googleId, name, email, picture } = req.body;
        
        let user = await User.findOne({ googleId });
        
        if (!user) {
            user = new User({ googleId, name, email, picture });
            await user.save();
        }
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في حفظ بيانات المستخدم' });
    }
});

// حفظ موقع
app.post('/api/site', async (req, res) => {
    try {
        const siteData = req.body;
        const site = new Site(siteData);
        await site.save();
        
        res.json(site);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في حفظ الموقع' });
    }
});

// الحصول على مواقع المستخدم
app.get('/api/user/:userId/sites', async (req, res) => {
    try {
        const { userId } = req.params;
        const sites = await Site.find({ userId }).sort({ createdAt: -1 });
        
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب المواقع' });
    }
});

// الحصول على المواقع المنشورة
app.get('/api/sites/published', async (req, res) => {
    try {
        const sites = await Site.find({ published: true })
            .populate('userId', 'name picture')
            .sort({ createdAt: -1 });
        
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في جلب المواقع المنشورة' });
    }
});

// تحديث الموقع
app.put('/api/site/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        updateData.updatedAt = Date.now();
        
        const site = await Site.findByIdAndUpdate(id, updateData, { new: true });
        
        res.json(site);
    } catch (error) {
        res.status(500).json({ error: 'خطأ في تحديث الموقع' });
    }
});

// حذف الموقع
app.delete('/api/site/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Site.findByIdAndDelete(id);
        
        res.json({ message: 'تم حذف الموقع بنجاح' });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في حذف الموقع' });
    }
});

// عرض موقع منشور
app.get('/site/:url', async (req, res) => {
    try {
        const { url } = req.params;
        const site = await Site.findOne({ url, published: true });
        
        if (!site) {
            return res.status(404).send('الموقع غير موجود');
        }
        
        // زيادة عدد المشاهدات
        site.views += 1;
        await site.save();
        
        // إنشاء صفحة HTML كاملة
        const fullHTML = `
            <!DOCTYPE html>
            <html dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${site.title}</title>
                <style>${site.css}</style>
            </head>
            <body>
                ${site.html}
                <script>${site.js}</script>
                <footer style="text-align: center; padding: 20px; background: #f8f9fa; margin-top: 40px;">
                    <p>تم إنشاء هذا الموقع باستخدام <strong>منشئ المواقع الذكي</strong></p>
                    <p>عدد المشاهدات: ${site.views} | عدد الإعجابات: ${site.likes}</p>
                </footer>
            </body>
            </html>
        `;
        
        res.send(fullHTML);
    } catch (error) {
        res.status(500).send('خطأ في عرض الموقع');
    }
});

// API للذكاء الاصطناعي (Groq)
app.post('/api/generate-site', async (req, res) => {
    try {
        const { description, title, category } = req.body;
        
        // في التطبيق الحقيقي، هنا ستتصل بـ Groq API
        // لأغراض العرض، سنستخدم الأمثلة المحددة مسبقاً
        
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // إنشاء موقع بناءً على الوصف
        let html, css, js;
        
        if (description.includes('مطعم')) {
            html = generateRestaurantHTML(title);
            css = generateRestaurantCSS();
            js = generateRestaurantJS();
        } else if (description.includes('متجر')) {
            html = generateEcommerceHTML(title);
            css = generateEcommerceCSS();
            js = generateEcommerceJS();
        } else {
            html = generateGenericHTML(title, description);
            css = generateGenericCSS();
            js = generateGenericJS();
        }
        
        res.json({
            success: true,
            site: {
                html,
                css,
                js,
                title,
                description,
                category
            }
        });
        
    } catch (error) {
        console.error('خطأ في توليد الموقع:', error);
        res.status(500).json({ error: 'خطأ في توليد الموقع' });
    }
});

// دوال مساعدة لتوليد المواقع (نفس الدوال في ai-builder.js)
function generateRestaurantHTML(title) {
    return `...`; // نفس الكود السابق
}

function generateRestaurantCSS() {
    return `...`; // نفس الكود السابق
}

function generateRestaurantJS() {
    return `...`; // نفس الكود السابق
}

function generateEcommerceHTML(title) {
    return `...`; // نفس الكود السابق
}

function generateEcommerceCSS() {
    return `...`; // نفس الكود السابق
}

function generateEcommerceJS() {
    return `...`; // نفس الكود السابق
}

function generateGenericHTML(title, description) {
    return `...`; // نفس الكود السابق
}

function generateGenericCSS() {
    return `...`; // نفس الكود السابق
}

function generateGenericJS() {
    return `...`; // نفس الكود السابق
}

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
