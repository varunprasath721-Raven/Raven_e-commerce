from django.core.management.base import BaseCommand
from store.models import Category,Product
from django.utils.text import slugify
import random
IMG={k:f'https://loremflickr.com/600/600/{q}?lock=1' for k,q in {
 'mobiles':'smartphone,phone','laptops':'laptop,computer','earbuds':'wireless,earbuds,headphones','watches':'wristwatch,watch','cameras':'camera,dslr','tshirts':'tshirt,clothing','shirts':'shirt,clothing','pants':'pants,trousers','jeans':'jeans,clothing','shoes':'sneakers,shoes','tops':'womens,top,clothing','dresses':'dress,clothing','sarees':'saree,indian,clothing','toys':'toys,children','belts':'leather,belt','wallets':'wallet,leather','sunglasses':'sunglasses,eyewear','caps':'cap,hat','perfumes':'perfume,fragrance','home':'home,furniture','beauty':'cosmetics,beauty','sports':'sports,equipment','books':'books,book','grocery':'groceries,food'}.items()}


# Real Home & Kitchen product photos supplied in the current project update (19 uploaded images + existing project home image).
HOME_IMAGES={i:f'/product-images/home/home-{i:02d}.jpg' for i in range(1,20)}
HOME_IMAGES[20]='/product-images/home/home-20.svg'
HOME_NAMES={
 1:'Raven Ocean Breeze Reed Diffuser',2:'Premium Comfort Sofa',3:'Raven Walnut Storage Sideboard',4:'Marble & Gold Oval Coffee Table',5:'Modern Geometric Area Rug',
 6:'Black & Gold Botanical Wall Art Set',7:'Handwoven Rattan Storage Basket',8:'Wooden Table Lamp',9:'Floral Premium Bedsheet Set',10:'Textured Blackout Curtain Set',
 11:'Home Sweet Home Scented Candle Set',12:'Simple Refreshing Facial Wash',13:'Indoor Peace Lily Plant',14:'Decorative Cushion Set',15:'Premium Upholstered Bed',
 16:'Gold Arch Wall Mirror',17:'Grey Accent Lounge Chair',18:'Black & Gold Wall Clock',19:'Ribbed Ceramic Flower Vase',20:'Raven Home Premium Collection'
}
HOME_BRANDS={i:'Raven Home' for i in range(1,21)}
HOME_PRICES={1:799,2:24999,3:12999,4:8999,5:3499,6:2999,7:1499,8:1999,9:1899,10:2199,11:1299,12:299,13:899,14:999,15:29999,16:4999,17:8999,18:1599,19:1199,20:999}
HOME_MRPS={1:1299,2:39999,3:19999,4:13999,5:5999,6:4999,7:2499,8:3499,9:2999,10:3499,11:1999,12:449,13:1499,14:1599,15:44999,16:7999,17:13999,18:2499,19:1999,20:1499}

# Real wireless-earbud photos supplied by the user for the Earbuds category.
EARBUD_IMAGES={i:f'/product-images/earbuds/earbuds-{i:02d}.jpg' for i in range(1,21)}
EARBUD_NAMES={
 1:'Redmi Buds 6',2:'realme Buds T200',3:'OnePlus Buds Z2',4:'Samsung Galaxy Buds 3',5:'OnePlus Buds Z2 - Box Photo',
 6:'boAt Airdopes 148',7:'Sony LinkBuds Fit',8:'JBL Live Pro 2',9:'JBL Tune Buds 2',10:'Samsung Galaxy Buds 3 - Alternate Photo',
 11:'boAt Airdopes 120',12:'CMF Buds Neo',13:'JBL Live Pro 2 - White',14:'Sony WF-C700N',15:'Nothing Ear (a)',
 16:'OnePlus Buds 3',17:'boAt Airdopes Zing',18:'Bose QuietComfort Earbuds',19:'Sony WF-C510',20:'Redmi Buds 6 - Alternate Photo'
}
EARBUD_BRANDS={1:'Redmi',2:'realme',3:'OnePlus',4:'Samsung',5:'OnePlus',6:'boAt',7:'Sony',8:'JBL',9:'JBL',10:'Samsung',11:'boAt',12:'Nothing',13:'JBL',14:'Sony',15:'Nothing',16:'OnePlus',17:'boAt',18:'Bose',19:'Sony',20:'Redmi'}

# Real smartwatch photos supplied by the user.
WATCH_IMAGES={i:f'/product-images/watches/watch-{i:02d}.jpg' for i in range(1,21)}
WATCH_NAMES={
 1:'Apple Watch',2:'Samsung Galaxy Watch',3:'OnePlus Watch',4:'Amazfit GTR',5:'Garmin Venu',
 6:'Huawei Watch',7:'boAt Enigma',8:'boAt Storm',9:'Noise ColorFit',10:'Fire-Boltt Ninja',
 11:'Fire-Boltt Phoenix',12:'Fastrack Revoltt',13:'Titan Celestor',14:'Google Pixel Watch',15:'Redmi Watch',
 16:'Xiaomi Watch',17:'Realme Watch',18:'Honor Watch',19:'CMF Watch',20:'Fossil Smartwatch'
}
WATCH_BRANDS={
 1:'Apple',2:'Samsung',3:'OnePlus',4:'Amazfit',5:'Garmin',6:'Huawei',7:'boAt',8:'boAt',9:'Noise',10:'Fire-Boltt',
 11:'Fire-Boltt',12:'Fastrack',13:'Titan',14:'Google',15:'Redmi',16:'Xiaomi',17:'Realme',18:'Honor',19:'CMF',20:'Fossil'
}

# Real camera photos supplied with this project.
CAMERA_IMAGES={i:f'/product-images/cameras/camera-{i:02d}.jpg' for i in range(1,21)}
CAMERA_NAMES={
 1:'Canon EOS R5',2:'Sony Alpha A7 IV',3:'Nikon Z8',4:'Fujifilm X-T5',5:'Panasonic Lumix S5 II',
 6:'Sony Alpha A6700',7:'Canon EOS R6 Mark II',8:'Nikon Z6 III',9:'Fujifilm X100VI',10:'Leica Q3',
 11:'OM System OM-1 Mark II',12:'GoPro HERO13 Black',13:'DJI Osmo Action 5 Pro',14:'Insta360 X5',15:'Canon EOS R7',
 16:'Sony ZV-E10 II',17:'Nikon Zf',18:'Fujifilm GFX100S II',19:'Sony Alpha A1 II',20:'Canon EOS R3'
}
CAMERA_BRANDS={
 1:'Canon',2:'Sony',3:'Nikon',4:'Fujifilm',5:'Panasonic',6:'Sony',7:'Canon',8:'Nikon',9:'Fujifilm',10:'Leica',
 11:'OM System',12:'GoPro',13:'DJI',14:'Insta360',15:'Canon',16:'Sony',17:'Nikon',18:'Fujifilm',19:'Sony',20:'Canon'
}

