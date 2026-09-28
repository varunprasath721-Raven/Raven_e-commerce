from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.management import call_command
from .models import Category,Product,Order,OrderItem
from .serializers import CategorySerializer,ProductSerializer,OrderSerializer
class CategoryViewSet(viewsets.ModelViewSet):
    queryset=Category.objects.all().order_by('name'); serializer_class=CategorySerializer
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class=ProductSerializer
    def get_queryset(self):
        if (not Product.objects.exists()) or Product.objects.filter(image__endswith='.svg').exists() or not Product.objects.filter(category__name__iexact='T-Shirts', image__startswith='/product-images/tshirts/').exists() or not Product.objects.filter(category__name__iexact='Shirts', image__startswith='/product-images/shirts/').exists() or not Product.objects.filter(category__name__iexact='Pants', image__startswith='/product-images/pants/').exists() or not Product.objects.filter(category__name__iexact='Jeans', image__startswith='/product-images/jeans/').exists() or not Product.objects.filter(category__name__iexact='Tops', image__startswith='/product-images/tops/').exists() or not Product.objects.filter(category__name__iexact='Toys', image__startswith='/product-images/toys/').exists() or Product.objects.filter(category__name__iexact='Belts', image__startswith='/product-images/belts/').count() < 20 or Product.objects.filter(category__name__iexact='Sunglasses', image__startswith='/product-images/sunglasses/').count() < 20 or Product.objects.filter(category__name__iexact='Beauty', image__startswith='/product-images/beauty/').count() < 20 or Product.objects.filter(category__name__iexact='Caps', image__startswith='/product-images/caps/').count() < 20 or Product.objects.filter(category__name__iexact='Grocery', image__startswith='/product-images/grocery/').count() < 20:
            try:
                call_command('seed_products', verbosity=0)
            except Exception:
                pass
        qs=Product.objects.select_related('category').all().order_by('-featured','-id')
        cat=self.request.query_params.get('category'); q=self.request.query_params.get('q'); minp=self.request.query_params.get('min'); maxp=self.request.query_params.get('max')
        if cat:
            from django.db.models import Q
            name_map = {
                'tshirts':'T-Shirts','shirts':'Shirts','pants':'Pants','jeans':'Jeans',
                'dresses':'Dresses','shoes':'Shoes','tops':'Tops','sarees':'Sarees',
                'mobiles':'Mobiles','laptops':'Laptops','earbuds':'Earbuds','watches':'Watches',
                'cameras':'Cameras','toys':'Toys','belts':'Belts','wallets':'Wallets',
                'sunglasses':'Sunglasses','caps':'Caps','perfumes':'Perfumes','home':'Home Essentials',
                'beauty':'Beauty','sports':'Sports & Fitness','books':'Books','grocery':'Grocery'
            }
            child_name = name_map.get(cat.lower(), cat.replace('-',' '))
            if cat.lower() == 'tops':
                # Tops must contain exactly the 20 requested products.
                # Use the exact child category so similarly named parent/slug records
                # can never leak into the Tops listing.
                qs = qs.filter(category__name__iexact='Tops')
            else:
                qs = qs.filter(
                    Q(category__name__iexact=child_name) |
                    Q(category__name__icontains=child_name) |
                    Q(category__slug__icontains=cat.replace('_','-'))
                )
        if q: qs=qs.filter(name__icontains=q)
        if minp: qs=qs.filter(price__gte=minp)
        if maxp: qs=qs.filter(price__lte=maxp)
        if cat and cat.lower() == 'tops':
            qs = qs[:20]
        return qs
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items").all().order_by("-id")
    serializer_class = OrderSerializer
    def create(self,request,*args,**kwargs):
        data=request.data; items=data.get('items',[])
        order=Order.objects.create(customer_name=data.get('customer_name','Guest'),email=data.get('email','guest@example.com'),phone=data.get('phone',''),address=data.get('address',''),payment=data.get('payment','COD'),total=data.get('total',0))
        for item in items:
            try:
                p=Product.objects.get(pk=item['product_id']); OrderItem.objects.create(order=order,product=p,quantity=item.get('quantity',1),price=p.price)
            except Product.DoesNotExist: pass
        return Response(OrderSerializer(order).data,status=201)
@api_view(['GET'])
def stats(request):
    return Response({'products':Product.objects.count(),'orders':Order.objects.count(),'categories':Category.objects.count(),'revenue':sum([float(o.total) for o in Order.objects.all()])})
