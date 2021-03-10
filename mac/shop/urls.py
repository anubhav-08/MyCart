from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name = 'shop home'),
    path("about/", views.about, name = 'about'),
    path("contact/", views.contact, name = 'contact'),
    path("tracker/", views.tracker, name = 'tracker'),
    path("checkout/", views.checkout, name = 'checkout'),
    path("productview/<int:id>", views.productView, name = 'productView'),

]