# Real kids-toys photos supplied for the Toys category.
TOY_IMAGES={i:f'/product-images/toys/toy-{i:02d}.jpg' for i in range(1,21)}
TOY_NAMES={
 1:'Classic Teddy Bear Plush Toy',2:'Remote Control Off-Road Racing Car',3:'Dinosaur T-Rex Action Toy',4:'Colorful Building Blocks Castle Set',5:'Kids Animal Jigsaw Puzzle',
 6:'Pretty Doll in Pink Dress',7:'Wild Animal Figure Set',8:'Colorful Toy Train Set',9:'Red Sports Racing Toy Car',10:'Interactive Robot Toy',
 11:'Princess Castle Play Set',12:'Little Chef Kids Kitchen Set',13:'Creative Kids Drawing & Art Kit',14:'Magical Unicorn Plush Toy',15:'Kids Toy Airplane',
 16:'Magic Tricks Pretend Play Set',17:'Kids Football',18:'Baby Puppy Soft Toy',19:'Kids Science Experiment Kit',20:'Kids Dart Target Game'
}
TOY_BRANDS={i:'Raven Kids' for i in range(1,21)}

# Real belt photos supplied in the current project update.
BELT_IMAGES={i:f'/product-images/belts/belt-{i:02d}.jpg' for i in range(1,20)}
BELT_IMAGES[20]='/product-images/belts/belt-20.svg'
BELT_NAMES={
 1:'Perforated Black Leather Belt',2:'Raven Black Contrast Stitch Belt',3:'Brown Crocodile Texture Belt',4:'Classic Brown Leather Belt',5:'Black Diamond Texture Belt',
 6:'Tan Leather Belt',7:'Raven Suede Leather Belt',8:'Raven H-Buckle Black Belt',9:'Raven Automatic Buckle Black Belt',10:'Navy Blue Leather Belt',
 11:'Raven Classic Black Leather Belt',12:'Raven Double-G Buckle Brown Belt',13:'Raven Stripe Canvas Belt',14:'Dark Brown Premium Leather Belt',15:'Raven Olive Canvas Belt',
 16:'Raven Minimalist Black Belt',17:'Raven Black Textured Leather Belt',18:'Raven Reversible Black & Brown Belt',19:'Raven Braided Black Belt',20:'Raven Premium Leather Belt'
}
BELT_BRANDS={i:'Raven' for i in range(1,21)}

# Real sunglasses photos supplied in the current project update.
SUNGLASSES_IMAGES={i:f'/product-images/sunglasses/sunglasses-{i:02d}.jpg' for i in range(1,21)}
SUNGLASSES_NAMES={
 1:'Raven Sport Shield Sunglasses',2:'Raven Classic Aviator Sunglasses',3:'Raven Black Wayfarer Sunglasses',4:'Raven Silver Aviator Sunglasses',5:'Raven Round Black Sunglasses',
 6:'Raven Orange Street Sunglasses',7:'Raven Oversized Purple Lens Sunglasses',8:'Raven Rose Gold Round Sunglasses',9:'Raven Blue Classic Sunglasses',10:'Raven Black Gold Rectangle Sunglasses',
 11:'Raven Tortoise Square Sunglasses',12:'Raven Black Gold Aviator Sunglasses',13:'Raven Blue Round Sunglasses',14:'Raven Premium Silver Frame Sunglasses',15:'Raven Classic Round Grey Sunglasses',
 16:'Raven Black Metal Sunglasses',17:'Raven Purple Gradient Sunglasses',18:'Raven Luxury Black Square Sunglasses',19:'Raven Purple Cat-Eye Sunglasses',20:'Raven Mirror-Style Black Sunglasses'
}
SUNGLASSES_BRANDS={i:'Raven' for i in range(1,21)}

# Real cap photos supplied in the current project update.
CAP_IMAGES={i:f'/product-images/caps/cap-{i:02d}.jpg' for i in range(1,21)}
CAP_NAMES={
 1:'Raven Olive Cotton Baseball Cap',2:'Raven Beige Black Contrast Cap',3:'Raven Classic White Baseball Cap',4:'Raven Mustard Yellow Baseball Cap',5:'Raven Navy Blue Baseball Cap',
 6:'Raven Orange Cotton Baseball Cap',7:'Raven Classic Black Baseball Cap',8:'Raven Purple Casual Cap',9:'Raven Cream Black Logo Cap',10:'Raven Royal Blue Snapback Cap',
 11:'Raven Sky Blue Baseball Cap',12:'Raven Pink Cotton Cap',13:'Raven Red Classic Baseball Cap',14:'Raven Black Embroidered Cap',15:'Raven Red Curved Brim Cap',
 16:'Raven Forest Green Logo Cap',17:'Raven Navy Performance Cap',18:'Raven Black Embroidered Baseball Cap',19:'Raven Olive Lightweight Cap',20:'Raven Charcoal Cotton Baseball Cap'
}
CAP_BRANDS={i:'Raven' for i in range(1,21)}
CAP_PRICES={1:499,2:549,3:449,4:499,5:549,6:499,7:449,8:499,9:599,10:649,11:499,12:449,13:499,14:699,15:499,16:649,17:799,18:699,19:549,20:499}
CAP_MRPS={1:899,2:999,3:799,4:899,5:999,6:899,7:799,8:899,9:1099,10:1199,11:899,12:799,13:899,14:1299,15:899,16:1199,17:1399,18:1299,19:999,20:899}

# Beauty product photos supplied in the current project update.
BEAUTY_IMAGES={i:f'/product-images/beauty/beauty-{i:02d}.jpg' for i in range(1,21)}
BEAUTY_NAMES={
 1:'Lotus Herbals Radiant Glow Face Serum',
 2:'Garnier Hydra Bomb Pomegranate Sheet Mask',
 3:'TRESemmé Keratin Smooth Shampoo',
 4:'Maybelline Fit Me Concealer',
 5:'Makeup Revolution Highlighter',
 6:'Nykaa Sketch Liquid Eyeliner',
 7:'M.A.C Matte Lipstick Ruby Woo',
 8:'Maybelline Lifter Gloss',
 9:'Maybelline Fit Me Matte + Poreless Compact Powder',
 10:'Maybelline Lash Sensational Mascara',
 11:'Versace Bright Crystal Eau de Toilette',
 12:'Vaseline Intensive Care Deep Moisture Body Lotion',
 13:'Neutrogena Hydro Boost Water Gel',
 14:'Maybelline Fit Me Matte + Poreless Foundation',
 15:'Dove Intense Repair Conditioner',
 16:'MARS Professional Makeup Brush Set',
 17:'Lakmé Sun Expert SPF 50 PA+++ Sunscreen Gel',
 18:'Maybelline The Nudes Eyeshadow Palette',
 19:'Simple Refreshing Facial Wash',
 20:'Raven Beauty Essentials Makeup Kit'
}
BEAUTY_BRANDS={1:'Lotus Herbals',2:'Garnier',3:'TRESemmé',4:'Maybelline',5:'Makeup Revolution',6:'Nykaa',7:'M.A.C',8:'Maybelline',9:'Maybelline',10:'Maybelline',11:'Versace',12:'Vaseline',13:'Neutrogena',14:'Maybelline',15:'Dove',16:'MARS',17:'Lakmé',18:'Maybelline',19:'Simple',20:'Raven'}
BEAUTY_PRICES={1:699,2:349,3:499,4:399,5:599,6:499,7:1899,8:699,9:549,10:649,11:5499,12:399,13:899,14:699,15:399,16:799,17:549,18:999,19:299,20:899}
BEAUTY_MRPS={1:999,2:499,3:699,4:599,5:899,6:699,7:2299,8:899,9:799,10:899,11:6999,12:599,13:1199,14:899,15:599,16:1199,17:799,18:1399,19:449,20:1299}


