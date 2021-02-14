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