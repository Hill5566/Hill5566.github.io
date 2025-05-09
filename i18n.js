const translations = {
    'en': {
        'home': 'Home',
        'shop': 'Shop'
    },
    'zh-TW': {
        'home': '首頁',
        'shop': '商店'
    }
};

function setLanguage(lang) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}

// 初始語系設定
setLanguage('en');

// 語言下拉選單事件綁定
document.getElementById('language-selector').addEventListener('change', (e) => {
    setLanguage(e.target.value);
});
