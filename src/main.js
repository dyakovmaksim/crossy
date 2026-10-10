import './styles/main.scss';
import products from './data/products.json';
import {asset,notify} from './components/ui.js';
import {home} from './pages/home.js';
import {catalog} from './pages/catalog.js';
import {store} from './logic/store.js';
import {productPage} from './pages/product.js';
import {favoritesPage} from './pages/favorites.js';
import {cartPage} from './pages/cart.js';
const page=document.body.dataset.page;
document.querySelector('#header').innerHTML=`<div class="header-inner"><a class="logo" href="index.html"><img src="${asset('images/logo.svg')}" width="215" height="64" alt="Кроссы и точка — главная"></a><nav aria-label="Основная навигация">${[['catalog','Каталог'],['favorites','Избранное'],['cart','Корзина']].map(([id,name])=>`<a href="${id}.html" ${page===id?'aria-current="page"':''}>${name}${id==='favorites'||id==='cart'?` <span id="${id}-count">0</span>`:''}</a>`).join('')}</nav></div>`;
document.querySelector('#footer').innerHTML=`<div><a href="index.html"><img src="${asset('images/logo_footer.svg')}" width="300" height="64" alt="Кроссы и точка"></a><p>Crossy — учебный проект. Товары, наличие и цены демонстрационные. Заказы не отправляются в магазин.</p></div>`;
const root=document.querySelector('#main');
if(page==='index')home(root,products,store.getFavorites());
if(page==='catalog')catalog(root,products,store.getFavorites);

if(page==='product')productPage(root,products,store);
function sync(){
 document.querySelector('#cart-count').textContent=store.getCart().reduce((sum,item)=>sum+item.quantity,0);
 document.querySelector('#favorites-count').textContent=store.getFavorites().length;
 root.querySelectorAll('[data-favorite]').forEach(button=>{const saved=store.getFavorites().includes(button.dataset.favorite);button.setAttribute('aria-pressed',String(saved));const name=products.find(p=>p.id===button.dataset.favorite)?.name;button.setAttribute('aria-label',`${saved?'Удалить из избранного':'В избранное'}: ${name}`);button.textContent=button.classList.contains('favorite')?(saved?'♥':'♡'):(saved?'В избранном':'В избранное');});
}
root.addEventListener('click',event=>{const button=event.target.closest('[data-favorite]');if(!button)return;store.toggleFavorite(button.dataset.favorite);notify(store.getFavorites().includes(button.dataset.favorite)?'Товар добавлен в избранное':'Товар удалён из избранного');});
store.subscribe(sync);sync();

if(page==='favorites')favoritesPage(root,products,store);

if(page==='cart')cartPage(root,products,store);
