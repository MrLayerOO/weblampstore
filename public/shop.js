let shopGrid = document.getElementById('shop_grid');

let xhr = new XMLHttpRequest();

xhr.open('GET','/product');
xhr.responseType = 'json';

xhr.onload = () => {
    shopGrid.innerHTML = '';
    if(xhr.response.status == '401') {
        shopGrid.innerHTML = xhr.response;
    }
    xhr.response.forEach((product) => {
        shopGrid.innerHTML += `
        <div class="product">
         <h2>${product.name}</h2>
         <img class="productimg" src="${product.img}">
         <p> ${product.description}</p>
         <p class="price"><b>${product.price} <ion-icon name="cash-outline" size="large"></ion-icon></b></p>
         <a href="/buy?id=${product.id}"><ion-icon name="bag-add-outline" size="large"></ion-icon></a>           
        </div>
        `
    });
}

xhr.send();