from django.db import models
class Category(models.Model):
    name=models.CharField(max_length=100)
    slug=models.SlugField(unique=True)
    parent=models.ForeignKey('self',null=True,blank=True,on_delete=models.CASCADE,related_name='children')
    image=models.URLField(blank=True)
    def __str__(self): return self.name
class Product(models.Model):
    name=models.CharField(max_length=200)
    brand=models.CharField(max_length=100,blank=True)
    category=models.ForeignKey(Category,on_delete=models.CASCADE,related_name='products')
    price=models.DecimalField(max_digits=10,decimal_places=2)
    mrp=models.DecimalField(max_digits=10,decimal_places=2)
    discount=models.PositiveIntegerField(default=0)
    image=models.URLField()
    description=models.TextField(blank=True)
    rating=models.DecimalField(max_digits=2,decimal_places=1,default=4.3)
    reviews=models.PositiveIntegerField(default=0)
    stock=models.PositiveIntegerField(default=25)
    sizes=models.JSONField(default=list,blank=True)
    colors=models.JSONField(default=list,blank=True)
    featured=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name
class Order(models.Model):
    STATUS=[('PLACED','Placed'),('PACKED','Packed'),('SHIPPED','Shipped'),('DELIVERED','Delivered')]
    customer_name=models.CharField(max_length=120); email=models.EmailField(); phone=models.CharField(max_length=20); address=models.TextField(); payment=models.CharField(max_length=40)
    total=models.DecimalField(max_digits=12,decimal_places=2); status=models.CharField(max_length=20,choices=STATUS,default='PLACED'); created_at=models.DateTimeField(auto_now_add=True)
class OrderItem(models.Model):
    order=models.ForeignKey(Order,on_delete=models.CASCADE,related_name='items'); product=models.ForeignKey(Product,on_delete=models.PROTECT); quantity=models.PositiveIntegerField(default=1); price=models.DecimalField(max_digits=10,decimal_places=2)
