var popoverCart = new bootstrap.Popover(document.querySelector('.popover-dismiss'), {
    trigger: 'focus'
})



let navBtn = document.getElementsByClassName('nav-link');
// console.log(navBtn);
let p = window.location.pathname;
// console.log(p);
if (p.slice(6) === "about/") {
    let act = document.getElementsByClassName('active');
    act[0].classList.remove('active');
    navBtn[1].classList.add('active');
}
else if (p.slice(6) === "tracker/") {
    let act = document.getElementsByClassName('active');
    act[0].classList.remove('active');
    navBtn[2].classList.add('active');
}
else if (p.slice(6) === "contact/") {
    let act = document.getElementsByClassName('active');
    act[0].classList.remove('active');
    navBtn[3].classList.add('active');
}

// CART VALUE REPRESENTATION

if (localStorage.getItem('cart') == null) {
    var cart = {};
}
else {
    cart = JSON.parse(localStorage.getItem('cart'));
    document.getElementById('cart').innerHTML = Object.values(cart).reduce((a, b) => a + b);
    updateCart();
}

addCartInit();

function addCartInit() {
    var btns = document.getElementsByClassName('addToCart');
    Array.from(btns).forEach((btn) => {
        btn.addEventListener('click', function () {
            addToCart(btn);
            updateCart();
        });
    });
}


function addToCart(btn) {

    let idStr = (btn.getAttribute('id')).toString();

    if (cart[idStr] != undefined) {
        cart[idStr] = cart[idStr] + 1;
    }
    else {
        cart[idStr] = 1;
    }
    // localStorage.setItem('cart', JSON.stringify(cart));
    updateCartValue();
    updatePopover(cart);
}

// cart storage completion


// adding quantity and plus minus btn in add to cart
function updateCart() {
    for (var item in cart) {
        try {
            if (cart[item] != 0) {
                document.getElementById("btn" + item).innerHTML = "<button class='btn btn-primary minus col-3' id='minus" + item + "'>-</button><span class='mx-3 col-3' id='val" + item + "'>" + cart[item] + "</span><button class='btn btn-primary plus col-3' id='plus" + item + "'>+</button>"
            }
        } catch (error) {
        }
    }
    var divBtn = document.getElementsByClassName("btnpr")
    Array.from(divBtn).forEach((dBtn) => {
        let f = dBtn.firstChild;
        let l = dBtn.lastChild
        f.addEventListener('click', () => {
            let id = f.getAttribute("id");
            id = id.slice(5,);
            cart[id] = cart[id] - 1;
            cart[id] = Math.max(cart[id], 0);
            if (cart[id] == 0) {
                updateCartValue();
                restoreAddToCartBtn(id);
            } else {
                document.getElementById('val' + id).innerHTML = cart[id];
            }
            // localStorage.setItem('cart', JSON.stringify(cart));
            updateCartValue();
            updatePopover(cart);
        });
        l.addEventListener('click', () => {
            let id = l.getAttribute("id");
            id = id.slice(4,);
            cart[id] = cart[id] + 1;
            document.getElementById('val' + id).innerHTML = cart[id];
            updateCartValue();
            updatePopover(cart);
        });
    })
}

function updateCartValue() {
    // console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    var sum = Object.values(cart).reduce((a, b) => a + b);
    document.getElementById('cart').innerHTML = sum;
}

function restoreAddToCartBtn(id) {
    document.getElementById("btn" + id).innerHTML = `<button class='btn btn-primary addToCart' id='${id}'>Add to cart</button>`
    location.reload();
}




updatePopover(cart);
function updatePopover(cart) {
    popStr = "<div class = 'row'>";
    let i = 1;
    var sum = 0;
    for (var item in cart) {
        // console.log(item);
        sum = sum + cart[item];
        if (cart[item] != 0) {
            try {
                popStr = popStr + `<div class="d-flex justify-content-between my-1"><b>${i}. `;
                popStr = popStr + `${document.getElementById('name' + item).innerHTML.slice(0, 15)}...</b> <span class="success">Qty : ${cart[item]}</span> </div><br>`
                i = i + 1;
            } catch (error) {
                
            }
        }
    }
    if (sum === 0) {
        popStr = popStr + "<h5>Nothing in cart</h5>"
    } else {
        popStr = popStr + `<div class="d-flex justify-content-between my-1"> <a href = "/shop/checkout/"><span class="btn btn-success">Check Out</span></a> <span class="btn btn-success" id="clearCart">Clear Cart</span></div>`
    }
    popStr = popStr + "</div>"
    // console.log(popStr);

    document.getElementById('popCart').setAttribute('data-bs-content', popStr);
    // popoverCart.show();
}
document.addEventListener('click', (e)=>{
    if(e.target && e.target.id == "clearCart"){
        for(var item in cart){
            cart[item] = 0;
        }
        updateCartValue(cart);
        updatePopover(cart);
        location.reload();
    }
});
