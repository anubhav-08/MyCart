
$('#trackOrder').submit(function (event) {
    var formData = {
        'orderId': $('input[name = orderId]').val(),
        'phoneNum': $('input[name = phoneNumber]').val(),
        'csrfmiddlewaretoken': $('input[name = csrfmiddlewaretoken').val()
    };

    $.ajax({
        type: 'POST',
        url: '/shop/tracker/',
        data: formData,
        encode: true
    })

        .done(function (data) {
            $('#orderProgress').empty();
            $('#cartItems').empty();
            $('#info').empty();

            document.getElementById('trackOrder').reset();
            data = JSON.parse(data);
            console.log(data);

            if (data.length === 0) {

                document.getElementById('orderStat').innerHTML = `Order status`;
                str = `<li class="list-group-item justify-content-between">
                Incorrect <b>Order Id</b> or <b>Phone Number</li>`

                $('#orderProgress').append(str);
                $('#cartItems').append(str);

            } else {
                document.getElementById('orderStat').innerHTML = `Order status for order id : ${formData['orderId']}`;

                for (var i = 0; i < (data.length - 1); i++) {
                    str = `<li class="list-group-item d-flex justify-content-between align-items-center">
                    ${data[i]['text']}
                    <span class="badge bg-primary rounded-pill">${data[i]['time']}</span></li>`

                    $('#orderProgress').append(str);

                }
                orderDetails = data[data.length - 1];

                infoStr = `<div class="row my-4">
                  <div class="col-12 col-md-4"><b>Name :</b> ${orderDetails['customer name']}</div>
                  <div class="col-12 col-md-4"><b>Phone No. :</b> ${orderDetails['phone']}</div>
                  <div class="col-12 col-md-4"><b>Order Id. :</b> ${formData['orderId']}</div>
                  <div class="col-12"><b>Address : </b>${orderDetails['address']}</div>
                    </div><hr>
                    <h4>Order contains following items.....</h4><hr>`

                $('#info').append(infoStr);

                items = JSON.parse(orderDetails['items'])
                var sum = 0;
                var totalItems = 0;
                for (var item in items) {
                    console.log(items[item][0] + " " + items[item][1]);
                    // orderBrief = `<li class="list-group-item d-flex justify-content-between align-items-center" id="noCart">
                    // ${items[item][1]}
                    // <span class="badge bg-primary rounded-pill">${items[item][0]}</span>
                    // </li>`
                    sum = sum + (items[item][0] * items[item][2]);
                    totalItems = totalItems + items[item][0];
                    orderBrief = `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <span class="col-6">${items[item][1]}</span>
                    <span class="col-2">Qty : ${items[item][0]}</span>
                    <span class="col-3 text-end">₹ ${items[item][0] * items[item][2]}</span>
                    </li>`

                    $('#cartItems').append(orderBrief);
                }
                txt = `<li class="list-group-item d-flex justify-content-between align-items-center my-4">
            <span class="col-6"><b>Order Total</b></span>
            <span class="col-2"><b>Items : ${totalItems}</b></span>
            <span class="col-3 text-end"><b>₹ ${sum}</b><span>
            </li>`
                $('#cartItems').append(txt);
            }

        });
    event.preventDefault();
});