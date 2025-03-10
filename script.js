let products = JSON.parse(localStorage.getItem("products")) || [];
let isAdmin = false;
let visibleCount = 6;

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function showAdminPanel() {
    document.getElementById('adminPanel').classList.remove('hidden');
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function loginAdmin(event) {
    event.preventDefault();
    let password = document.getElementById('adminPassword').value;
    let hashedInput = await hashPassword(password);
    const storedHash = "51f9462e7118f316b81ecba0b777e9f3ab1d90ece5760b03ce974128b9dbfd0e"; // Новый хэш

    if (hashedInput === storedHash) {
        isAdmin = true;
        document.getElementById('adminPanel').classList.add('hidden');
        document.getElementById('fullAdminPanel').classList.remove('hidden');
        renderProducts();
    } else {
        alert("Неверный пароль!");
    }
}

function logoutAdmin() {
    isAdmin = false;
    document.getElementById('fullAdminPanel').classList.add('hidden');
    document.getElementById('adminPassword').value = "";
    renderProducts();
}

function addProduct() {
    let name = document.getElementById('productName').value;
    let price = document.getElementById('productPrice').value;
    let link = document.getElementById('productLink').value;
    let image = document.getElementById('productImage').value;
    let category = document.getElementById('productCategory').value;
    let id = Math.floor(100000000 + Math.random() * 900000000); 

    if (!name || !price || !link || !image) {
        alert("Заполните все поля!");
        return;
    }

    let product = { id, name, price, link, image, category };
    products.push(product);
    saveProducts();
    renderProducts();

    document.getElementById('productName').value = "";
    document.getElementById('productPrice').value = "";
    document.getElementById('productLink').value = "";
    document.getElementById('productImage').value = "";
}

function deleteProduct(id) {
    products = products.filter(product => product.id !== id);
    saveProducts();
    renderProducts();
}

function renderProducts() {
    let list = document.getElementById('productList');
    list.innerHTML = "";

    let displayedProducts = products.slice(0, visibleCount);
    displayedProducts.forEach(product => {
        let div = document.createElement('div');
        div.className = "product";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price}₸</p>
            <p>ID: ${product.id}</p>
            <button onclick="window.open('${product.link}', '_blank')">Купить на ${product.category}</button>
            ${isAdmin ? `<button onclick="deleteProduct(${product.id})">Удалить</button>` : ""}
        `;
        list.appendChild(div);
        setTimeout(() => div.style.opacity = 1, 50);
    });

    document.getElementById('loadMoreBtn').classList.toggle('hidden', products.length <= visibleCount);
}

function loadMore() {
    visibleCount += 6;
    renderProducts();
}

function searchProduct() {
    let searchValue = document.getElementById('searchInput').value;
    let filteredProducts = products.filter(p => p.id.toString().includes(searchValue));
    renderFilteredProducts(filteredProducts);
}

function filterCategory(category) {
    let filteredProducts = category === 'all' ? products : products.filter(p => p.category === category);
    renderFilteredProducts(filteredProducts);
}

function renderFilteredProducts(filteredProducts) {
    let list = document.getElementById('productList');
    list.innerHTML = "";

    filteredProducts.forEach(product => {
        let div = document.createElement('div');
        div.className = "product";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Цена: ${product.price}₸</p>
            <p>ID: ${product.id}</p>
            <button onclick="window.open('${product.link}', '_blank')">Купить на ${product.category}</button>
            ${isAdmin ? `<button onclick="deleteProduct(${product.id})">Удалить</button>` : ""}
        `;
        list.appendChild(div);
        setTimeout(() => div.style.opacity = 1, 50);
    });
}

function toggleTheme() {
    document.body.classList.toggle("light-theme");
}

function toggleAbout() {
    let modal = document.getElementById("about-modal");
    modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

document.addEventListener("DOMContentLoaded", function () {
    renderProducts();

    const modal = document.getElementById("about-modal");
    const closeButtons = document.querySelectorAll(".close");

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            modal.style.display = "none";
        });
    });

    // Закрытие при клике вне окна
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
