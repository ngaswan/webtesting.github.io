let navbar = document.querySelector('.header .navbar');
let menuBtn = document.querySelector('#menu-btn');
let listProductHTML = document.querySelector('.coffee-menu')
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');


let listProducts = [];
let carts = [];

let iconCart = document.querySelector('.icon-cart');
let closeIcon = document.querySelector('.close');
let body = document.querySelector('body');

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

closeIcon.addEventListener('click', () => {
    body.classList.toggle('showCart')
})

menuBtn.onclick = () => {
    menuBtn.classList.toggle('fa-times');
    navbar.classList.toggle('active');


};

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
            <div class="coffee-menu">
            <div class="box">
                <div class="box-img">
                    <img src="${product.image}" alt="">
                </div>
                <h3>${product.name}</h3>
                <span>${product.price}</span>
                <button class="addCart">
                Add to cart
                </button>
            </div>
        </div>`;
            listProductHTML.appendChild(newProduct);
        })
    }
}


listProductHTML.addEventListener('click', (event) => {
    if (event.target.classList.contains('addCart')) {
        let productElement = event.target.closest('.item');
        if (productElement && productElement.dataset.id) {
            let product_id = productElement.dataset.id;
            addToCart(product_id); 
        }
    }
});


const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionThisProductInCart === -1) {

        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {

        carts[positionThisProductInCart].quantity++;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts))
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    if (carts.length > 0) {
        carts.forEach(cart => {
            let newCart = document.createElement('div');
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id)
            let info = listProducts[positionProduct];
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            newCart.innerHTML = `
            <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalprice">
                    ${info.price}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
              </div>
            </div>
            `;
            listCartHTML.appendChild(newCart);
        })
    }
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {

        let productElement = positionClick.closest('.item');
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';

        if (productElement && productElement.dataset.id) {
            let product_id = productElement.dataset.id;
            changeQuantity(product_id, type);
        }
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id === product_id);
    if (positionItemInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity++;
                break;
            case 'minus':

                if (carts[positionItemInCart].quantity > 1) {
                    carts[positionItemInCart].quantity--;
                } else {

                    carts.splice(positionItemInCart, 1);
                }
                break;
            default:
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
};


const initApp = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            listProducts = data;
            addDataToHTML();

            //get cart from memory
            if (localStorage.getItem('cart')) {
                carts = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })


}
initApp();