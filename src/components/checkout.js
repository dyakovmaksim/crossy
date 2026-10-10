import {validateOrder} from '../logic/checkout.js';
import {cartTotal} from '../logic/cart.js';
import {price} from './ui.js';
export function checkout(container,products,store){
 if(!container)return;
 container.className='checkout';
 const fields=[['name','Имя','text','name'],['phone','Телефон','tel','tel'],['email','Email','email','email']];
 container.innerHTML=`<h2>Демонстрационный заказ</h2><form novalidate autocomplete="off">${fields.map(([name,label,type,complete])=>`<label>${label}<input name="${name}" type="${type}" required autocomplete="off" aria-describedby="error-${name}"><span class="error" id="error-${name}"></span></label>`).join('')}<label>Способ получения<select name="method" aria-describedby="error-method"><option value="pickup">Самовывоз</option><option value="delivery">Доставка</option></select><span class="error" id="error-method"></span></label><label id="address-field" hidden>Адрес доставки<input name="address" autocomplete="off" disabled aria-describedby="error-address"><span class="error" id="error-address"></span></label><small>Форма предназначена для демонстрации. Введённые контакты не сохраняются и не отправляются. Оплата не требуется.</small><button class="primary" type="submit">Оформить демонстрационный заказ</button></form>`;
 const form=container.querySelector('form');
 form.elements.method.addEventListener('change',()=>{const delivery=form.elements.method.value==='delivery';container.querySelector('#address-field').hidden=!delivery;form.elements.address.disabled=!delivery;form.elements.address.required=delivery;});
 form.addEventListener('submit',event=>{
 event.preventDefault();const values=Object.fromEntries(new FormData(form));const errors=validateOrder(values);
 for(const name of ['name','phone','email','method','address']){const input=form.elements[name];input.setAttribute('aria-invalid',String(Boolean(errors[name])));container.querySelector(`#error-${name}`).textContent=errors[name]||'';}
 const first=Object.keys(errors)[0];if(first){form.elements[first].focus();return;}
 const cart=store.getCart();if(!cart.length)return;
 // Сводка содержит только товары. Контакты остаются в форме и сразу уничтожаются.
 const summary=cart.map(item=>{const p=products.find(p=>p.id===item.productId);return `<li>${p.name}, размер ${item.size} — ${item.quantity} шт., ${price(p.price*item.quantity)}</li>`;}).join('');
 const total=price(cartTotal(cart,products));store.clearCart();
 const root=document.querySelector('#main');root.innerHTML=`<h1>Заказ оформлен</h1><section class="success" tabindex="-1"><h2>Демонстрационный заказ оформлен. Данные не отправлялись в магазин</h2><ul>${summary}</ul><p>Итого: <strong>${total}</strong></p><a class="button" href="catalog.html">Вернуться в каталог</a></section>`;root.querySelector('.success').focus();
 });
}
