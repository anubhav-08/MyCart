

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
    updateCartValue();
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
        qty = cart[idStr][0] + 1;
        cart[idStr][0] = qty;
    }
    else {
        var data = priceAndName(idStr.slice(2,));
        data = JSON.parse(data);
        qty = 1;
        nameItem = data['product name'];
        itemPrice = data['product price'];
        cart[idStr] = [qty, nameItem, itemPrice];
    }
    updateCartValue();
    updatePopover();
}

// cart storage completion


// adding quantity and plus minus btn in add to cart
function updateCart() {
    for (var item in cart) {
        try {
            if (cart[item][0] != 0) {
                document.getElementById("btn" + item).innerHTML = "<button class='btn btn-primary minus col-3' id='minus" + item + "'>-</button><span class='mx-3 col-3' id='val" + item + "'>" + cart[item][0] + "</span><button class='btn btn-primary plus col-3' id='plus" + item + "'>+</button>"
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
            cart[id][0] = cart[id][0] - 1;
            cart[id][0] = Math.max(cart[id][0], 0);
            if (cart[id][0] == 0) {
                updateCartValue();
                restoreAddToCartBtn(id);
            } else {
                document.getElementById('val' + id).innerHTML = cart[id][0];
            }
            updateCartValue();
            updatePopover();
        });
        l.addEventListener('click', () => {
            let id = l.getAttribute("id");
            id = id.slice(4,);
            cart[id][0] = cart[id][0] + 1;
            document.getElementById('val' + id).innerHTML = cart[id][0];
            updateCartValue();
            updatePopover();
        });
    })
}

function updateCartValue() {
    localStorage.setItem('cart', JSON.stringify(cart));
    sum = 0;
    for (var item in cart) {
        sum = sum + cart[item][0];
    }
    // console.log(sum);
    document.getElementById('cart').innerHTML = sum;
}

function restoreAddToCartBtn(id) {
    document.getElementById("btn" + id).innerHTML = `<button class='btn btn-primary addToCart' id='${id}'>Add to cart</button>`
    location.reload();
}




// updatePopover();
function updatePopover() {}
//     popStr = "<div class = 'row'>";
//     let i = 1;
//     var sum = 0;
//     for (var item in cart) {
//         // console.log(item);
//         sum = sum + cart[item][0];
//         if (cart[item][0] != 0) {
//             try {
//                 popStr = popStr + `<div class="d-flex justify-content-between my-   1"><b>${i}. `;
//                 popStr = popStr + `${cart[item][1].slice(0, 15)}...</b> <span class="success">Qty : ${cart[item][0]}</span> </div><br>`
//                 i = i + 1;
//             } catch (error) {

//             }
//         }
//     }
//     if (sum === 0) {
//         popStr = popStr + "<h5>Nothing in cart</h5>"
//     } else {
//         popStr = popStr + `<div class="d-flex justify-content-between my-1"> <a href = "/shop/checkout/"><span class="btn btn-success">Check Out</span></a> <span class="btn btn-success" id="clearCart">Clear Cart</span></div>`
//     }
//     popStr = popStr + "</div>"
//     // console.log(popStr);

//     document.getElementById('popCart').setAttribute('data-bs-content', popStr);
//     // popoverCart.show();
// }
document.addEventListener('click', (e) => {
    if (e.target && e.target.id == "clearCart") {
        for (var item in cart) {
            cart[item][0] = 0;
        }
        updateCartValue(cart);
        updatePopover(cart);
        location.reload();
    }
});

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}


function priceAndName(prod_id) {
    var dataSend = {
        'product_id': prod_id,
        'csrfmiddlewaretoken': $('input[name = csrfmiddlewaretoken').val()
    };
    var ndata = $.ajax({
        type: "POST",
        url: "/shop/fetchproductinfo/",
        data: dataSend,
        encode: true,
        async: false
    })
        .done(function (data) {
            var ndata = JSON.parse(data);
            return ndata;
        });
    return (ndata.responseText);
};


