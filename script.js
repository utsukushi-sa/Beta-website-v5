let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allProducts = [];

function saveCart(){
localStorage.setItem("cart", JSON.stringify(cart));
updateCartCount();
}

function updateCartCount(){
const el = document.getElementById("cartCount");
if(el) el.innerText = cart.reduce((a,b)=>a+b.qty,0);
}
updateCartCount();

fetch("data.json")
.then(r=>r.json())
.then(data=>{
allProducts = data;
renderProducts(data);
renderCart();
loadProduct();
});

function renderProducts(data){
const c = document.getElementById("products");
if(!c) return;

c.innerHTML = "";

data.forEach(p=>{
c.innerHTML += `
<div class="product-card" onclick="openProduct('${p.id}')">
<img src="${p.img}" style="width:100%;border-radius:10px;">
<h3>${p.naam}</h3>
<p>€${p.prijs}</p>

<button onclick="event.stopPropagation(); addToCart('${p.id}',${p.prijs},'${p.naam}')">
Toevoegen
</button>

<button onclick="event.stopPropagation(); window.open('${p.link}','_blank')">
Buy
</button>
</div>
`;
});
}

function filterProducts(cat){
if(cat==="all") return renderProducts(allProducts);
renderProducts(allProducts.filter(p=>p.categorie===cat));
}

function searchProducts(){
const v = document.getElementById("search").value.toLowerCase();
renderProducts(allProducts.filter(p=>p.naam.toLowerCase().includes(v)));
}

function addToCart(id,prijs,naam){
const ex = cart.find(i=>i.id===id);
if(ex) ex.qty++;
else cart.push({id,prijs,naam,qty:1});
saveCart();
renderCart();
}

function renderCart(){
const c = document.getElementById("cart");
if(!c) return;

let total = 0;
c.innerHTML = "";

cart.forEach((i,idx)=>{
const sub = i.prijs * i.qty;
total += sub;

c.innerHTML += `
<div class="cart-item">
<div>
<h3>${i.naam}</h3>
<p>€${i.prijs}</p>

<div class="qty-controls">
<button onclick="changeQty(${idx},-1)">-</button>
<span>${i.qty}</span>
<button onclick="changeQty(${idx},1)">+</button>
</div>

<p>Sub: €${sub}</p>
</div>

<button onclick="removeItem(${idx})">X</button>
</div>
`;
});

const t = document.getElementById("total");
if(t) t.innerHTML = "Totaal: €" + total;
}

function changeQty(i,a){
cart[i].qty += a;
if(cart[i].qty <= 0) cart.splice(i,1);
saveCart();
renderCart();
}

function removeItem(i){
cart.splice(i,1);
saveCart();
renderCart();
}

function openProduct(id){
window.location.href = "product.html?id=" + id;
}

function loadProduct(){
const p = document.getElementById("productDetail");
if(!p) return;

const id = new URLSearchParams(window.location.search).get("id");
const item = allProducts.find(x=>x.id===id);
if(!item) return;

p.innerHTML = `
<h1>${item.naam}</h1>
<img src="${item.img}" style="width:300px;border-radius:10px;">
<p>€${item.prijs}</p>
<p>${item.effect}</p>

<button onclick="addToCart('${item.id}',${item.prijs},'${item.naam}')">
Toevoegen
</button>

<button onclick="window.open('${item.link}','_blank')">
Buy now
</button>
`;
}