from django.db import models

# Create your models here.
class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=50)
    desc = models.TextField()
    product_price = models.IntegerField(default=0)
    category = models.CharField(max_length=50, default="")
    subcategory = models.CharField(max_length=50)
    pub_date = models.DateField()
    image = models.ImageField(upload_to = "shop/images", default = "")
    def __str__(self):
        return (self.product_name)

class Contact(models.Model):
    msg_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default="")
    email = models.EmailField(max_length=70, default="")
    phone = models.CharField(max_length=11, default="")
    query_desc = models.TextField(default="")

    def __str__(self):
        return (self.name)

class Order(models.Model):
    order_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, default="")
    # lastName = models.CharField(max_length=50, default="")
    address = models.TextField(default="")
    # address2 = models.TextField(default="")
    city = models.CharField(max_length=50,default="")
    state = models.CharField(max_length=50,default="")
    zipCode = models.CharField(max_length=10,default="")
    phoneNum = models.CharField(max_length=10,default="")
    altPhoneNum = models.CharField(max_length=10,default="")
    items = models.TextField()
    amount = models.IntegerField(default=10)
    
    def __str__(self):
        return (self.name)


class TrackOrder(models.Model):
    tracking_id = models.AutoField(primary_key=True)
    order_id = models.CharField(max_length=50, default="")
    description = models.CharField(max_length=500, default="")
    timestamp = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.description[0:10]+ "...."