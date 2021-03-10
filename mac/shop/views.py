from django.shortcuts import render
from django.http import HttpResponse
from .models import Product, Contact
from math import ceil
# Create your views here.

def index(request):
    # product = Product.objects.all()
    # # print(product)
    # n = len(product)
    # nSlides = n//4 + ceil((n/4)-(n//4))
    
    # params = {
    #     'no_of_slides' : nSlides,
    #     'product' : product,
    #     'range' : range(1,nSlides)
    # }
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
        print(request)
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        phone = request.POST.get('phone', '')
        desc = request.POST.get('desc', '')
        contact = Contact(name = name, phone = phone, email = email, query_desc= desc)
        contact.save()

    return render(request, 'shop/contact.html')
    
def tracker(request):
    return render(request, 'shop/tracker.html')

def productView(request, id):
    # fetch product using id
    prod = Product.objects.filter(product_id = id)
    print(prod)
    return render(request, 'shop/productView.html', {'prod' :  prod[0]})

def checkout(request):
    prodcuts = Product.objects.all()
    return render(request, 'shop/checkout.html', {"prods" : prodcuts})