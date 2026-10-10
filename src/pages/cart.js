import {asset,price,empty} from '../components/ui.js';
import {cartTotal} from '../logic/cart.js';
import {checkout} from '../components/checkout.js';
export function cartPage(root,products,store){
 function render(){
 const cart=store.getCart();
 root.innerHTML=`<h1>Корзина</h1>${cart.length?`<div class="cart-layout"><div>${cart.map(item=>{const p=products.find(p=>p.id===item.productId);return `<article class="cart-item"><a href="product.html?id=${p.id}"><img src="${asset(p.images[0])}" width="130" height="91" alt="${p.name}" loading="lazy"></a><div><h2><a href="product.html?id=${p.id}">${p.name}</a></h2><p class="muted">Размер EU ${item.size} · ${price(p.price)} за пару</p><div class="row"><label>Количество<input type="number" min="1" step="1" value="${item.quantity}" data-quantity="${p.id}" data-size="${item.size}" aria-label="Количество ${p.name}, размер ${item.size}"></label><strong>${price(p.price*item.quantity)}</strong><button class="secondary" data-remove="${p.id}" data-size="${item.size}" aria-label="Удалить ${p.name}, размер ${item.size}">Удалить</button></div></div></article>`;}).join('')}</div><aside class="summary-box" aria-label="Итог заказа"><h2>Ваш заказ</h2><p class="total" aria-live="polite">${price(cartTotal(cart,products))}</p><a class="button" href="#checkout">Перейти к оформлению</a><p class="muted">Учебная покупка без оплаты.</p></aside></div><div id="checkout"></div>`:empty('Корзина пока пуста','Выберите пару и размер в каталоге.')}`;
 checkout(root.querySelector('#checkout'),products,store);
 }
 root.addEventListener('change',event=>{const input=event.target.closest('[data-quantity]');if(!input)return;const quantity=Number(input.value);if(!Number.isSafeInteger(quantity)||quantity<1){input.value=store.getCart().find(i=>i.productId===input.dataset.quantity&&i.size===Number(input.dataset.size)).quantity;return;}store.quantity(input.dataset.quantity,Number(input.dataset.size),quantity);});
 root.addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(button)store.remove(button.dataset.remove,Number(button.dataset.size));});
 store.subscribe(()=>{const active=document.activeElement;const id=active?.dataset.quantity;const size=active?.dataset.size;const removed=active?.dataset.remove;render();if(id)root.querySelector(`[data-quantity="${id}"][data-size="${size}"]`)?.focus();else if(removed)(root.querySelector('[data-remove]')||root.querySelector('.button'))?.focus();});
 render();
}
