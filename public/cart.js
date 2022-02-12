let cartGrid = document.getElementById('cart_grid');

let cartReq = new XMLHttpRequest();

cartReq.open("GET", "/cart");
cartReq.responseType = 'json';

cartReq.onload = () => {
    cartGrid.innerHTML = null;
    cartReq.response.forEach((cart_product) => {
        cartGrid.innerHTML += `
        <div class="cart_product">
        <img class="productimg" src="${cart_product.product.img}">
         <p>${cart_product.product.name}</p>
         <p class="price"><b>${cart_product.product.price} <ion-icon name="cash-outline"></ion-icon></b></p>
         <a class="nav" href="/deleteCartProduct?id=${cart_product.id}"><ion-icon name="close-outline" size="large"></ion-icon></a>          
        </div>
        `
    });
}

cartReq.send();