# Grocery product photos supplied for the Grocery category (19 user images + 1 project-original image).
GROCERY_IMAGES={i:f'/product-images/grocery/grocery-{i:02d}.jpg' for i in range(1,21)}
GROCERY_NAMES={
 1:'Dabur Honey 100% Pure',2:'Heinz Tomato Ketchup',3:'Dabur Creamy Peanut Butter',4:'Dhara Sugar',5:'Aashirvaad Whole Wheat Atta',
 6:'Fortune Sunlite Refined Sunflower Oil - Large Pack',7:'Daawat Original Basmati Rice',8:'Tata Sampann Toor Dal',9:'Aashirvaad Sona Masoori Rice',10:'Nestlé NIDO FortiGrow Milk Powder',
 11:'Tata Sampann Unpolished Masoor Dal',12:'Tata Salt Iodised Salt',13:'Tata Tea Gold',14:'Fortune Sunlite Refined Sunflower Oil',15:'India Gate Basmati Rice Regular Choice',
 16:'Maggi 2-Minute Masala Noodles',17:'Britannia Good Day Butter Cookies',18:'India Gate Basmati Rice Classic',19:'Madhur Pure & Hygienic Sugar',20:'Raven Premium Moong Dal'
}
GROCERY_BRANDS={1:'Dabur',2:'Heinz',3:'Dabur',4:'Dhara',5:'Aashirvaad',6:'Fortune',7:'Daawat',8:'Tata Sampann',9:'Aashirvaad',10:'Nestlé',11:'Tata Sampann',12:'Tata',13:'Tata Tea',14:'Fortune',15:'India Gate',16:'Maggi',17:'Britannia',18:'India Gate',19:'Madhur',20:'Raven'}
GROCERY_PRICES={1:249,2:119,3:299,4:58,5:299,6:749,7:599,8:159,9:349,10:329,11:149,12:32,13:249,14:189,15:199,16:15,17:30,18:549,19:58,20:149}
GROCERY_MRPS={1:299,2:140,3:349,4:65,5:349,6:899,7:699,8:189,9:399,10:379,11:179,12:35,13:290,14:220,15:240,16:15,17:35,18:649,19:65,20:199}

MOBILE_IMAGES={1:'/product-images/mobiles/mobile-01.jpg',2:'/product-images/mobiles/mobile-02.jpg',3:'/product-images/mobiles/mobile-03.jpg',4:'/product-images/mobiles/mobile-04.jpg',5:'/product-images/mobiles/mobile-05.jpg',6:'/product-images/mobiles/mobile-06.jpg',7:'/product-images/mobiles/mobile-07.jpg',8:'/product-images/mobiles/mobile-08.jpg',9:'/product-images/mobiles/mobile-09.jpg',10:'/product-images/mobiles/mobile-10.jpg',11:'/product-images/mobiles/mobile-11.jpg',12:'/product-images/mobiles/mobile-12.jpg',13:'/product-images/mobiles/mobile-13.jpg',14:'/product-images/mobiles/mobile-14.jpg',15:'/product-images/mobiles/mobile-15.jpg',16:'/product-images/mobiles/mobile-16.jpg',17:'/product-images/mobiles/mobile-17.jpg',18:'/product-images/mobiles/mobile-18.jpg',19:'/product-images/mobiles/mobile-19.jpg',20:'/product-images/mobiles/mobile-20.jpg',}

MOBILE_NAMES={1:'Apple iPhone 16',2:'Samsung Galaxy S25+',3:'Samsung Galaxy S24 Ultra',4:'Vivo X100',5:'Apple iPhone 15',6:'Vivo V40',7:'OnePlus 12R',8:'OPPO Reno12',9:'Xiaomi 14 Civi',10:'Xiaomi 14',11:'Apple iPhone 15 Pro',12:'OnePlus 13',13:'Redmi Note 14 Pro',14:'Samsung Galaxy S25',15:'OnePlus 12',16:'Samsung Galaxy S24',17:'Samsung Galaxy S25 Ultra',18:'Apple iPhone 16 Pro',19:'Apple iPhone 16 Pro Max',20:'OPPO Find X8'}
MOBILE_BRANDS={1:'Apple',2:'Samsung',3:'Samsung',4:'Vivo',5:'Apple',6:'Vivo',7:'OnePlus',8:'OPPO',9:'Xiaomi',10:'Xiaomi',11:'Apple',12:'OnePlus',13:'Redmi',14:'Samsung',15:'OnePlus',16:'Samsung',17:'Samsung',18:'Apple',19:'Apple',20:'OPPO'}
LAPTOP_IMAGES={
1:"/product-images/laptops/laptop-01.jpg",
2:"/product-images/laptops/laptop-02.jpg",
3:"/product-images/laptops/laptop-03.jpg",
4:"/product-images/laptops/laptop-04.jpg",
7:"/product-images/laptops/laptop-07.jpg",
8:"/product-images/laptops/laptop-08.jpg",
9:"/product-images/laptops/laptop-09.jpg",
11:"/product-images/laptops/laptop-11.jpg",
12:"/product-images/laptops/laptop-12.jpg",
13:"/product-images/laptops/laptop-13.jpg",
14:"/product-images/laptops/laptop-14.jpg",
16:"/product-images/laptops/laptop-16.jpg",
17:"/product-images/laptops/laptop-17.jpg",
18:"/product-images/laptops/laptop-18.jpg",
19:"/product-images/laptops/laptop-19.jpg",
5:"https://photo3.enuri.info/data/images/service/dnw/master/131116000/131116722.jpg",
6:"https://dazzle.sgp1.cdn.digitaloceanspaces.com/98214/Lenovo-IdeaPad-Slim-3-15AMN8-AMD-Ryzen-5-7520U-AMD-Radeon-Graphics-FHD-Laptop-price-in-bangladesh-%281%29.jpg",
10:"https://dlcdnwebimgs.asus.com/gain/3346c5ff-d768-43d5-adc6-f2dfc5f9f812/",
15:"https://i5.walmartimages.com/asr/7b655207-3ad8-4870-a778-354f0fae6262.67b26a55f84061b52573673889b0bc94.jpeg",
20:"https://cdn.idealo.com/folder/Product/204327/9/204327910/s1_produktbild_max/microsoft-surface-laptop-7-13-8-16gb-1tb-schwarz-zxx-00041.jpg",
}
LAPTOP_NAMES={
1:"Dell Inspiron 15",
2:"Dell XPS 13",
3:"HP 15s",
4:"HP Pavilion 14",
5:"HP Victus",
6:"Lenovo IdeaPad Slim 3",
7:"Lenovo ThinkPad E14",
8:"Lenovo LOQ",
9:"ASUS VivoBook 15",
10:"ASUS TUF Gaming",
11:"ASUS ROG Strix",
12:"Acer Aspire 5",
13:"Acer Nitro V",
14:"MSI Modern 14",
15:"MSI Gaming Laptop",
16:"Apple MacBook Air M2",
17:"Apple MacBook Air M3",
18:"Apple MacBook Pro 14",
19:"Samsung Galaxy Book",
20:"Microsoft Surface Laptop",
}
LAPTOP_BRANDS={
1:"Dell",
2:"Dell",
3:"HP",
4:"HP",
5:"HP",
6:"Lenovo",
7:"Lenovo",
8:"Lenovo",
9:"ASUS",
10:"ASUS",
11:"ASUS",
12:"Acer",
13:"Acer",
14:"MSI",
15:"MSI",
16:"Apple",
17:"Apple",
18:"Apple",
19:"Samsung",
20:"Microsoft",
}

