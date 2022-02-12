if(document.cookie.includes('token')){
    let user = localStorage.getItem('user');
    document.getElementById('profile').innerHTML = 
        `<span>
        <a class="nav" href="/profile"><ion-icon name="person-circle-outline" size="large"></ion-icon></a>
        <p class="nav"> ${user}</p>
        </span>
        <span>
        <a class="nav" href="/logout"><ion-icon name="log-out-outline" size="large"></ion-icon></a>
        <p class="nav">Log out</p>
        </span>
        `;
}
else {
    document.getElementById('shop').style.display = 'none';
};

