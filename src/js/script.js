// 載入 pages/{page}.html 並初始化功能
// 修改成接受 page 跟可選的 id
function loadPage(page, id = "") {
  fetch(`pages/${page}.html`)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById('content');
      container.innerHTML = html;

      if (page === 'home') {
        initCarousel();
        loadProducts();
      }
      else if (page === 'product') {
        initProduct(id);
      }
      // 其他 page 初始化...
    })
    .catch(err => console.error('loadPage 錯誤', err));
}


// Banner 輪播
function initCarousel() {
  const banners = document.querySelectorAll('.banner-carousel .banner');
  if (!banners.length) return;
  let idx = 0;
  setInterval(() => {
    banners[idx].classList.remove('active');
    idx = (idx + 1) % banners.length;
    banners[idx].classList.add('active');
  }, 3000);
}

function initProduct(id) {
  fetch('src/data/products.json')
    .then(r => r.json())
    .then(list => {
      const p = list.find(item => item.id === id);
      if (!p) return alert('找不到此商品');
      console.log("找到商品：", p);

      // 和之前 product.html 裡一樣的動態渲染程式
      document.getElementById('prdTitle').textContent = p.title;
      document.getElementById('prdPrice').textContent = p.price;
      document.getElementById('prdTitleDetail').textContent = p.title + '｜商品詳情';
      const descEl = document.getElementById('prdDesc');
      descEl.innerHTML = p.description.map(t => `<p>${t}</p>`).join('');

      // 圖片切換
      const main = document.getElementById('mainImage');
      const thumbList = document.getElementById('thumbList');
      thumbList.innerHTML = '';
      p.img.forEach((src, i) => {
        const realSrc = '/' + src;  // 確保從根目錄讀取
        if (i === 0) main.src = realSrc;
        console.log("找到商品：", realSrc);

        const img = document.createElement('img');
        img.src = src;
        img.onclick = () => changeImage(img);
        if (i === 0) img.classList.add('active');
        thumbList.appendChild(img);
      });

      // Prev/Next
      const idx = list.indexOf(p);
      const prev = list[(idx - 1 + list.length) % list.length];
      const next = list[(idx + 1) % list.length];
      document.getElementById('prevLink').onclick = () => loadPage('product', prev.id);
      document.getElementById('nextLink').onclick = () => loadPage('product', next.id);
    })
    .catch(console.error);
}

// 動態產生商品卡片
function loadProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  fetch('src/data/products.json')
    .then(res => res.json())
    .then(products => {
      grid.innerHTML = '';
      products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-image">
            <a href="javascript:void(0)"
               onclick="loadPage('product','${p.id}')">
              <img src="${p.img[0]}" alt="${p.title}">
            </a>
            <span class="badge">New!</span>
          </div>
          <div class="product-info">
            <p>${p.title}</p>
            <strong>${p.price}</strong>
          </div>
        `;
        grid.appendChild(card);
      });
    })
    .catch(console.error);
}

// 切換主圖片
function changeImage(thumb) {
  const main = document.getElementById('mainImage');
  main.src = thumb.src;

  // 移除其他縮圖的 active 狀態
  const thumbnails = document.querySelectorAll('#thumbList img');
  thumbnails.forEach(img => img.classList.remove('active'));

  // 加上 active 樣式
  thumb.classList.add('active');
}
// 初始載入：預設讀 home.html
document.addEventListener('DOMContentLoaded', () => {
  loadPage('home');
});