TSHIRT_IMAGES={i:f'/product-images/tshirts/tshirt-{i:02d}.jpg' for i in range(1,21)}
TSHIRT_NAMES={
 1:'One Piece Luffy Punch Graphic Tee',2:'Reebok Speedwick Training T-Shirt',3:'Dragon Ball Z Goku Orange Graphic Tee',4:'Dragon Ball Z Goku Power Graphic Tee',5:'One Piece Luffy Graphic Tee',
 6:'Nike Sportswear Swoosh T-Shirt',7:'One Piece Manga Panel Tee',8:'Goku Orange Anime Graphic Tee',9:'Tommy Hilfiger Essential Logo Tee',10:'One Piece Zoro Graphic Tee',
 11:'Puma Graphic Sneaker Tee',12:'Adidas Essentials Logo Tee',13:'Goku Line Art Graphic Tee',14:'Naruto Team Graphic Tee',15:'Adidas Essentials Navy Tee',
 16:'Naruto Graphic Black Tee',17:"Levi's Classic White T-Shirt",18:'Jujutsu Kaisen Gojo Graphic Tee',19:'Puma Logo Graphic Tee',20:'One Piece Zoro Model Graphic Tee'
}
TSHIRT_BRANDS={
 1:'One Piece',2:'Reebok',3:'Dragon Ball Z',4:'Dragon Ball Z',5:'One Piece',6:'Nike',7:'One Piece',8:'Dragon Ball Z',9:'Tommy Hilfiger',10:'One Piece',
 11:'Puma',12:'Adidas',13:'Dragon Ball Z',14:'Naruto',15:'Adidas',16:'Naruto',17:"Levi's",18:'Jujutsu Kaisen',19:'Puma',20:'One Piece'
}

# Real shirt photos supplied by the user
SHIRT_IMAGES={i:f'/product-images/shirts/shirt-{i:02d}.jpg' for i in range(1,20)}
SHIRT_NAMES={
 1:'Red & Black Checked Full Sleeve Shirt',2:'White Black Printed Casual Shirt',3:'Beige Classic Full Sleeve Shirt',4:'Nike Blue Ribbon Printed Shirt',5:'H&M Blue Short Sleeve Shirt',6:'Light Grey Formal Shirt',7:'Puma Geometric Printed Shirt',8:'Navy Blue Casual Shirt',9:'Beige Roll-Up Sleeve Shirt',10:'Blue Denim Shirt',
 11:'Light Blue Oxford Casual Shirt',12:'Black Floral Printed Shirt',13:'Olive Green Casual Shirt',14:'White Formal Office Shirt',15:'Green Black Checked Shirt',16:'Blue Casual Cotton Shirt',17:'Adidas Black White Printed Shirt',18:'Adidas Graphic Printed Shirt',19:'Black White Checked Shirt'
}
SHIRT_BRANDS={
 1:'Jack & Jones',2:'UrbanX',3:'Levi\'s',4:'Nike',5:'H&M',6:'Van Heusen',7:'Puma',8:'U.S. Polo Assn.',9:'Roadster',10:'Levi\'s',
 11:'Jack & Jones',12:'Puma',13:'U.S. Polo Assn.',14:'Van Heusen',15:'Urban Basics',16:'Roadster',17:'Adidas',18:'Adidas',19:'Allen Solly'
}

# Real pants photos supplied by the user
PANTS_IMAGES={i:f'/product-images/pants/pants-{i:02d}.jpg' for i in range(1,18)}
PANTS_NAMES={
 1:'Puma Beige Essential Jogger Pants',2:'Puma Red Classic Track Pants',3:'Puma Grey Training Pants',4:'Puma Black White Track Pants',5:'Adidas Black Relaxed Track Pants',
 6:'Nike Black Cargo Utility Pants',7:'Puma Black Cargo Pants',8:'Allen Solly Olive Slim Fit Trousers',9:'Nike Black Training Pants',10:"Levi's Light Blue Straight Jeans",
 11:"Levi's Dark Blue Straight Jeans",12:'Louis Philippe Navy Formal Trousers',13:"Levi's Dark Indigo Slim Jeans",14:'Raven Black Everyday Joggers',15:'Puma Black Red Track Pants',
 16:'Louis Philippe Grey Checked Formal Trousers',17:'Adidas Black 3-Stripes Track Pants'
}
PANTS_BRANDS={1:'Puma',2:'Puma',3:'Puma',4:'Puma',5:'Adidas',6:'Nike',7:'Puma',8:'Allen Solly',9:'Nike',10:"Levi's",11:"Levi's",12:'Louis Philippe',13:"Levi's",14:'Raven',15:'Puma',16:'Louis Philippe',17:'Adidas'}
JEANS_IMAGES={i:f'/product-images/jeans/jeans-{i:02d}.jpg' for i in range(1,15)}
JEANS_NAMES={1:'Classic Dark Blue Straight Fit Jeans',2:'Classic Medium Blue Straight Fit Jeans',3:'Dark Indigo Slim Fit Jeans',4:'Light Blue Everyday Fit Jeans',5:'Light Wash Relaxed Fit Jeans',6:'Ice Blue Straight Fit Jeans',7:'Dark Navy Comfort Fit Jeans',8:'Deep Blue Classic Fit Jeans',9:'Dark Blue Regular Fit Jeans',10:'Black Indigo Slim Fit Jeans',11:'Blue Mid Wash Straight Fit Jeans',12:'Medium Blue Classic Fit Jeans',13:'Wrangler Authentic Slim Texas Blue Jeans',14:'Wrangler Blue Denim Jeans'}
JEANS_BRANDS={1:'Raven',2:'Raven',3:'Raven',4:'Raven',5:'Raven',6:'Raven',7:'Raven',8:'Raven',9:'Raven',10:'Raven',11:'Raven',12:'Raven',13:'Wrangler',14:'Wrangler'}

