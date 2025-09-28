document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('admin-panel');
    const toggleAdminBtn = document.getElementById('toggle-admin-btn');
    const newsPostForm = document.getElementById('news-post-form');
    const newsFeed = document.getElementById('news-feed');
    
    // وشەی نهێنی ئەدمین
    const ADMIN_PASSWORD = 'kurdsport';

    // --- کردنەوە و داخستنی بەشی ئەدمن ---
    toggleAdminBtn.addEventListener('click', () => {
        const password = prompt("تکایە وشەی نهێنی (پاسۆردی) ئەدمن بنووسە:");
        
        if (password === ADMIN_PASSWORD) {
            adminPanel.classList.toggle('hidden');
            const isHidden = adminPanel.classList.contains('hidden');
            toggleAdminBtn.textContent = isHidden ? 'چوونە ژوورەوەی ئەدمن' : 'شاردنەوەی بەشی ئەدمن';
        } else if (password !== null && password !== '') {
            alert("وشەی نهێنی هەڵەیە! تکایە دووبارە هەوڵ بدەوە.");
        }
    });

    // --- بارکردنی هەواڵ لە LocalStorage ---
    let newsPosts = JSON.parse(localStorage.getItem('sportsNewsPosts')) || [];

    // کردارێک بۆ نمایشکردنی هەموو پۆستەکان
    function renderNews() {
        newsFeed.innerHTML = '<h2>نوێترین هەواڵە وەرزشییەکان</h2>'; 
        
        if (newsPosts.length === 0) {
            newsFeed.innerHTML += '<p>هیچ هەواڵێک بڵاو نەکراوەتەوە. یەکەم پۆست بڵاو بکەرەوە!</p>';
            return;
        }

        newsPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        newsPosts.forEach(post => {
            const article = document.createElement('article');
            article.classList.add('news-article');
            
            const date = new Date(post.timestamp).toLocaleDateString('ku-IQ');
            
            let mediaHTML = '';
            // نمایشکردنی وێنە
            if (post.image) {
                mediaHTML += `<div class="news-media"><img src="${post.image}" alt="${post.title}"></div>`;
            }
            // نمایشکردنی ڤیدیۆ
            if (post.video) {
                // کۆنتڕۆڵەکان زیاد دەکەین تا بەکارهێنەر بتوانێت پلەی بکات
                mediaHTML += `<div class="news-media"><video controls src="${post.video}"></video></div>`;
            }

            article.innerHTML = `
                <h3>${post.title}</h3>
                <p class="news-meta">لە نووسینی: **${post.author}** | کات: ${date}</p>
                ${mediaHTML}
                <p>${post.content}</p>
            `;
            newsFeed.appendChild(article);
        });
    }

    // کردارێک بۆ گۆڕینی فایل (وێنە/ڤیدیۆ) بۆ Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                return resolve(null);
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // --- ناردنی فۆرمی پۆستکردن ---
    newsPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('post-title').value;
        const content = document.getElementById('post-content').value;
        const author = document.getElementById('post-author').value;
        const imageFile = document.getElementById('post-image').files[0];
        const videoFile = document.getElementById('post-video').files[0];
        
        // چاوەڕێ دەکەین تا فایلەکان دەگۆڕدرێن بۆ Base64
        const imageDataURL = await fileToBase64(imageFile);
        const videoDataURL = await fileToBase64(videoFile);
        
        const newPost = {
            title,
            content,
            author,
            timestamp: new Date().toISOString(),
            image: imageDataURL,
            video: videoDataURL
        };

        newsPosts.push(newPost);
        localStorage.setItem('sportsNewsPosts', JSON.stringify(newsPosts));

        renderNews();
        
        newsPostForm.reset();
        alert('هەواڵەکە بە وێنە و ڤیدیۆوە بڵاوکرایەوە! (تەنها لەسەر ئەم ئامێرە)');
    });

    // نمایشکردنی هەواڵەکان لەکاتی بارکردنی لاپەڕەکە
    renderNews();
});
