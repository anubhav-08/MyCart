from mac.settings import MID_PAYTM, MKEY_PAYTM
from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt



from .models import Product, Contact, Order, TrackOrder
from math import ceil
import json
import requests

from paytm import Checksum
# Create your views here.
# set to settings

def index(request):
    allProd = []

    category = Product.objects.values('category', 'product_id')
    cats = {item['category'] for item in category}
    # print(cats)
    for cat in cats:
        prod = Product.objects.filter(category=cat)
        n = len(prod)
        nSlides = n//4 + ceil((n/4)-(n//4))
        allProd.append([prod, range(1, nSlides), nSlides])
    params = {
        'allProd' : allProd,
    }
    return render(request, 'shop/index.html', params)


def about(request):
    return render(request, 'shop/about.html')


def contact(request):
    if request.method == "POST":
        # print(request)
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        phone = request.POST.get('phone', '')
        desc = request.POST.get('desc', '')
        contact = Contact(name = name, phone = phone, email = email, query_desc= desc)
        contact.save()

    return render(request, 'shop/contact.html')
    

def tracker(request):
    if request.method == "POST":
        order_id = request.POST.get('orderId')
        phoneNum = request.POST.get('phoneNum')
        try:
            order = Order.objects.get(order_id = order_id, phoneNum=phoneNum)
            update = TrackOrder.objects.filter(order_id= order_id)
            updates =[]
            for item in update:
                updates.append({'text' : item.description, 'time' : item.timestamp})
            order_details = {
                'items' : order.items,
                'customer name' : order.name,
                'address' : order.address + "\n" + order.city +","+ order.state + "-" +order.zipCode,
                'phone' : order.phoneNum
            }
            updates.append(order_details)
            response = json.dumps(updates, default=str)
            return HttpResponse(response)
        except Exception as e:
            print(e)
            response = json.dumps([], default=str)
            return HttpResponse(response)


    return render(request, 'shop/tracker.html')


def productView(request, id):
    # fetch product using id
    prod = Product.objects.filter(product_id = id)
    # print(prod)
    return render(request, 'shop/productView.html', {'prod' :  prod[0]})

def confirmation(request, id):

    return render(request, 'shop/confirmation.html', {'id' : id})



def checkout(request):
    # prodcuts = Product.objects.all()
    if request.method == "POST":
        itemsJson = request.POST.get('orderList')
        amount = request.POST.get('amount')
        name = request.POST.get('firstName', "")+" "+request.POST.get('lastName', "")
        address = request.POST.get('address1', "")+"\n"+request.POST.get('address2', "")
        city = request.POST.get('city', "")
        state  = request.POST.get('state', "")
        zipCode  = request.POST.get('zipCode', "")
        phoneNum  = request.POST.get('phoneNum', "")
        altPhoneNum  = request.POST.get('alternatePhoneNum', "")
        
        print(amount)
        order = Order(name = name, address=address, city=city, state=state, zipCode=zipCode, phoneNum=phoneNum, altPhoneNum=altPhoneNum, items=itemsJson, amount=amount)
        order.save()

        orderId = order.order_id
        update = TrackOrder(order_id = orderId, description = "Your order has been placed.")
        update.save()


        # return render(request, 'shop/confirmation.html', {'id' : orderId})
        # Request paytm for amount from user to our merchant account

        paytmParams = dict()
        print(request.user.pk)
        paytmParams["body"] = {
            "requestType"   : "Payment",
            "mid"           : MID_PAYTM,
            "websiteName"   : "WEBSTAGING",
            "orderId"       : str(orderId),
            "callbackUrl"   : "http://127.0.0.1:8000/shop/handlerequest/",
            "txnAmount"     : {
                "value"     : str(amount),
                "currency"  : "INR",
            },
            "userInfo"      : {
                "custId"    : str(request.user.pk),
            },
        }

        # Generate checksum by parameters we have in body
        # Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
        checksum = Checksum.generateSignature(json.dumps(paytmParams["body"]), MKEY_PAYTM)

        paytmParams["head"] = {
            "signature"    : checksum
        }
        # print(checksum) 
        post_data = json.dumps(paytmParams)
        # for staging
        url = f"https://securegw-stage.paytm.in/theia/api/v1/initiateTransaction?mid={MID_PAYTM}&orderId={orderId}"
        response = requests.post(url, data = post_data, headers = {"Content-type": "application/json"}).json()
        # print(response)
        resCode = response['body']['resultInfo']['resultCode']
        params = {
            'mid' : MID_PAYTM,
            'orderId' : orderId
        }

        if(resCode == '0000'):
            # print(response['body']['txnToken'])
            params['txnToken'] = response['body']['txnToken']
            return render(request, 'shop/paytm.html', params)   

        return render(request, 'shop/index.html')
    return render(request, 'shop/checkout.html')

@csrf_exempt
def handleRequest(request):
    # paytm make post request here
    form = request.POST
    response_dict = {}
    for i in form.keys():
        if i == 'CHECKSUMHASH':
            checksum = form[i]
            continue
        response_dict[i] = form[i]
    
    print(response_dict)
    print(request.POST.get('MID'))
    isChecksumVerified = Checksum.verifySignature(response_dict, MKEY_PAYTM, checksum)
    if isChecksumVerified:
        if response_dict['RESPCODE'] == '01':
            print('payment successfull')
        else:
            print('payment failed due to ' + response_dict['RESPMSG'])


    return render(request, 'shop/paymentstatus.html', response_dict)


def productinfo(request):
    if request.method == "POST":
        prod_id = request.POST.get('product_id')
        product = Product.objects.get(product_id = prod_id)
        
        prod_details = {
            'product name' : product.product_name,
            'product price' : product.product_price
        }
        
        response = json.dumps(prod_details)
        return HttpResponse(response)
    
    return HttpResponse("NOT HELLO")


def productBuy(request,d):
    prod = Product.objects.get(product_id=d)

    if(request.method == 'POST'):
        return checkout(request)

    return render(request, 'shop/buynow.html', {'prod' : prod})