# User-supplied dress/fashion images installed for the Dresses category.
DRESSES_IMAGES={i:f'/product-images/dresses/dress-{i:02d}.jpg' for i in range(1,20)}
DRESSES_NAMES={
 1:'Men Light Blue Casual Shirt & Jeans Look',
 2:'Men White Formal Shirt & Navy Trousers',
 3:'Women Yellow Saree',
 4:'Women Pink Designer Saree',
 5:'Women Pink Embroidered Kurta',
 6:'Men Black Traditional Kurta',
 7:'Boys Blue Casual Shirt & Shorts Set',
 8:'Women Denim Shirt Dress',
 9:'Women Aqua Printed Salwar Suit',
 10:'Men Black Casual T-Shirt & Jeans',
 11:'Girls Pink Party Frock',
 12:'Boys Blue Casual Shirt & Shorts',
 13:'Women Yellow Printed Kurti',
 14:'Women Black Embroidered Salwar Suit',
 15:'Girls Pink Sequin Party Dress',
 16:'Girls Red Party Frock',
 17:'Men Navy Blue Casual T-Shirt & Jeans',
 18:'Girls Yellow Embroidered Lehenga Dress',
 19:'Men Striped Shirt & Blue Jeans',
}
DRESSES_BRANDS={
 1:'Raven',2:'Van Heusen',3:'Raven Women',4:'Suma',5:'Raven Women',
 6:'Raven Men',7:'Raven Kids',8:'Raven Women',9:'Ganga',10:'Raven Men',
 11:'Raven Kids',12:'Raven Kids',13:'Aurelia',14:'Raven Women',15:'Raven Kids',
 16:'Raven Kids',17:'Raven Men',18:'Raven Kids',19:'Raven Men'
}
DRESSES_PRICES={
 1:899,2:1099,3:1299,4:1599,5:799,6:999,7:699,8:1199,9:1299,10:749,
 11:899,12:699,13:749,14:1499,15:1099,16:799,17:749,18:1399,19:999
}
DRESSES_MRPS={
 1:1799,2:2199,3:2499,4:2999,5:1699,6:1999,7:1399,8:2399,9:2599,10:1499,
 11:1799,12:1399,13:1499,14:2999,15:2199,16:1599,17:1499,18:2799,19:1999
}

# Three additional user-supplied saree photos added to the Sarees category.
SAREE_IMAGES={1:'/product-images/sarees/saree-01.jpg',2:'/product-images/sarees/saree-02.jpg',3:'/product-images/sarees/saree-03.jpg',4:'/product-images/sarees/saree-04.jpg',5:'/product-images/sarees/saree-05.jpg',6:'/product-images/sarees/saree-06.jpg',7:'/product-images/sarees/saree-07.jpg',8:'/product-images/sarees/saree-08.jpg',9:'/product-images/sarees/saree-09.jpg',10:'/product-images/sarees/saree-10.jpg',11:'/product-images/sarees/saree-11.jpg',12:'/product-images/sarees/saree-12.jpg',13:'/product-images/sarees/saree-13.jpg',14:'/product-images/sarees/saree-14.jpg',15:'/product-images/sarees/saree-15.jpg',16:'/product-images/sarees/saree-16.jpg',17:'/product-images/sarees/saree-17.jpg',18:'/product-images/sarees/saree-18.jpg',19:'/product-images/sarees/saree-19.jpg',20:'/product-images/sarees/saree-20.jpg',21:'/product-images/sarees/saree-21.jpg',22:'/product-images/sarees/saree-22.jpg',23:'/product-images/sarees/saree-23.jpg'}
SAREE_NAMES={1:'Emerald Green Kanjivaram Silk Saree',2:'Royal Blue Silk Saree',3:'Red Floral Silk Saree',4:'Red Blue Handloom Saree',5:'Blush Pink Organza Saree',6:'Red Gold Kanjivaram Saree',7:'Dark Green Designer Silk Saree',8:'Rose Pink Banarasi Saree',9:'Royal Purple Silk Saree',10:'Red Gold Banarasi Saree',11:'Green Gold Kanjivaram Saree',12:'Yellow Gold Silk Saree',13:'Peach Designer Saree',14:'Purple Gold Silk Saree',15:'Purple Zari Silk Saree',16:'Red Blue Handloom Saree',17:'Red Blue Handloom Saree - New',18:'Purple Gold Silk Saree - New',19:'Red Gold Kanjivaram Saree - New',20:'Red Gold Silk Saree',21:'Emerald Green Kanjivaram Silk Saree',22:'Royal Blue Silk Saree',23:'Blush Pink Organza Saree'}
SAREE_BRANDS={i:'Raven Women' for i in range(1,24)}
SAREE_PRICES={1:1899,2:1699,3:1799,4:1499,5:1499,6:2199,7:2399,8:1899,9:1699,10:2299,11:2499,12:1599,13:1999,14:1799,15:2199,16:1499,17:1599,18:1899,19:2299,20:1999,21:1899,22:1699,23:1499}
SAREE_MRPS={1:3499,2:3199,3:3399,4:2999,5:2799,6:3999,7:4499,8:3499,9:3199,10:3999,11:4299,12:2999,13:3599,14:3299,15:3999,16:2999,17:3199,18:3499,19:3999,20:3599,21:3499,22:3199,23:2799}

# Real tops images supplied by the user
TOPS_IMAGES={i:f'/product-images/tops/top-{i:02d}.jpg' for i in range(1,21)}
TOPS_NAMES={
 1:'Women V-Neck Casual Top Collection',2:'Women Yellow Printed Tunic Top',3:'Women Printed Ethnic Long Top',4:'Women Ribbed Button Front Top',5:'Women Ribbed Tank Top Set',
 6:'Women Pink Puff Sleeve Party Top',7:'Kids Green Hooded Jacket Top',8:'Women Floral Printed Kurti Top',9:'Women Basic Long Sleeve Top',10:'Women Sleeveless Linen Top',
 11:'Women Blue Casual Tunic Top',12:'Women Maroon Casual T-Shirt Top',13:'Women Floral Printed Kurti Top',14:'Women Lavender Puff Sleeve Crop Top',15:'Women Essential Cotton T-Shirt Set',
 16:'Women Teal Wrap Maxi Top Dress',17:'Women Yellow Pleated Party Top Dress',18:'Women Soft Long Sleeve Basic Top',19:'Women Brown Polo Mini Dress Top',20:'Women V-Neck Casual Top Variant'
}
TOPS_BRANDS={1:'Raven',2:'Biba',3:'Aurelia',4:'H&M',5:'Roadster',6:'Raven',7:'Raven Kids',8:'W for Woman',9:'H&M',10:'Roadster',11:'Raven',12:'Tokyo Talkies',13:'Libas',14:'Raven',15:'H&M',16:'Raven',17:'Only',18:'Roadster',19:'Raven',20:'Raven'}


# Affordable fixed prices for the 20 Tops products (INR).
# These are intentionally kept budget-friendly instead of using the random
# price range used by other categories.
TOPS_PRICES={
 1:399, 2:549, 3:699, 4:449, 5:499,
 6:599, 7:799, 8:649, 9:399, 10:449,
 11:699, 12:349, 13:599, 14:499, 15:699,
 16:799, 17:749, 18:399, 19:699, 20:399,
}
TOPS_MRPS={
 1:899, 2:1199, 3:1499, 4:999, 5:1099,
 6:1299, 7:1599, 8:1399, 9:899, 10:999,
 11:1499, 12:799, 13:1299, 14:1099, 15:1499,
 16:1699, 17:1599, 18:899, 19:1499, 20:899,
}
TOPS_RATINGS={1:4.6,2:4.4,3:4.5,4:4.3,5:4.4,6:4.5,7:4.2,8:4.6,9:4.3,10:4.4,11:4.5,12:4.2,13:4.6,14:4.3,15:4.5,16:4.4,17:4.2,18:4.4,19:4.3,20:4.5}
TOPS_STOCK={1:42,2:35,3:28,4:50,5:45,6:31,7:22,8:38,9:55,10:47,11:26,12:60,13:34,14:41,15:30,16:24,17:19,18:52,19:27,20:48}

