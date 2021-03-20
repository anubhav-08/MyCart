
var qty = 1;
var price = (document.getElementById('prodPrice').innerHTML).slice(2,);
var prodId = document.getElementById('prodId').getAttribute('name');
prodId = "pr"+prodId;
var prodName = document.getElementById('prodId').innerHTML;
var totalPrice = qty * price;


document.getElementById('minus').addEventListener('click', ()=>{
    qty = qty - 1;
    if(qty === 0){
        qty = 0;
        $('#cartItems').empty();
        txt = `<li class="list-group-item d-flex justify-content-between align-items-center my-4">
        <span class="col-6">No item for checkout</span>
        </li>`
        $('#cartItems').append(txt);

    }else{
        totalPrice = qty * price;
        document.getElementById('valitem').innerHTML = "Qty : "+qty;
        document.getElementById('prodPrice').innerHTML = "₹ "+totalPrice;
    }
});
document.getElementById('plus').addEventListener('click', ()=>{
    qty = qty + 1;
    totalPrice = qty * price;
    document.getElementById('valitem').innerHTML = "Qty : "+qty;
    document.getElementById('prodPrice').innerHTML = "₹ "+totalPrice;
});



function orderCart() {
    var orderList = {};
    orderList[prodId] = [qty, prodName, totalPrice];

    if (qty === 0) {
        alert("There is no item for checkout. Heading to cart");
        window.location = "/shop/checkout/";
        return false;
    } else {
        document.getElementById('orderList').value = JSON.stringify(orderList);
        // localStorage.removeItem('cart');
        qty = 0;
        return true;
    }
}
