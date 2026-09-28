from django.contrib import admin
from .models import Category,Product,Order,OrderItem
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin): list_display=('name','slug','parent'); search_fields=('name',); prepopulated_fields={'slug':('name',)}
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin): list_display=('name','category','price','stock','featured'); list_filter=('category','featured'); search_fields=('name','brand'); list_editable=('price','stock','featured')
class OrderItemInline(admin.TabularInline): model=OrderItem; extra=0
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin): list_display=('id','customer_name','total','payment','status','created_at'); list_filter=('status','payment'); inlines=[OrderItemInline]