# Real women’s shoe pair photos supplied for this project
SHOES_IMAGES={i:f'/product-images/shoes/shoe-{i:02d}.jpg' for i in range(1,26)}
SHOES_NAMES={
  1:'Reebok Classic Leather Women Sneakers',
  2:'adidas Samba Women Sneakers',
  3:'Nike Revolution Women Running Shoes',
  4:'Nike Court Vision Women Sneakers',
  5:'Nike Air Force 1 Women Sneakers',
  6:'Nike Air Max Women Sneakers',
  7:'adidas Grand Court Women Sneakers',
  8:'adidas Advantage Women Sneakers',
  9:'Puma Carina Women Sneakers',
 10:'Puma Softride Women Running Shoes',
 11:'Puma Women Casual Sneakers',
 12:'Reebok Club C Women Sneakers',
 13:'Reebok Classic Women Sneakers',
 14:'Skechers Women Walking Shoes',
 15:'Skechers Women Running Shoes',
 16:'ASICS Women Running Shoes',
 17:'ASICS Gel-Excite Women Shoes',
 18:'New Balance 327 Women Sneakers',
 19:'New Balance 574 Women Sneakers',
 20:'Converse Chuck Taylor Women Sneakers',
 21:'Fila Women Casual Sneakers',
 22:'Nike Air Max Women Black Sneakers',
 23:'Nike Women Training Shoes',
 24:'adidas Women Court Sneakers',
 25:'Puma Women Sport Sneakers'
}
SHOES_BRANDS={
 1:'Reebok',2:'adidas',3:'Nike',4:'Nike',5:'Nike',6:'Nike',7:'adidas',8:'adidas',9:'Puma',10:'Puma',11:'Puma',12:'Reebok',13:'Reebok',14:'Skechers',15:'Skechers',16:'ASICS',17:'ASICS',18:'New Balance',19:'New Balance',20:'Converse',21:'Fila',22:'Nike',23:'Nike',24:'adidas',25:'Puma'
}
# Book category: 20 supplied book-cover images.
BOOK_IMAGES={i:f'/product-images/books/book-{i:02d}.jpg' for i in range(1,21)}
BOOK_NAMES={
 1:'React Up & Running',2:'Database Management Systems',3:'Deep Learning: Neural Networks and AI',
 4:'Web Development Full Stack Guide',5:'Data Science: Concepts, Tools and Projects',6:'JavaScript: The Complete Guide',
 7:'C Programming Mastery',8:'Web Development: A Complete Guide',9:'TypeScript Modern JavaScript Development',
 10:'HTML & CSS Modern Web Design',11:'SQL & Database Design',12:'Git & GitHub Version Control Essentials',
 13:'Excel Data Analysis',14:'Personal Finance for Beginners',15:'Machine Learning',16:'Python Programming for Beginners',
 17:'Data Science for Beginners',18:'Cybersecurity: A Practical Guide',19:'Java Programming Complete Developer Guide',
 20:'Django Web Development'
}
BOOK_BRANDS={
 1:"O'Reilly",2:'McGraw Hill',3:'Packt',4:'Raven Books',5:'Raven Books',6:'Raven Books',7:'Raven Books',
 8:'TechPress',9:'Raven Books',10:'Raven Books',11:'Raven Books',12:"O'Reilly",13:'Raven Books',
 14:'Raven Books',15:'Wiley',16:'Wiley',17:'NextGen Press',18:'Wiley',19:'Raven Books',20:'Raven Books'
}
BOOK_PRICES={1:899,2:1199,3:1099,4:999,5:899,6:799,7:699,8:949,9:999,10:749,11:899,12:799,13:699,14:599,15:1299,16:799,17:899,18:1099,19:899,20:999}
BOOK_MRPS={1:1299,2:1699,3:1499,4:1399,5:1299,6:1199,7:999,8:1399,9:1499,10:1099,11:1299,12:1199,13:999,14:899,15:1799,16:1199,17:1299,18:1599,19:1299,20:1499}

# Sports & fitness product photos supplied in the current project update (19 uploaded + 1 existing project sports image).
SPORTS_IMAGES={i:f'/product-images/sports/sports-{i:02d}.png' for i in range(1,20)}
SPORTS_IMAGES[20]='/product-images/sports/sports-20.svg'
SPORTS_NAMES={
 1:'STIGA Table Tennis Balls - 6 Ball Pack',2:'SG Club Cricket Ball',3:'Adidas Predator Goalkeeper Gloves',4:'Nike Running Shoes',5:'Wilson Ultra Tennis Racket',
 6:'Wilson Evolution Basketball',7:'Raven Speed Skipping Rope',8:'Raven 10KG Hex Dumbbells',9:'Yonex Badminton Racket',10:'Everlast Elite Boxing Gloves',
 11:'SG English Willow Cricket Bat',12:'Adidas Tango Glider Football',13:'Nike Mercurial Football Boots',14:'VirtuFit 16KG Kettlebell',15:'Mikasa V200W Volleyball',
 16:'Raven Sports Performance Jersey',17:'Raven Rider Skateboard',18:'STIGA Table Tennis Bat & Balls Set',19:'Nike Sports Training Backpack',20:'Raven Sports Training Equipment'
}
SPORTS_BRANDS={1:'STIGA',2:'SG',3:'Adidas',4:'Nike',5:'Wilson',6:'Wilson',7:'Raven',8:'Raven',9:'Yonex',10:'Everlast',11:'SG',12:'Adidas',13:'Nike',14:'VirtuFit',15:'Mikasa',16:'Raven',17:'Raven',18:'STIGA',19:'Nike',20:'Raven'}
SPORTS_PRICES={1:399,2:699,3:2499,4:3499,5:5999,6:2499,7:299,8:3999,9:2199,10:2299,11:4999,12:1799,13:4499,14:2499,15:3499,16:899,17:2499,18:899,19:1999,20:1499}
SPORTS_MRPS={1:499,2:899,3:3499,4:4999,5:7999,6:3499,7:499,8:4999,9:2999,10:3299,11:6999,12:2499,13:6499,14:3499,15:4999,16:1299,17:3499,18:1299,19:2999,20:2199}


# Real perfume photos supplied in this project update (19 user images + 1 RavenMart catalog image).
PERFUME_IMAGES={i:f'/product-images/perfumes/perfume-{i:02d}.jpg' for i in range(1,21)}
PERFUME_NAMES={
 1:'Savagery Pour Homme Eau de Parfum',2:'Versace Dylan Blue Inspired Men\'s Perfume',3:'Coach Silver Men\'s Fragrance',4:'Blue Fresh Eau de Parfum',5:'Boss The Scent Men\'s Perfume',
 6:'Silverlake For Men Eau de Parfum',7:'Savagery Pour Homme Premium Edition',8:'Blue For Men Premium Fragrance',9:'Black Ribbed Signature Perfume',10:'Layke Flame Black & Gold Perfume',
 11:'Johan.b Rich Icone For Men',12:'Louis Vuitton Style Black Perfume',13:'Noir Essentials Pour Homme',14:'Trussardi Uomo',15:'Ereva Parfum',
 16:'Guess Uomo Intenso',17:'Raven Classic White Men\'s Perfume',18:'Clive Christian Masculine Perfume',19:'Raven Black Gold Signature Perfume',20:'RavenMart Premium Perfume Collection'
}
PERFUME_BRANDS={1:'Savagery',2:'Versace',3:'Coach',4:'Raven',5:'BOSS',6:'Silverlake',7:'Savagery',8:'Raven',9:'Raven',10:'Raven',11:'Johan.b',12:'Louis Vuitton',13:'Noir Essentials',14:'Trussardi',15:'Ereva',16:'GUESS',17:'Raven',18:'Clive Christian',19:'Raven',20:'RavenMart'}
PERFUME_PRICES={1:899,2:2499,3:2299,4:699,5:2999,6:899,7:999,8:799,9:899,10:1299,11:1599,12:3499,13:1199,14:1999,15:999,16:1499,17:699,18:9999,19:1499,20:799}
PERFUME_MRPS={1:1499,2:3999,3:3499,4:1199,5:4499,6:1499,7:1699,8:1299,9:1499,10:2199,11:2499,12:4999,13:1999,14:2999,15:1599,16:2499,17:1199,18:12999,19:2499,20:1299}


