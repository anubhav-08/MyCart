if (localStorage.getItem('cart') != null) {
    cart = JSON.parse(localStorage.getItem('cart'));
}
cartView();

function cartView() {
    var cost = 0;
    var totalItems = 0;
    $('#cartItems').empty();
    for (var item in cart) {
        if (cart[item][0] != 0) {
            cost = cost + (cart[item][0] * cart[item][2]);
            totalItems = totalItems + cart[item][0];
            txt = `<li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="col-6">${cart[item][1]}</span>
            <span class="col-2 justify-content-between d-flex"><button class='btn btn-primary minus col-2 p-0' id='minus${item}'>-</button><span class='mx-3 col-8 text-center' id='valitem'>Qty : ${cart[item][0]}</span><button class='btn btn-primary plus col-2 p-0 text-center' id='plus${item}'>+</button></span>
            <span class="col-3 text-end">₹ ${cart[item][0] * cart[item][2]}</span>
            </li>`
            $('#cartItems').append(txt);
        }
    }
    if(totalItems != 0){
        txt = `<li class="list-group-item d-flex justify-content-between align-items-center my-4">
            <span class="col-6"><b>Cart Total</b></span>
            <span class="col-3"><b>Items : ${totalItems}</b></span>
            <span class="col-3 text-end"><b>₹ ${cost}</b><span>
            </li>`
        $('#cartItems').append(txt);
        document.getElementById('clearCart').style['display'] = 'inline-block';
        // $('#content-info').append(btnCartClearA);
    }else{
        txt = `<li class="list-group-item d-flex justify-content-between align-items-center my-4">
        <span class="col-6">No item in Cart</span>
        </li>`
        $('#cartItems').append(txt);
        document.getElementById('clearCart').style['display'] = 'none';
    }
}

document.getElementById("cartItems").addEventListener('click', function(e){
    var tarId = e.target.id;
    qtyChange(tarId);
    
})
function qtyChange(id){
    
    if(id[0] === 'p'){
        itemId = id.slice(4,);
        cart[itemId][0] = cart[itemId][0] + 1;
        updateCartValue();  
        cartView();
    }else if(id[0] === 'm'){
        itemId = id.slice(5,);
        cart[itemId][0] = cart[itemId][0] - 1;
        updateCartValue();
        cartView();    
    }
}

function orderCart() {
    var orderList = {};
    for (var item in cart) {
        if (cart[item][0] != 0) {
            qty = cart[item][0];
            itemName = cart[item][1];
            itemPrice = cart[item][2];
            orderList[item] = [qty, itemName, itemPrice];
        }
    }

    if (Object.keys(orderList).length === 0) {
        alert("cart is empty. please add something to cart");
        window.location = "/shop/";
        return false;
    } else {
        document.getElementById('orderList').value = JSON.stringify(orderList);
        localStorage.removeItem('cart');
        return true;
    }
}