# Wallet category: 20 local product photos (15 supplied wallet photos + 5 matching catalog variants).
WALLET_IMAGES={i:f'/product-images/wallets/wallet-{i:02d}.jpg' for i in range(1,21)}
WALLET_NAMES={
 1:'Classic Brown Leather Bifold Wallet',
 2:'Tan Minimal Leather Wallet',
 3:'Dark Brown Compact Bifold Wallet',
 4:'Black RFID Leather Wallet',
 5:'Giorgio Armani Style Black Wallet',
 6:'Tom Ford Style Brown Leather Wallet',
 7:'Slim Tan Card Holder Wallet',
 8:'Black Carbon Texture Wallet',
 9:'Navy Minimalist Leather Wallet',
 10:'Vintage Tan Leather Bifold Wallet',
 11:'Bally Style Black Leather Wallet',
 12:'Premium Brown Contrast-Stitch Wallet',
 13:'Teskyer Style Slim RFID Wallet',
 14:'Grey Pebble Leather Wallet',
 15:'Classic Tan Leather Wallet',
 16:'Raven Classic Black Leather Wallet',
 17:'Raven Dark Brown Compact Wallet',
 18:'Raven Carbon Texture Bifold Wallet',
 19:'Raven Deep Brown Leather Wallet',
 20:'Raven Navy Minimal Wallet'
}
WALLET_BRANDS={i:'Raven' for i in range(1,21)}
WALLET_PRICES={1:699,2:599,3:649,4:749,5:999,6:1099,7:499,8:799,9:649,10:699,11:1199,12:899,13:699,14:649,15:599,16:699,17:649,18:799,19:749,20:649}
WALLET_MRPS={1:1199,2:999,3:1099,4:1299,5:1699,6:1899,7:899,8:1399,9:1099,10:1199,11:1999,12:1599,13:1199,14:1099,15:999,16:1199,17:1099,18:1399,19:1299,20:1099}

SETS=[('Fashion','Men','T-Shirts','tshirts'),('Fashion','Men','Shirts','shirts'),('Fashion','Men','Pants','pants'),('Fashion','Men','Jeans','jeans'),('Fashion','Women','Tops','tops'),('Fashion','Women','Dresses','dresses'),('Fashion','Women','Sarees','sarees'),('Fashion','Shoes','Shoes','shoes'),('Fashion','Kids','Boys','tshirts'),('Fashion','Kids','Girls','dresses'),('Electronics','Electronics','Mobiles','mobiles'),('Electronics','Electronics','Laptops','laptops'),('Electronics','Electronics','Earbuds','earbuds'),('Electronics','Electronics','Watches','watches'),('Electronics','Electronics','Cameras','cameras'),('Toys','Toys','Toys','toys'),('Accessories','Accessories','Belts','belts'),('Accessories','Accessories','Wallets','wallets'),('Accessories','Accessories','Sunglasses','sunglasses'),('Accessories','Accessories','Caps','caps'),('Accessories','Accessories','Perfumes','perfumes'),('Home & Kitchen','Home & Kitchen','Home Essentials','home'),('Beauty','Beauty','Beauty','beauty'),('Sports','Sports','Sports & Fitness','sports'),('Books','Books','Books','books'),('Grocery','Grocery','Grocery','grocery')]
BRANDS=['Raven','Nova','UrbanX','Prime','Aero','Vibe','Zen','Elite','Max','Vertex']
class Command(BaseCommand):
 def handle(self,*args,**kwargs):
  Category.objects.all().delete(); Product.objects.all().delete(); created=0
  for main,sub,child,key in SETS:
   parent,_=Category.objects.get_or_create(name=main,slug=slugify(main))
   subcat,_=Category.objects.get_or_create(name=f'{sub} {main}',slug=slugify(f'{sub}-{main}'),parent=parent)
   cat_image=MOBILE_IMAGES[1] if key=='mobiles' else LAPTOP_IMAGES[1] if key=='laptops' else TSHIRT_IMAGES[1] if key=='tshirts' else SHIRT_IMAGES.get(1) if key=='shirts' else PANTS_IMAGES.get(1) if key=='pants' else TOPS_IMAGES[1] if key=='tops' else SAREE_IMAGES[21] if key=='sarees' else EARBUD_IMAGES[1] if key=='earbuds' else WATCH_IMAGES[1] if key=='watches' else CAMERA_IMAGES[1] if key=='cameras' else TOY_IMAGES[1] if key=='toys' else BELT_IMAGES[1] if key=='belts' else SUNGLASSES_IMAGES[1] if key=='sunglasses' else CAP_IMAGES[1] if key=='caps' else BEAUTY_IMAGES[1] if key=='beauty' else BOOK_IMAGES[1] if key=='books' else GROCERY_IMAGES[1] if key=='grocery' else SPORTS_IMAGES[1] if key=='sports' else HOME_IMAGES[1] if key=='home' else PERFUME_IMAGES[1] if key=='perfumes' else WALLET_IMAGES[1] if key=='wallets' else IMG[key]
   cat,_=Category.objects.get_or_create(name=child,slug=slugify(f'{main}-{sub}-{child}'),parent=subcat,image=cat_image)
   count=23 if key=='sarees' else 19 if key in ['shirts','dresses'] else 17 if key=='pants' else 14 if key=='jeans' else 25 if key=='shoes' else 20
   if key=='shoes':
    product_numbers=range(1,26)
   else:
    product_numbers=range(1,count+1)
   for i in product_numbers:
    base=(TOPS_PRICES[i] if key=='tops' else DRESSES_PRICES[i] if key=='dresses' else SAREE_PRICES.get(i,random.randint(799,3999)) if key=='sarees' else BEAUTY_PRICES[i] if key=='beauty' else BOOK_PRICES[i] if key=='books' else CAP_PRICES[i] if key=='caps' else GROCERY_PRICES[i] if key=='grocery' else SPORTS_PRICES[i] if key=='sports' else HOME_PRICES[i] if key=='home' else PERFUME_PRICES[i] if key=='perfumes' else WALLET_PRICES[i] if key=='wallets' else random.randint(499,69999)); mrp=(TOPS_MRPS[i] if key=='tops' else DRESSES_MRPS[i] if key=='dresses' else SAREE_MRPS.get(i,round(base/(random.choice([.55,.65,.7,.75,.8])))) if key=='sarees' else BEAUTY_MRPS[i] if key=='beauty' else BOOK_MRPS[i] if key=='books' else CAP_MRPS[i] if key=='caps' else GROCERY_MRPS[i] if key=='grocery' else SPORTS_MRPS[i] if key=='sports' else HOME_MRPS[i] if key=='home' else PERFUME_MRPS[i] if key=='perfumes' else WALLET_MRPS[i] if key=='wallets' else round(base/(random.choice([.55,.65,.7,.75,.8])),2)); disc=round((mrp-base)/mrp*100)
    sizes=['S','M','L','XL','XXL'] if key in ['tshirts','shirts','tops','dresses','pants','jeans','shoes'] else []
    is_mobile=key=='mobiles'
    is_laptop=key=='laptops'
    product_name=MOBILE_NAMES.get(i,f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}') if is_mobile else LAPTOP_NAMES.get(i,f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}') if is_laptop else TSHIRT_NAMES.get(i,f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}') if key=='tshirts' else SHIRT_NAMES.get(i,f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}') if key=='shirts' else PANTS_NAMES.get(i,f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}') if key=='pants' else JEANS_NAMES.get(i,f'Raven Jeans {i:02d}') if key=='jeans' else SHOES_NAMES.get(i,f'Raven {child} {i:02d}') if key=='shoes' else DRESSES_NAMES.get(i,f'Raven {child} {i:02d}') if key=='dresses' else TOPS_NAMES.get(i,f'Raven {child} {i:02d}') if key=='tops' else SAREE_NAMES.get(i,f'Raven {child} {i:02d}') if key=='sarees' else EARBUD_NAMES.get(i,f'Raven Earbuds {i:02d}') if key=='earbuds' else WATCH_NAMES.get(i,f'Raven Watch {i:02d}') if key=='watches' else CAMERA_NAMES.get(i,f'Raven Camera {i:02d}') if key=='cameras' else TOY_NAMES.get(i,f'Raven Toy {i:02d}') if key=='toys' else BELT_NAMES.get(i,f'Raven Belt {i:02d}') if key=='belts' else SUNGLASSES_NAMES.get(i,f'Raven Sunglasses {i:02d}') if key=='sunglasses' else CAP_NAMES.get(i,f'Raven Cap {i:02d}') if key=='caps' else BEAUTY_NAMES.get(i,f'Raven Beauty {i:02d}') if key=='beauty' else GROCERY_NAMES.get(i,f'Raven Grocery {i:02d}') if key=='grocery' else SPORTS_NAMES.get(i,f'Raven Sports {i:02d}') if key=='sports' else HOME_NAMES.get(i,f'Raven Home {i:02d}') if key=='home' else PERFUME_NAMES.get(i,f'Raven Perfume {i:02d}') if key=='perfumes' else WALLET_NAMES.get(i,f'Raven Wallet {i:02d}') if key=='wallets' else f'{BRANDS[i%len(BRANDS)]} {child} {i:02d}'
    product_brand=MOBILE_BRANDS.get(i,BRANDS[i%len(BRANDS)]) if is_mobile else LAPTOP_BRANDS.get(i,BRANDS[i%len(BRANDS)]) if is_laptop else TSHIRT_BRANDS.get(i,BRANDS[i%len(BRANDS)]) if key=='tshirts' else SHIRT_BRANDS.get(i,BRANDS[i%len(BRANDS)]) if key=='shirts' else PANTS_BRANDS.get(i,BRANDS[i%len(BRANDS)]) if key=='pants' else JEANS_BRANDS.get(i,'Raven') if key=='jeans' else SHOES_BRANDS.get(i,'Raven') if key=='shoes' else DRESSES_BRANDS.get(i,'Raven') if key=='dresses' else TOPS_BRANDS.get(i,'Raven') if key=='tops' else SAREE_BRANDS.get(i,'Raven Women') if key=='sarees' else EARBUD_BRANDS.get(i,'Raven') if key=='earbuds' else WATCH_BRANDS.get(i,'Raven') if key=='watches' else CAMERA_BRANDS.get(i,'Raven Camera') if key=='cameras' else TOY_BRANDS.get(i,'Raven Kids') if key=='toys' else BELT_BRANDS.get(i,'Raven') if key=='belts' else SUNGLASSES_BRANDS.get(i,'Raven') if key=='sunglasses' else CAP_BRANDS.get(i,'Raven') if key=='caps' else BEAUTY_BRANDS.get(i,'Raven') if key=='beauty' else BOOK_BRANDS.get(i,'Raven Books') if key=='books' else GROCERY_BRANDS.get(i,'Raven') if key=='grocery' else SPORTS_BRANDS.get(i,'Raven') if key=='sports' else HOME_BRANDS.get(i,'Raven Home') if key=='home' else PERFUME_BRANDS.get(i,'Raven') if key=='perfumes' else WALLET_BRANDS.get(i,'Raven') if key=='wallets' else BRANDS[i%len(BRANDS)]
    product_image=MOBILE_IMAGES.get(i) if is_mobile else LAPTOP_IMAGES.get(i) if is_laptop else TSHIRT_IMAGES.get(i) if key=='tshirts' else SHIRT_IMAGES.get(i) if key=='shirts' else PANTS_IMAGES.get(i) if key=='pants' else JEANS_IMAGES.get(i) if key=='jeans' else SHOES_IMAGES.get(i) if key=='shoes' else DRESSES_IMAGES.get(i) if key=='dresses' else TOPS_IMAGES.get(i) if key=='tops' else SAREE_IMAGES.get(i) if key=='sarees' else EARBUD_IMAGES.get(i) if key=='earbuds' else WATCH_IMAGES.get(i) if key=='watches' else CAMERA_IMAGES.get(i) if key=='cameras' else TOY_IMAGES.get(i) if key=='toys' else BELT_IMAGES.get(i) if key=='belts' else SUNGLASSES_IMAGES.get(i) if key=='sunglasses' else CAP_IMAGES.get(i) if key=='caps' else BEAUTY_IMAGES.get(i) if key=='beauty' else BOOK_IMAGES.get(i) if key=='books' else GROCERY_IMAGES.get(i) if key=='grocery' else SPORTS_IMAGES.get(i) if key=='sports' else HOME_IMAGES.get(i) if key=='home' else PERFUME_IMAGES.get(i) if key=='perfumes' else WALLET_IMAGES.get(i) if key=='wallets' else f'https://loremflickr.com/600/600/{key}?lock={i}'
    if not product_image:
     product_image=IMG.get(key, f'https://loremflickr.com/600/600/product?lock={i}')
    Product.objects.create(name=product_name,brand=product_brand,category=cat,price=base,mrp=mrp,discount=disc,image=product_image,description=f'Premium {child.lower()} with modern design, quality materials and reliable everyday performance.',rating=(TOPS_RATINGS[i] if key=='tops' else round(random.uniform(4.0,4.9),1)),reviews=(120+i*37 if key=='tops' else random.randint(40,3200)),stock=(TOPS_STOCK[i] if key=='tops' else random.randint(10,100)),sizes=sizes,colors=['Black','White','Blue','Red'] if key not in ['books','grocery'] else [],featured=i<=4)
    created+=1
  self.stdout.write(self.style.SUCCESS(f'Created {created} products across {len(SETS)} subcategories.'))
