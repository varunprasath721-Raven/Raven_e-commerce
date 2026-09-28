import React,{useEffect,useMemo,useState,useCallback,useRef,createContext,useContext} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,Link,useNavigate,useParams,useLocation} from 'react-router-dom';
import axios from 'axios';
import {Search,ShoppingCart,Heart,User,Menu,ChevronRight,Star,Truck,ShieldCheck,RotateCcw,Plus,Minus,Trash2,SlidersHorizontal,Package,LayoutDashboard,LogIn,X,Mail,Phone,MapPin} from 'lucide-react';
import './styles.css';
const API='http://127.0.0.1:8000/api';

const SPORTS_IMAGES={};
for(let i=1;i<=19;i++) SPORTS_IMAGES[i]=`/product-images/sports/sports-${String(i).padStart(2,'0')}.png`;
SPORTS_IMAGES[20]='/product-images/sports/sports-20.svg';
const SPORTS_NAMES={1:'STIGA Table Tennis Balls - 6 Ball Pack',2:'SG Club Cricket Ball',3:'Adidas Predator Goalkeeper Gloves',4:'Nike Running Shoes',5:'Wilson Ultra Tennis Racket',6:'Wilson Evolution Basketball',7:'Raven Speed Skipping Rope',8:'Raven 10KG Hex Dumbbells',9:'Yonex Badminton Racket',10:'Everlast Elite Boxing Gloves',11:'SG English Willow Cricket Bat',12:'Adidas Tango Glider Football',13:'Nike Mercurial Football Boots',14:'VirtuFit 16KG Kettlebell',15:'Mikasa V200W Volleyball',16:'Raven Sports Performance Jersey',17:'Raven Rider Skateboard',18:'STIGA Table Tennis Bat & Balls Set',19:'Nike Sports Training Backpack',20:'Raven Sports Training Equipment'};
const SPORTS_BRANDS={1:'STIGA',2:'SG',3:'Adidas',4:'Nike',5:'Wilson',6:'Wilson',7:'Raven',8:'Raven',9:'Yonex',10:'Everlast',11:'SG',12:'Adidas',13:'Nike',14:'VirtuFit',15:'Mikasa',16:'Raven',17:'Raven',18:'STIGA',19:'Nike',20:'Raven'};

const HOME_IMAGES={};
for(let i=1;i<=19;i++) HOME_IMAGES[i]=`/product-images/home/home-${String(i).padStart(2,'0')}.jpg`;
HOME_IMAGES[20]='/product-images/home/home-20.svg';

// Real perfume photos supplied in this project update (19 user images + 1 RavenMart catalog image).
const PERFUME_IMAGES={};
for(let i=1;i<=20;i++) PERFUME_IMAGES[i]=`/product-images/perfumes/perfume-${String(i).padStart(2,'0')}.jpg`;
const PERFUME_NAMES={
 1:'Savagery Pour Homme Eau de Parfum',2:"Versace Dylan Blue Inspired Men's Perfume",3:"Coach Silver Men's Fragrance",4:'Blue Fresh Eau de Parfum',5:"Boss The Scent Men's Perfume",
 6:'Silverlake For Men Eau de Parfum',7:'Savagery Pour Homme Premium Edition',8:'Blue For Men Premium Fragrance',9:'Black Ribbed Signature Perfume',10:'Layke Flame Black & Gold Perfume',
 11:'Johan.b Rich Icone For Men',12:'Louis Vuitton Style Black Perfume',13:'Noir Essentials Pour Homme',14:'Trussardi Uomo',15:'Ereva Parfum',
 16:'Guess Uomo Intenso',17:"Raven Classic White Men's Perfume",18:'Clive Christian Masculine Perfume',19:'Raven Black Gold Signature Perfume',20:'RavenMart Premium Perfume Collection'
};
const PERFUME_BRANDS={1:'Savagery',2:'Versace',3:'Coach',4:'Raven',5:'BOSS',6:'Silverlake',7:'Savagery',8:'Raven',9:'Raven',10:'Raven',11:'Johan.b',12:'Louis Vuitton',13:'Noir Essentials',14:'Trussardi',15:'Ereva',16:'GUESS',17:'Raven',18:'Clive Christian',19:'Raven',20:'RavenMart'};


// Wallet category: 20 local catalog photos.
const WALLET_IMAGES={};
for(let i=1;i<=20;i++) WALLET_IMAGES[i]=`/product-images/wallets/wallet-${String(i).padStart(2,'0')}.jpg`;
const WALLET_NAMES={
 1:'Classic Brown Leather Bifold Wallet',2:'Tan Minimal Leather Wallet',3:'Dark Brown Compact Bifold Wallet',
 4:'Black RFID Leather Wallet',5:'Giorgio Armani Style Black Wallet',6:'Tom Ford Style Brown Leather Wallet',
 7:'Slim Tan Card Holder Wallet',8:'Black Carbon Texture Wallet',9:'Navy Minimalist Leather Wallet',
 10:'Vintage Tan Leather Bifold Wallet',11:'Bally Style Black Leather Wallet',12:'Premium Brown Contrast-Stitch Wallet',
 13:'Teskyer Style Slim RFID Wallet',14:'Grey Pebble Leather Wallet',15:'Classic Tan Leather Wallet',
 16:'Raven Classic Black Leather Wallet',17:'Raven Dark Brown Compact Wallet',18:'Raven Carbon Texture Bifold Wallet',
 19:'Raven Deep Brown Leather Wallet',20:'Raven Navy Minimal Wallet'
};
const WALLET_BRANDS={1:'Raven',2:'Raven',3:'Raven',4:'Raven',5:'Raven',6:'Raven',7:'Raven',8:'Raven',9:'Raven',10:'Raven',11:'Raven',12:'Raven',13:'Raven',14:'Raven',15:'Raven',16:'Raven',17:'Raven',18:'Raven',19:'Raven',20:'Raven'};

const PHOTO_QUERY={
  mobiles:'smartphone product',
  laptops:'laptop computer product',
  tshirts:'tshirt fashion product',
  shirts:'dress shirt fashion product',
  pants:'trousers fashion product',
  jeans:'jeans fashion product',
  shoes:'sneakers shoes product',
  tops:'women top fashion product',
  dresses:'dress fashion product',
  sarees:'saree fashion product',
  earbuds:'wireless earbuds product',
  watches:'wrist watch product',
  cameras:'digital camera product',
  toys:'toy product',
  belts:'leather belt product',
  wallets:'leather wallet product',
  sunglasses:'sunglasses product',
  caps:'cap hat product',
  perfumes:'perfume bottle product',
  home:'home kitchen product',
  beauty:'cosmetics beauty product',
  sports:'sports equipment product',
  books:'book product',
  grocery:'grocery food product'
};


// Real wireless-earbud photos supplied in this project.

// Real grocery product photos supplied for the Grocery category (19 user images + 1 project-original image).
const GROCERY_IMAGES={};
for(let i=1;i<=20;i++) GROCERY_IMAGES[i]=`/product-images/grocery/grocery-${String(i).padStart(2,'0')}.jpg`;
const GROCERY_NAMES={1:'Dabur Honey 100% Pure',2:'Heinz Tomato Ketchup',3:'Dabur Creamy Peanut Butter',4:'Dhara Sugar',5:'Aashirvaad Whole Wheat Atta',6:'Fortune Sunlite Refined Sunflower Oil - Large Pack',7:'Daawat Original Basmati Rice',8:'Tata Sampann Toor Dal',9:'Aashirvaad Sona Masoori Rice',10:'Nestlé NIDO FortiGrow Milk Powder',11:'Tata Sampann Unpolished Masoor Dal',12:'Tata Salt Iodised Salt',13:'Tata Tea Gold',14:'Fortune Sunlite Refined Sunflower Oil',15:'India Gate Basmati Rice Regular Choice',16:'Maggi 2-Minute Masala Noodles',17:'Britannia Good Day Butter Cookies',18:'India Gate Basmati Rice Classic',19:'Madhur Pure & Hygienic Sugar',20:'Raven Premium Moong Dal'};
const GROCERY_BRANDS={1:'Dabur',2:'Heinz',3:'Dabur',4:'Dhara',5:'Aashirvaad',6:'Fortune',7:'Daawat',8:'Tata Sampann',9:'Aashirvaad',10:'Nestlé',11:'Tata Sampann',12:'Tata',13:'Tata Tea',14:'Fortune',15:'India Gate',16:'Maggi',17:'Britannia',18:'India Gate',19:'Madhur',20:'Raven'};

const EARBUD_IMAGES={};
for(let i=1;i<=20;i++) EARBUD_IMAGES[i]=`/product-images/earbuds/earbuds-${String(i).padStart(2,'0')}.jpg`;
const EARBUD_NAMES={
  1:'Redmi Buds 6',2:'realme Buds T200',3:'OnePlus Buds Z2',4:'Samsung Galaxy Buds 3',5:'OnePlus Buds Z2 - Box Photo',
  6:'boAt Airdopes 148',7:'Sony LinkBuds Fit',8:'JBL Live Pro 2',9:'JBL Tune Buds 2',10:'Samsung Galaxy Buds 3 - Alternate Photo',
  11:'boAt Airdopes 120',12:'CMF Buds Neo',13:'JBL Live Pro 2 - White',14:'Sony WF-C700N',15:'Nothing Ear (a)',
  16:'OnePlus Buds 3',17:'boAt Airdopes Zing',18:'Bose QuietComfort Earbuds',19:'Sony WF-C510',20:'Redmi Buds 6 - Alternate Photo'
};
const EARBUD_BRANDS={1:'Redmi',2:'realme',3:'OnePlus',4:'Samsung',5:'OnePlus',6:'boAt',7:'Sony',8:'JBL',9:'JBL',10:'Samsung',11:'boAt',12:'Nothing',13:'JBL',14:'Sony',15:'Nothing',16:'OnePlus',17:'boAt',18:'Bose',19:'Sony',20:'Redmi'};

// Real smartwatch photos supplied by the user.
const WATCH_IMAGES={};
for(let i=1;i<=20;i++) WATCH_IMAGES[i]=`/product-images/watches/watch-${String(i).padStart(2,'0')}.jpg`;
const WATCH_NAMES={
  1:'Apple Watch',2:'Samsung Galaxy Watch',3:'OnePlus Watch',4:'Amazfit GTR',5:'Garmin Venu',
  6:'Huawei Watch',7:'boAt Enigma',8:'boAt Storm',9:'Noise ColorFit',10:'Fire-Boltt Ninja',
  11:'Fire-Boltt Phoenix',12:'Fastrack Revoltt',13:'Titan Celestor',14:'Google Pixel Watch',15:'Redmi Watch',
  16:'Xiaomi Watch',17:'Realme Watch',18:'Honor Watch',19:'CMF Watch',20:'Fossil Smartwatch'
};
const WATCH_BRANDS={
  1:'Apple',2:'Samsung',3:'OnePlus',4:'Amazfit',5:'Garmin',6:'Huawei',7:'boAt',8:'boAt',9:'Noise',10:'Fire-Boltt',
  11:'Fire-Boltt',12:'Fastrack',13:'Titan',14:'Google',15:'Redmi',16:'Xiaomi',17:'Realme',18:'Honor',19:'CMF',20:'Fossil'
};

// Real camera photos supplied with this project.
const CAMERA_IMAGES={};
for(let i=1;i<=20;i++) CAMERA_IMAGES[i]=`/product-images/cameras/camera-${String(i).padStart(2,'0')}.jpg`;
const CAMERA_NAMES={};
for(let i=1;i<=20;i++) CAMERA_NAMES[i]=`Raven Camera ${String(i).padStart(2,'0')}`;
const CAMERA_BRANDS={};
for(let i=1;i<=20;i++) CAMERA_BRANDS[i]='Raven Camera';

// Real kids-toys photos supplied for the Toys category.

const BELT_IMAGES={};
for(let i=1;i<=19;i++) BELT_IMAGES[i]=`/product-images/belts/belt-${String(i).padStart(2,'0')}.jpg`;
BELT_IMAGES[20]='/product-images/belts/belt-20.svg';
const BELT_NAMES={
 1:'Perforated Black Leather Belt',2:'Raven Black Contrast Stitch Belt',3:'Brown Crocodile Texture Belt',4:'Classic Brown Leather Belt',5:'Black Diamond Texture Belt',
 6:'Tan Leather Belt',7:'Raven Suede Leather Belt',8:'Raven H-Buckle Black Belt',9:'Raven Automatic Buckle Black Belt',10:'Navy Blue Leather Belt',
 11:'Raven Classic Black Leather Belt',12:'Raven Double-G Buckle Brown Belt',13:'Raven Stripe Canvas Belt',14:'Dark Brown Premium Leather Belt',15:'Raven Olive Canvas Belt',
 16:'Raven Minimalist Black Belt',17:'Raven Black Textured Leather Belt',18:'Raven Reversible Black & Brown Belt',19:'Raven Braided Black Belt',20:'Raven Premium Leather Belt'
};
const BELT_BRANDS=Object.fromEntries(Array.from({length:20},(_,i)=>[i+1,'Raven']));

// Real sunglasses photos supplied in the current project update.
const SUNGLASSES_IMAGES={};
for(let i=1;i<=20;i++) SUNGLASSES_IMAGES[i]=`/product-images/sunglasses/sunglasses-${String(i).padStart(2,'0')}.jpg`;
const SUNGLASSES_NAMES={
  1:'Raven Sport Shield Sunglasses',
  2:'Raven Classic Aviator Sunglasses',
  3:'Raven Black Wayfarer Sunglasses',
  4:'Raven Silver Aviator Sunglasses',
  5:'Raven Round Black Sunglasses',
  6:'Raven Orange Street Sunglasses',
  7:'Raven Oversized Purple Lens Sunglasses',
  8:'Raven Rose Gold Round Sunglasses',
  9:'Raven Blue Classic Sunglasses',
  10:'Raven Black Gold Rectangle Sunglasses',
  11:'Raven Tortoise Square Sunglasses',
  12:'Raven Black Gold Aviator Sunglasses',
  13:'Raven Blue Round Sunglasses',
  14:'Raven Premium Silver Frame Sunglasses',
  15:'Raven Classic Round Grey Sunglasses',
  16:'Raven Black Metal Sunglasses',
  17:'Raven Purple Gradient Sunglasses',
  18:'Raven Luxury Black Square Sunglasses',
  19:'Raven Purple Cat-Eye Sunglasses',
  20:'Raven Mirror-Style Black Sunglasses'
};
const SUNGLASSES_BRANDS=Object.fromEntries(Array.from({length:20},(_,i)=>[i+1,'Raven']));

// Real cap photos supplied in the current project update.
const CAP_IMAGES={};
for(let i=1;i<=20;i++) CAP_IMAGES[i]=`/product-images/caps/cap-${String(i).padStart(2,'0')}.jpg`;
const CAP_NAMES={
 1:'Raven Olive Cotton Baseball Cap',2:'Raven Beige Black Contrast Cap',3:'Raven Classic White Baseball Cap',4:'Raven Mustard Yellow Baseball Cap',5:'Raven Navy Blue Baseball Cap',
 6:'Raven Orange Cotton Baseball Cap',7:'Raven Classic Black Baseball Cap',8:'Raven Purple Casual Cap',9:'Raven Cream Black Logo Cap',10:'Raven Royal Blue Snapback Cap',
 11:'Raven Sky Blue Baseball Cap',12:'Raven Pink Cotton Cap',13:'Raven Red Classic Baseball Cap',14:'Raven Black Embroidered Cap',15:'Raven Red Curved Brim Cap',
 16:'Raven Forest Green Logo Cap',17:'Raven Navy Performance Cap',18:'Raven Black Embroidered Baseball Cap',19:'Raven Olive Lightweight Cap',20:'Raven Charcoal Cotton Baseball Cap'
};
const CAP_BRANDS=Object.fromEntries(Array.from({length:20},(_,i)=>[i+1,'Raven']));
const CAP_PRICES={1:499,2:549,3:449,4:499,5:549,6:499,7:449,8:499,9:599,10:649,11:499,12:449,13:499,14:699,15:499,16:649,17:799,18:699,19:549,20:499};
const CAP_MRPS={1:899,2:999,3:799,4:899,5:999,6:899,7:799,8:899,9:1099,10:1199,11:899,12:799,13:899,14:1299,15:899,16:1199,17:1399,18:1299,19:999,20:899};

// Beauty photos installed for the Beauty category.
const BEAUTY_IMAGES={};
for(let i=1;i<=20;i++) BEAUTY_IMAGES[i]=`/product-images/beauty/beauty-${String(i).padStart(2,'0')}.jpg`;
const BEAUTY_NAMES={1:'Lotus Herbals Radiant Glow Face Serum',2:'Garnier Hydra Bomb Pomegranate Sheet Mask',3:'TRESemmé Keratin Smooth Shampoo',4:'Maybelline Fit Me Concealer',5:'Makeup Revolution Highlighter',6:'Nykaa Sketch Liquid Eyeliner',7:'M.A.C Matte Lipstick Ruby Woo',8:'Maybelline Lifter Gloss',9:'Maybelline Fit Me Matte + Poreless Compact Powder',10:'Maybelline Lash Sensational Mascara',11:'Versace Bright Crystal Eau de Toilette',12:'Vaseline Intensive Care Deep Moisture Body Lotion',13:'Neutrogena Hydro Boost Water Gel',14:'Maybelline Fit Me Matte + Poreless Foundation',15:'Dove Intense Repair Conditioner',16:'MARS Professional Makeup Brush Set',17:'Lakmé Sun Expert SPF 50 PA+++ Sunscreen Gel',18:'Maybelline The Nudes Eyeshadow Palette',19:'Simple Refreshing Facial Wash',20:'Raven Beauty Essentials Makeup Kit'};
const BEAUTY_BRANDS={1:'Lotus Herbals',2:'Garnier',3:'TRESemmé',4:'Maybelline',5:'Makeup Revolution',6:'Nykaa',7:'M.A.C',8:'Maybelline',9:'Maybelline',10:'Maybelline',11:'Versace',12:'Vaseline',13:'Neutrogena',14:'Maybelline',15:'Dove',16:'MARS',17:'Lakmé',18:'Maybelline',19:'Simple',20:'Raven'};
const BEAUTY_PRICES={1:699,2:349,3:499,4:399,5:599,6:499,7:1899,8:699,9:549,10:649,11:5499,12:399,13:899,14:699,15:399,16:799,17:549,18:999,19:299,20:899};
const BEAUTY_MRPS={1:999,2:499,3:699,4:599,5:899,6:699,7:2299,8:899,9:799,10:899,11:6999,12:599,13:1199,14:899,15:599,16:1199,17:799,18:1399,19:449,20:1299};

const BOOK_IMAGES={};
for(let i=1;i<=20;i++) BOOK_IMAGES[i]=`/product-images/books/book-${String(i).padStart(2,'0')}.jpg`;
const BOOK_NAMES={
  1:'React Up & Running',
  2:'Database Management Systems',
  3:'Deep Learning: Neural Networks and AI',
  4:'Web Development Full Stack Guide',
  5:'Data Science: Concepts, Tools and Projects',
  6:'JavaScript: The Complete Guide',
  7:'C Programming Mastery',
  8:'Web Development: A Complete Guide',
  9:'TypeScript Modern JavaScript Development',
  10:'HTML & CSS Modern Web Design',
  11:'SQL & Database Design',
  12:'Git & GitHub Version Control Essentials',
  13:'Excel Data Analysis',
  14:'Personal Finance for Beginners',
  15:'Machine Learning',
  16:'Python Programming for Beginners',
  17:'Data Science for Beginners',
  18:'Cybersecurity: A Practical Guide',
  19:'Java Programming Complete Developer Guide',
  20:'Django Web Development'
};
const BOOK_BRANDS={
  1:"O'Reilly",2:'McGraw Hill',3:'Packt',4:'Raven Books',5:'Raven Books',
  6:'Raven Books',7:'Raven Books',8:'TechPress',9:'Raven Books',10:'Raven Books',
  11:'Raven Books',12:"O'Reilly",13:'Raven Books',14:'Raven Books',15:'Wiley',
  16:'Wiley',17:'NextGen Press',18:'Wiley',19:'Raven Books',20:'Raven Books'
};
const BOOK_PRICES={1:899,2:1199,3:1099,4:999,5:899,6:799,7:699,8:949,9:999,10:749,11:899,12:799,13:699,14:599,15:1299,16:799,17:899,18:1099,19:899,20:999};
const BOOK_MRPS={1:1299,2:1699,3:1499,4:1399,5:1299,6:1199,7:999,8:1399,9:1499,10:1099,11:1299,12:1199,13:999,14:899,15:1799,16:1199,17:1299,18:1599,19:1299,20:1499};

const TOY_IMAGES={};
for(let i=1;i<=20;i++) TOY_IMAGES[i]=`/product-images/toys/toy-${String(i).padStart(2,'0')}.jpg`;
const TOY_NAMES={
  1:'Classic Teddy Bear Plush Toy',2:'Remote Control Off-Road Racing Car',3:'Dinosaur T-Rex Action Toy',4:'Colorful Building Blocks Castle Set',5:'Kids Animal Jigsaw Puzzle',
  6:'Pretty Doll in Pink Dress',7:'Wild Animal Figure Set',8:'Colorful Toy Train Set',9:'Red Sports Racing Toy Car',10:'Interactive Robot Toy',
  11:'Princess Castle Play Set',12:'Little Chef Kids Kitchen Set',13:'Creative Kids Drawing & Art Kit',14:'Magical Unicorn Plush Toy',15:'Kids Toy Airplane',
  16:'Magic Tricks Pretend Play Set',17:'Kids Football',18:'Baby Puppy Soft Toy',19:'Kids Science Experiment Kit',20:'Kids Dart Target Game'
};
const TOY_BRANDS={
  1:'Raven Kids',2:'Raven Kids',3:'Raven Kids',4:'Raven Kids',5:'Raven Kids',6:'Raven Kids',7:'Raven Kids',8:'Raven Kids',9:'Raven Kids',10:'Raven Kids',
  11:'Raven Kids',12:'Raven Kids',13:'Raven Kids',14:'Raven Kids',15:'Raven Kids',16:'Raven Kids',17:'Raven Kids',18:'Raven Kids',19:'Raven Kids',20:'Raven Kids'
};

const TSHIRT_IMAGES={
  1:'/product-images/tshirts/tshirt-01.jpg',2:'/product-images/tshirts/tshirt-02.jpg',3:'/product-images/tshirts/tshirt-03.jpg',4:'/product-images/tshirts/tshirt-04.jpg',5:'/product-images/tshirts/tshirt-05.jpg',
  6:'/product-images/tshirts/tshirt-06.jpg',7:'/product-images/tshirts/tshirt-07.jpg',8:'/product-images/tshirts/tshirt-08.jpg',9:'/product-images/tshirts/tshirt-09.jpg',10:'/product-images/tshirts/tshirt-10.jpg',
  11:'/product-images/tshirts/tshirt-11.jpg',12:'/product-images/tshirts/tshirt-12.jpg',13:'/product-images/tshirts/tshirt-13.jpg',14:'/product-images/tshirts/tshirt-14.jpg',15:'/product-images/tshirts/tshirt-15.jpg',
  16:'/product-images/tshirts/tshirt-16.jpg',17:'/product-images/tshirts/tshirt-17.jpg',18:'/product-images/tshirts/tshirt-18.jpg',19:'/product-images/tshirts/tshirt-19.jpg',20:'/product-images/tshirts/tshirt-20.jpg'
};
const TSHIRT_NAMES={
  1:'One Piece Luffy Punch Graphic Tee',2:'Reebok Speedwick Training T-Shirt',3:'Dragon Ball Z Goku Orange Graphic Tee',4:'Dragon Ball Z Goku Power Graphic Tee',5:'One Piece Luffy Graphic Tee',
  6:'Nike Sportswear Swoosh T-Shirt',7:'One Piece Manga Panel Tee',8:'Goku Orange Anime Graphic Tee',9:'Tommy Hilfiger Essential Logo Tee',10:'One Piece Zoro Graphic Tee',
  11:'Puma Graphic Sneaker Tee',12:'Adidas Essentials Logo Tee',13:'Goku Line Art Graphic Tee',14:'Naruto Team Graphic Tee',15:'Adidas Essentials Navy Tee',
  16:'Naruto Graphic Black Tee',17:"Levi's Classic White T-Shirt",18:'Jujutsu Kaisen Gojo Graphic Tee',19:'Puma Logo Graphic Tee',20:'One Piece Zoro Model Graphic Tee'
};
const TSHIRT_BRANDS={
  1:'One Piece',2:'Reebok',3:'Dragon Ball Z',4:'Dragon Ball Z',5:'One Piece',6:'Nike',7:'One Piece',8:'Dragon Ball Z',9:'Tommy Hilfiger',10:'One Piece',
  11:'Puma',12:'Adidas',13:'Dragon Ball Z',14:'Naruto',15:'Adidas',16:'Naruto',17:"Levi's",18:'Jujutsu Kaisen',19:'Puma',20:'One Piece'
};
const SHIRT_IMAGES={
  1:'/product-images/shirts/shirt-01.jpg',2:'/product-images/shirts/shirt-02.jpg',3:'/product-images/shirts/shirt-03.jpg',4:'/product-images/shirts/shirt-04.jpg',5:'/product-images/shirts/shirt-05.jpg',
  6:'/product-images/shirts/shirt-06.jpg',7:'/product-images/shirts/shirt-07.jpg',8:'/product-images/shirts/shirt-08.jpg',9:'/product-images/shirts/shirt-09.jpg',10:'/product-images/shirts/shirt-10.jpg',
  11:'/product-images/shirts/shirt-11.jpg',12:'/product-images/shirts/shirt-12.jpg',13:'/product-images/shirts/shirt-13.jpg',14:'/product-images/shirts/shirt-14.jpg',15:'/product-images/shirts/shirt-15.jpg',
  16:'/product-images/shirts/shirt-16.jpg',17:'/product-images/shirts/shirt-17.jpg',18:'/product-images/shirts/shirt-18.jpg',19:'/product-images/shirts/shirt-19.jpg'
};
const SHIRT_NAMES={
  1:'Red Black Classic Check Shirt',2:'Abstract Graphic Short Sleeve Shirt',3:'Beige Oxford Casual Shirt',4:'Nike ACG Printed Short Sleeve Shirt',5:'Classic Blue Short Sleeve Shirt',6:'Light Grey Formal Shirt',7:'Puma Geometric Resort Shirt',8:'Navy Premium Oxford Shirt',9:'Beige Roll-Up Sleeve Casual Shirt',10:'Blue Denim Button-Down Shirt',11:'Classic White Formal Shirt',12:'Blue Casual Cotton Shirt',13:'Puma Geometric Printed Shirt',14:'Light Blue Oxford Shirt',15:'Olive Green Premium Shirt',16:'Black Floral Printed Shirt',17:'Green Black Check Shirt',18:'Adidas Character Printed Shirt',19:'Black White Check Shirt'
};
const SHIRT_BRANDS={
  1:'Jack & Jones',2:'Raven',3:'GAP',4:'Nike',5:'H&M',6:'Van Heusen',7:'Puma',8:'U.S. Polo Assn.',9:'Roadster',10:"Levi's",11:'Louis Philippe',12:'Mufti',13:'Puma',14:'H&M',15:'U.S. Polo Assn.',16:'Puma',17:'Urban Classics',18:'Adidas',19:'Allen Solly'
};

const PANTS_IMAGES={};
for(let i=1;i<=17;i++) PANTS_IMAGES[i]=`/product-images/pants/pants-${String(i).padStart(2,'0')}.jpg`;
const PANTS_NAMES={
  1:'Puma Beige Essential Jogger Pants',2:'Puma Red Classic Track Pants',3:'Puma Grey Training Pants',4:'Puma Black White Track Pants',5:'Adidas Black Relaxed Track Pants',
  6:'Nike Black Cargo Utility Pants',7:'Puma Black Cargo Pants',8:'Allen Solly Olive Slim Fit Trousers',9:'Nike Black Training Pants',10:"Levi's Light Blue Straight Jeans",
  11:"Levi's Dark Blue Straight Jeans",12:'Louis Philippe Navy Formal Trousers',13:"Levi's Dark Indigo Slim Jeans",14:'Raven Black Everyday Joggers',15:'Puma Black Red Track Pants',
  16:'Louis Philippe Grey Checked Formal Trousers',17:'Adidas Black 3-Stripes Track Pants'
};
const PANTS_BRANDS={1:'Puma',2:'Puma',3:'Puma',4:'Puma',5:'Adidas',6:'Nike',7:'Puma',8:'Allen Solly',9:'Nike',10:"Levi's",11:"Levi's",12:'Louis Philippe',13:"Levi's",14:'Raven',15:'Puma',16:'Louis Philippe',17:'Adidas'};
const SHOES_IMAGES={};
for(let i=1;i<=25;i++) SHOES_IMAGES[i]=`/product-images/shoes/shoe-${String(i).padStart(2,'0')}.jpg`;
const SHOES_NAMES={
 1:'Premium White Court Sneakers',2:'Classic White Lace-Up Sneakers',3:'Navy Blue Running Shoes',4:'Pink Performance Running Shoes',5:'White Everyday Sneakers',
 6:'Grey Orange Running Shoes',7:'White Red Air Cushion Sneakers',8:'Black Casual Sneakers',9:'Black Air Cushion Running Shoes',10:'Black White Running Shoes',
 11:'Grey Training Sneakers',12:'Black Classic Stripe Sneakers',13:'Grey Air Cushion Sneakers',14:'White Minimal Court Sneakers',15:'White Classic Tennis Sneakers',
 16:'White Gum Sole Sneakers',17:'Black White Casual Sneakers',18:'Black Performance Running Shoes',19:'White Low-Top Sneakers',20:'White Everyday Court Shoes',
 21:'Beige Lifestyle Running Shoes',22:'Black Sport Sneakers',23:'White Casual Sneakers',24:'White Classic Stripe Sneakers',25:'White Premium Court Sneakers',
};
const SHOES_BRANDS={1:'Reebok',2:'Nike',3:'Nike',4:'Reebok',5:'Nike',6:'Nike',7:'Nike',8:'Puma',9:'Nike',10:'Nike',11:'Puma',12:'Adidas',13:'Nike',14:'Adidas',15:'Reebok',16:'Adidas',17:'Nike',18:'Nike',19:'Nike',20:'Nike',21:'Nike',22:'Nike',23:'Nike',24:'Adidas',25:'Adidas'};
const JEANS_IMAGES={};
for(let i=1;i<=14;i++) JEANS_IMAGES[i]=`/product-images/jeans/jeans-${String(i).padStart(2,'0')}.jpg`;
const JEANS_NAMES={1:'Classic Dark Blue Straight Fit Jeans',2:'Classic Medium Blue Straight Fit Jeans',3:'Dark Indigo Slim Fit Jeans',4:'Light Blue Everyday Fit Jeans',5:'Light Wash Relaxed Fit Jeans',6:'Ice Blue Straight Fit Jeans',7:'Dark Navy Comfort Fit Jeans',8:'Deep Blue Classic Fit Jeans',9:'Dark Blue Regular Fit Jeans',10:'Black Indigo Slim Fit Jeans',11:'Blue Mid Wash Straight Fit Jeans',12:'Medium Blue Classic Fit Jeans',13:'Wrangler Authentic Slim Texas Blue Jeans',14:'Wrangler Blue Denim Jeans'};
const JEANS_BRANDS={1:'Raven',2:'Raven',3:'Raven',4:'Raven',5:'Raven',6:'Raven',7:'Raven',8:'Raven',9:'Raven',10:'Raven',11:'Raven',12:'Raven',13:'Wrangler',14:'Wrangler'};
const TOPS_IMAGES={};
for(let i=1;i<=20;i++) TOPS_IMAGES[i]=`/product-images/tops/top-${String(i).padStart(2,'0')}.jpg`;
const TOPS_NAMES={
  1:'Women V-Neck Casual Top Collection',2:'Women Yellow Printed Tunic Top',3:'Women Printed Ethnic Long Top',4:'Women Ribbed Button Front Top',5:'Women Ribbed Tank Top Set',
  6:'Women Pink Puff Sleeve Party Top',7:'Kids Green Hooded Jacket Top',8:'Women Floral Printed Kurti Top',9:'Women Basic Long Sleeve Top',10:'Women Sleeveless Linen Top',
  11:'Women Blue Casual Tunic Top',12:'Women Maroon Casual T-Shirt Top',13:'Women Floral Printed Kurti Top',14:'Women Lavender Puff Sleeve Crop Top',15:'Women Essential Cotton T-Shirt Set',
  16:'Women Teal Wrap Maxi Top Dress',17:'Women Yellow Pleated Party Top Dress',18:'Women Soft Long Sleeve Basic Top',19:'Women Brown Polo Mini Dress Top',20:'Women V-Neck Casual Top Variant'
};
const TOPS_BRANDS={1:'Raven',2:'Biba',3:'Aurelia',4:'H&M',5:'Roadster',6:'Raven',7:'Raven Kids',8:'W for Woman',9:'H&M',10:'Roadster',11:'Raven',12:'Tokyo Talkies',13:'Libas',14:'Raven',15:'H&M',16:'Raven',17:'Only',18:'Roadster',19:'Raven',20:'Raven'};

const TOPS_PRICES={1:399,2:549,3:699,4:449,5:499,6:599,7:799,8:649,9:399,10:449,11:699,12:349,13:599,14:499,15:699,16:799,17:749,18:399,19:699,20:399};
const TOPS_MRPS={1:899,2:1199,3:1499,4:999,5:1099,6:1299,7:1599,8:1399,9:899,10:999,11:1499,12:799,13:1299,14:1099,15:1499,16:1699,17:1599,18:899,19:1499,20:899};
const SAREE_IMAGES={1:'/product-images/sarees/saree-01.jpg',2:'/product-images/sarees/saree-02.jpg',3:'/product-images/sarees/saree-03.jpg',4:'/product-images/sarees/saree-04.jpg',5:'/product-images/sarees/saree-05.jpg',6:'/product-images/sarees/saree-06.jpg',7:'/product-images/sarees/saree-07.jpg',8:'/product-images/sarees/saree-08.jpg',9:'/product-images/sarees/saree-09.jpg',10:'/product-images/sarees/saree-10.jpg',11:'/product-images/sarees/saree-11.jpg',12:'/product-images/sarees/saree-12.jpg',13:'/product-images/sarees/saree-13.jpg',14:'/product-images/sarees/saree-14.jpg',15:'/product-images/sarees/saree-15.jpg',16:'/product-images/sarees/saree-16.jpg',17:'/product-images/sarees/saree-17.jpg',18:'/product-images/sarees/saree-18.jpg',19:'/product-images/sarees/saree-19.jpg',20:'/product-images/sarees/saree-20.jpg',21:'/product-images/sarees/saree-21.jpg',22:'/product-images/sarees/saree-22.jpg',23:'/product-images/sarees/saree-23.jpg'};
const SAREE_NAMES={1:'Emerald Green Kanjivaram Silk Saree',2:'Royal Blue Silk Saree',3:'Red Floral Silk Saree',4:'Red Blue Handloom Saree',5:'Blush Pink Organza Saree',6:'Red Gold Kanjivaram Saree',7:'Dark Green Designer Silk Saree',8:'Rose Pink Banarasi Saree',9:'Royal Purple Silk Saree',10:'Red Gold Banarasi Saree',11:'Green Gold Kanjivaram Saree',12:'Yellow Gold Silk Saree',13:'Peach Designer Saree',14:'Purple Gold Silk Saree',15:'Purple Zari Silk Saree',16:'Red Blue Handloom Saree',17:'Red Blue Handloom Saree - New',18:'Purple Gold Silk Saree - New',19:'Red Gold Kanjivaram Saree - New',20:'Red Gold Silk Saree',21:'Emerald Green Kanjivaram Silk Saree',22:'Royal Blue Silk Saree',23:'Blush Pink Organza Saree'};
const SAREE_BRANDS=Object.fromEntries(Array.from({length:23},(_,i)=>[i+1,'Raven Women']));
const SAREE_PRICES={1:1899,2:1699,3:1799,4:1499,5:1499,6:2199,7:2399,8:1899,9:1699,10:2299,11:2499,12:1599,13:1999,14:1799,15:2199,16:1499,17:1599,18:1899,19:2299,20:1999,21:1899,22:1699,23:1499};
const SAREE_MRPS={1:3499,2:3199,3:3399,4:2999,5:2799,6:3999,7:4499,8:3499,9:3199,10:3999,11:4299,12:2999,13:3599,14:3299,15:3999,16:2999,17:3199,18:3499,19:3999,20:3599,21:3499,22:3199,23:2799};
const MOBILE_IMAGES={
  1:'/product-images/mobiles/mobile-01.jpg',
  2:'/product-images/mobiles/mobile-02.jpg',
  3:'/product-images/mobiles/mobile-03.jpg',
  4:'/product-images/mobiles/mobile-04.jpg',
  5:'/product-images/mobiles/mobile-05.jpg',
  6:'/product-images/mobiles/mobile-06.jpg',
  7:'/product-images/mobiles/mobile-07.jpg',
  8:'/product-images/mobiles/mobile-08.jpg',
  9:'/product-images/mobiles/mobile-09.jpg',
  10:'/product-images/mobiles/mobile-10.jpg',
  11:'/product-images/mobiles/mobile-11.jpg',
  12:'/product-images/mobiles/mobile-12.jpg',
  13:'/product-images/mobiles/mobile-13.jpg',
  14:'/product-images/mobiles/mobile-14.jpg',
  15:'/product-images/mobiles/mobile-15.jpg',
  16:'/product-images/mobiles/mobile-16.jpg',
  17:'/product-images/mobiles/mobile-17.jpg',
  18:'/product-images/mobiles/mobile-18.jpg',
  19:'/product-images/mobiles/mobile-19.jpg',
  20:'/product-images/mobiles/mobile-20.jpg',
};
const MOBILE_NAMES={
  1:'Apple iPhone 16',2:'Samsung Galaxy S25+',3:'Samsung Galaxy S24 Ultra',4:'Vivo X100',5:'Apple iPhone 15',
  6:'Vivo V40',7:'OnePlus 12R',8:'OPPO Reno12',9:'Xiaomi 14 Civi',10:'Xiaomi 14',11:'Apple iPhone 15 Pro',
  12:'OnePlus 13',13:'Redmi Note 14 Pro',14:'Samsung Galaxy S25',15:'OnePlus 12',
  16:'Samsung Galaxy S24',17:'Samsung Galaxy S25 Ultra',18:'Apple iPhone 16 Pro',19:'Apple iPhone 16 Pro Max',20:'OPPO Find X8'
};
const MOBILE_BRANDS={1:'Apple',2:'Samsung',3:'Samsung',4:'Vivo',5:'Apple',6:'Vivo',7:'OnePlus',8:'OPPO',9:'Xiaomi',10:'Xiaomi',11:'Apple',12:'OnePlus',13:'Redmi',14:'Samsung',15:'OnePlus',16:'Samsung',17:'Samsung',18:'Apple',19:'Apple',20:'OPPO'};
const LAPTOP_IMAGES={
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
};
const LAPTOP_NAMES={
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
};
const LAPTOP_BRANDS={
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
};
const mobileImageForProduct=(p)=>{
  if(!p) return p;
  const name=String(p.name||'').trim().toLowerCase();
  const category=String(p.category_name||p.category||'').trim().toLowerCase();
  const groceryFound=Object.entries(GROCERY_NAMES).find(([,n])=>String(n).trim().toLowerCase()===name);
  if(category==='grocery' || category==='groceries' || groceryFound){
    const n=groceryFound ? Number(groceryFound[0]) : Number(String(p.image||'').match(/grocery-(\d+)\.jpg/i)?.[1] || 1);
    return {...p,image:GROCERY_IMAGES[n] || GROCERY_IMAGES[1]};
  }
  const found=Object.entries(MOBILE_NAMES).find(([,n])=>String(n).toLowerCase()===name);
  return found ? {...p,image:MOBILE_IMAGES[Number(found[0])] } : p;
};
const photoUrl=(key,n=1,w=600,h=600)=>{
  if(key==='mobiles' && MOBILE_IMAGES[n]) return MOBILE_IMAGES[n];
  if(key==='laptops' && LAPTOP_IMAGES[n]) return LAPTOP_IMAGES[n];
  if(key==='tshirts' && TSHIRT_IMAGES[n]) return TSHIRT_IMAGES[n];
  if(key==='shirts' && SHIRT_IMAGES[n]) return SHIRT_IMAGES[n];
  if(key==='pants' && PANTS_IMAGES[n]) return PANTS_IMAGES[n];
  if(key==='jeans' && JEANS_IMAGES[n]) return JEANS_IMAGES[n];
  if(key==='tops' && TOPS_IMAGES[n]) return TOPS_IMAGES[n];
  if(key==='shoes' && SHOES_IMAGES[n]) return SHOES_IMAGES[n];
  if(key==='earbuds' && EARBUD_IMAGES[n]) return EARBUD_IMAGES[n];
  if(key==='watches' && WATCH_IMAGES[n]) return WATCH_IMAGES[n];
  if(key==='cameras' && CAMERA_IMAGES[n]) return CAMERA_IMAGES[n];
  if(key==='toys' && TOY_IMAGES[n]) return TOY_IMAGES[n];
  if(key==='sunglasses' && SUNGLASSES_IMAGES[n]) return SUNGLASSES_IMAGES[n];
  if(key==='caps' && CAP_IMAGES[n]) return CAP_IMAGES[n];
  if(key==='wallets' && WALLET_IMAGES[n]) return WALLET_IMAGES[n];
  if(key==='beauty' && BEAUTY_IMAGES[n]) return BEAUTY_IMAGES[n];
  if(key==='books' && BOOK_IMAGES[n]) return BOOK_IMAGES[n];
  if(key==='grocery' && GROCERY_IMAGES[n]) return GROCERY_IMAGES[n];
  if(key==='home' && HOME_IMAGES[n]) return HOME_IMAGES[n];
  const q=encodeURIComponent(PHOTO_QUERY[key]||'product');
  return `https://loremflickr.com/${w}/${h}/${q}?lock=${Number(n)||1}`;
};
const imageSrc=(src)=>{
  if(!src) return photoUrl('mobiles',1);
  if (/^https?:\/\//.test(src)) return src;
  return src.startsWith('/') ? src : `/${src}`;
};
const fallbackFor=(src)=>{
  const s=String(src||'');
  const m=s.match(/product-images\/([^/-]+)-\d+\.svg/i);
  if(m) return photoUrl(m[1],1);
  const q=s.match(/loremflickr\.com\/\d+\/\d+\/([^?]+)/i);
  return q ? `https://loremflickr.com/600/600/product?lock=99` : photoUrl('mobiles',1);
};
const api=axios.create({baseURL:API});
const CartContext=createContext();
function useCart(){return useContext(CartContext)}
function CartProvider({children}){const [cart,setCart]=useState(()=>JSON.parse(localStorage.getItem('rm_cart')||'[]'));const [wish,setWish]=useState(()=>JSON.parse(localStorage.getItem('rm_wish')||'[]'));useEffect(()=>localStorage.setItem('rm_cart',JSON.stringify(cart)),[cart]);useEffect(()=>localStorage.setItem('rm_wish',JSON.stringify(wish)),[wish]);const add=useCallback(p=>setCart(c=>{let x=c.find(i=>i.id===p.id);return x?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}]}),[]);const remove=id=>setCart(c=>c.filter(i=>i.id!==id));const change=(id,d)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));const toggleWish=p=>setWish(w=>w.some(i=>i.id===p.id)?w.filter(i=>i.id!==p.id):[...w,p]);return <CartContext.Provider value={{cart,wish,add,remove,change,toggleWish}}>{children}</CartContext.Provider>}
const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
function Header(){const {cart,wish}=useCart();const [q,setQ]=useState('');const nav=useNavigate();return <><div className="top">🚚 Free delivery on orders above ₹499 <span>Easy Returns · Genuine Products</span></div><header><Link className="logo" to="/">Raven<span>Mart</span></Link><form className="search" onSubmit={e=>{e.preventDefault();nav('/shop?q='+encodeURIComponent(q))}}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for products, brands and more..."/><button><Search size={19}/></button></form><nav className="actions"><Link to="/account"><User/>Account</Link><Link to="/orders"><Package/>Orders</Link><Link to="/wishlist"><Heart/> <b>{wish.length}</b></Link><Link to="/cart"><ShoppingCart/><b>{cart.reduce((s,i)=>s+i.qty,0)}</b></Link></nav></header><div className="nav"><Link to="/shop">☰ All Categories</Link><Link to="/shop?category=mobiles">Mobiles</Link><Link to="/shop?category=tshirts">Fashion</Link><Link to="/shop?category=electronics">Electronics</Link><Link to="/shop?category=toys">Toys & Games</Link><Link to="/shop?category=home">Home & Kitchen</Link><Link to="/shop?category=beauty">Beauty</Link><Link to="/shop?category=sports">Sports</Link><Link to="/shop?category=books">Books</Link></div></>}
const LOCAL_CATEGORIES=[
  ['Mobiles','mobiles'],['Laptops','laptops'],['T-Shirts','tshirts'],['Shirts','shirts'],['Pants','pants'],['Jeans','jeans'],['Shoes','shoes'],['Tops','tops'],['Dresses','dresses'],['Sarees','sarees'],['Earbuds','earbuds'],['Watches','watches'],['Cameras','cameras'],['Toys','toys'],['Belts','belts'],['Wallets','wallets'],['Sunglasses','sunglasses'],['Caps','caps'],['Perfumes','perfumes'],['Home Essentials','home'],['Beauty','beauty'],['Sports','sports'],['Books','books'],['Grocery','grocery']
];
const LOCAL_PRODUCTS=LOCAL_CATEGORIES.flatMap(([label,key],ci)=>Array.from({length:key==='laptops'?15:key==='shirts'?19:key==='pants'?17:key==='jeans'?14:key==='shoes'?25:key==='sarees'?23:20},(_,idx)=>{const n=idx+1;const price=key==='mobiles'?14999+n*700:key==='laptops'?39999+n*1500:key==='earbuds'?899+n*120:key==='watches'?1499+n*250:key==='cameras'?24999+n*3500:key==='tshirts'?699+n*70:key==='shirts'?999+n*90:key==='pants'?1199+n*110:key==='jeans'?1399+n*120:key==='shoes'?1499+n*130:key==='tops'?(TOPS_PRICES[n]||599):key==='toys'?499+n*60:key==='belts'?499+n*40:key==='sunglasses'?899+n*80:key==='caps'?(CAP_PRICES[n]||499):key==='perfumes'?799+n*75:key==='beauty'?(BEAUTY_PRICES[n]||599):key==='books'?(BOOK_PRICES[n]||699):key==='grocery'?(149+n*15):key==='sports'?(599+n*150):key==='sarees'?(SAREE_PRICES[n]||599):599+n*95;const mrp=key==='tops'?(TOPS_MRPS[n]||899):key==='beauty'?(BEAUTY_MRPS[n]||899):key==='books'?(BOOK_MRPS[n]||999):key==='grocery'?Math.round((149+n*15)*1.3):key==='sports'?Math.round((599+n*150)*1.3):key==='caps'?(CAP_MRPS[n]||899):key==='sarees'?(SAREE_MRPS[n]||899):Math.round(price*1.35);const productName=key==='mobiles'?(MOBILE_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='laptops'?(LAPTOP_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='tshirts'?(TSHIRT_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='shirts'?(SHIRT_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='pants'?(PANTS_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='jeans'?(JEANS_NAMES[n]||`Raven Jeans ${String(n).padStart(2,'0')}`):key==='shoes'?(SHOES_NAMES[n]||`Raven Shoes ${String(n).padStart(2,'0')}`):key==='tops'?(TOPS_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='sarees'?(SAREE_NAMES[n]||`Raven ${label} ${String(n).padStart(2,'0')}`):key==='earbuds'?(EARBUD_NAMES[n]||`Raven Earbuds ${String(n).padStart(2,'0')}`):key==='watches'?(WATCH_NAMES[n]||`Raven Watch ${String(n).padStart(2,'0')}`):key==='cameras'?(CAMERA_NAMES[n]||`Raven Camera ${String(n).padStart(2,'0')}`):key==='toys'?(TOY_NAMES[n]||`Raven Toy ${String(n).padStart(2,'0')}`):key==='belts'?(BELT_NAMES[n]||`Raven Belt ${String(n).padStart(2,'0')}`):key==='sunglasses'?(SUNGLASSES_NAMES[n]||`Raven Sunglasses ${String(n).padStart(2,'0')}`):key==='caps'?(CAP_NAMES[n]||`Raven Cap ${String(n).padStart(2,'0')}`):key==='perfumes'?(PERFUME_NAMES[n]||`Raven Perfume ${String(n).padStart(2,'0')}`):key==='beauty'?(BEAUTY_NAMES[n]||`Raven Beauty ${String(n).padStart(2,'0')}`):key==='books'?(BOOK_NAMES[n]||`Raven Book ${String(n).padStart(2,'0')}`):key==='grocery'?(GROCERY_NAMES[n]||`Raven Grocery ${String(n).padStart(2,'0')}`):key==='sports'?(SPORTS_NAMES[n]||`Raven Sports ${String(n).padStart(2,'0')}`):`Raven ${label} ${String(n).padStart(2,'0')}`;const productBrand=key==='mobiles'?(MOBILE_BRANDS[n]||'Raven'):key==='laptops'?(LAPTOP_BRANDS[n]||'Raven'):key==='tshirts'?(TSHIRT_BRANDS[n]||'Raven'):key==='shirts'?(SHIRT_BRANDS[n]||'Raven'):key==='pants'?(PANTS_BRANDS[n]||'Raven'):key==='jeans'?(JEANS_BRANDS[n]||'Raven'):key==='shoes'?(SHOES_BRANDS[n]||'Raven'):key==='tops'?(TOPS_BRANDS[n]||'Raven'):key==='sarees'?(SAREE_BRANDS[n]||'Raven Women'):key==='earbuds'?(EARBUD_BRANDS[n]||'Raven'):key==='watches'?(WATCH_BRANDS[n]||'Raven'):key==='cameras'?(CAMERA_BRANDS[n]||'Raven Camera'):key==='toys'?(TOY_BRANDS[n]||'Raven Kids'):key==='belts'?(BELT_BRANDS[n]||'Raven'):key==='sunglasses'?(SUNGLASSES_BRANDS[n]||'Raven'):key==='caps'?(CAP_BRANDS[n]||'Raven'):key==='perfumes'?(PERFUME_BRANDS[n]||'Raven'):key==='beauty'?(BEAUTY_BRANDS[n]||'Raven'):key==='books'?(BOOK_BRANDS[n]||'Raven Books'):key==='grocery'?(GROCERY_BRANDS[n]||'Raven'):key==='sports'?(SPORTS_BRANDS[n]||'Raven'):['Raven','Nova','UrbanX','Prime','Aero'][idx%5];return {id:`local-${key}-${n}`,name:productName,brand:productBrand,category_name:label,price,mrp,discount:Math.round((1-price/mrp)*100),image:key==='sarees'?(SAREE_IMAGES[n]||photoUrl(key,n)):key==='earbuds'?(EARBUD_IMAGES[n]||photoUrl(key,n)):key==='watches'?(WATCH_IMAGES[n]||photoUrl(key,n)):key==='cameras'?(CAMERA_IMAGES[n]||photoUrl(key,n)):key==='toys'?(TOY_IMAGES[n]||photoUrl(key,n)):key==='belts'?(BELT_IMAGES[n]||photoUrl(key,n)):key==='sunglasses'?(SUNGLASSES_IMAGES[n]||photoUrl(key,n)):key==='caps'?(CAP_IMAGES[n]||photoUrl(key,n)):key==='perfumes'?(PERFUME_IMAGES[n]||photoUrl(key,n)):key==='beauty'?(BEAUTY_IMAGES[n]||photoUrl(key,n)):key==='books'?(BOOK_IMAGES[n]||photoUrl(key,n)):key==='grocery'?(GROCERY_IMAGES[n]||photoUrl(key,n)):key==='sports'?(SPORTS_IMAGES[n]||photoUrl(key,n)):photoUrl(key,n),description:`Premium ${label.toLowerCase()} with a modern design and reliable everyday quality.`,rating:(4+(idx%10)/10).toFixed(1),reviews:80+idx*37,stock:25+idx,sizes:['tshirts','shirts','pants','jeans','tops','dresses','shoes'].includes(key)?['S','M','L','XL','XXL']:[],colors:['Black','White','Blue','Red']};}));
const localFilter=(cat,q='')=>LOCAL_PRODUCTS.filter(p=>(!cat||p.category_name.toLowerCase()===cat.toLowerCase()||p.image.toLowerCase().includes(encodeURIComponent(PHOTO_QUERY[cat]||cat).toLowerCase()))&&(!q||p.name.toLowerCase().includes(q.toLowerCase())||p.brand.toLowerCase().includes(q.toLowerCase())));
function Home(){const [products,setProducts]=useState([]);useEffect(()=>{api.get('/products/?page_size=30').then(r=>setProducts((r.data.results||r.data).map(mobileImageForProduct))).catch(()=>setProducts(LOCAL_PRODUCTS.slice(0,30)))},[]);const cats=[['Mobiles','mobiles'],['Laptops','laptops'],['Fashion','tshirts'],['Electronics','earbuds'],['Home','home'],['Beauty','beauty'],['Toys','toys'],['Sports','sports'],['Books','books'],['Grocery','grocery']];return <><section className="hero"><div><small>RAVENMART EXCLUSIVE</small><h1>Upgrade<br/><em>Your Everyday</em></h1><p>Smart choices. Better living. Discover premium products across every category.</p><Link to="/shop" className="btn">Shop Now <ChevronRight/></Link></div><div className="heroArt">
  <div className="heroProducts">
    {products.slice(0,4).map((p,i)=><Link className={`heroProduct hp${i}`} to={'/product/'+p.id} key={p.id}>
      <img src={imageSrc(p.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/product-images/mobiles-01.svg';}} alt={p.name}/>
    </Link>)}
    <div className="heroBadge">ALL<br/><span>PRODUCTS</span></div>
  </div>
</div></section><section className="catRow">{cats.map(([n,s],ci)=><Link to={'/shop?category='+s} key={n}><div className="catIcon"><img src={photoUrl(s,ci+1,240,180)} alt={n} loading="lazy" onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=photoUrl(s,999,240,180);}}/></div><span>{n}</span></Link>)}</section><section className="section"><div className="sectionHead"><div><small>CURATED FOR YOU</small><h2>Big Savings on Top Picks</h2></div><Link to="/shop">View all →</Link></div><div className="brandRow">{['SAMSUNG','APPLE','NIKE','ADIDAS','SONY','DELL','HP','LEVI’S'].map(x=><div>{x}</div>)}</div></section><section className="section"><div className="sectionHead"><div><small>LIMITED TIME</small><h2>Deals of the Day</h2></div><Link to="/shop">View all →</Link></div><div className="grid">{products.slice(0,10).map(p=><ProductCard p={p} key={p.id}/>)}</div></section><section className="banners"><div><small>MEN'S FASHION</small><h3>Up to 50% Off</h3><Link to="/shop?category=tshirts">Shop Now</Link></div><div><small>ELECTRONICS</small><h3>Next-gen tech awaits</h3><Link to="/shop?category=mobiles">Explore</Link></div><div><small>HOME ESSENTIALS</small><h3>Make home better</h3><Link to="/shop?category=home">Discover</Link></div></section><section className="trust"><div><Truck/>Free Delivery<small>On orders over ₹499</small></div><div><RotateCcw/>Easy Returns<small>7-day return policy</small></div><div><ShieldCheck/>Secure Payment<small>100% secure checkout</small></div><div><User/>24/7 Support<small>We're here to help</small></div></section></>}
function ProductCard({p}){const {add,wish,toggleWish}=useCart();return <article className="card"><button className={'wish '+(wish.some(i=>i.id===p.id)?'on':'')} onClick={()=>toggleWish(p)}><Heart size={18}/></button><Link to={'/product/'+p.id}><img src={imageSrc(p.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallbackFor(p.image);}} loading="lazy" alt={p.name}/></Link><div className="cardBody"><small>{p.brand}</small><Link className="pname" to={'/product/'+p.id}>{p.name}</Link><div className="rating"><span>★ {p.rating}</span> <small>({p.reviews})</small></div><div><strong>{money(p.price)}</strong> <del>{money(p.mrp)}</del> <mark>{p.discount}% OFF</mark></div><button className="add" onClick={()=>add(p)}>Add to Cart</button></div></article>}
function Shop(){const loc=useLocation();const qs=new URLSearchParams(loc.search);const q=qs.get('q')||'';const [products,setProducts]=useState([]);const [loading,setLoading]=useState(true);const [sort,setSort]=useState('popular');const cat=qs.get('category')||'';useEffect(()=>{setLoading(true);api.get('/products/',{params:{q,category:cat}}).then(r=>{const data=(r.data.results||r.data).map(mobileImageForProduct);setProducts(cat.toLowerCase()==='tops'?data.slice(0,20):data)}).catch(()=>setProducts((cat.toLowerCase()==='tops'?localFilter(cat,q).slice(0,20):localFilter(cat,q)))).finally(()=>setLoading(false))},[q,cat]);const list=useMemo(()=>[...products].sort((a,b)=>sort==='priceLow'?a.price-b.price:sort==='priceHigh'?b.price-a.price:b.rating-a.rating),[products,sort]);return <div className="shop"><aside><h3><SlidersHorizontal/> Filters</h3><label>Category</label>{['mobiles','laptops','tshirts','shirts','pants','jeans','shoes','tops','dresses','sarees','earbuds','watches','cameras','toys','belts','wallets','sunglasses','caps','perfumes','home','beauty','sports','books','grocery'].map(x=><Link className={cat===x?'active':''} to={'/shop?category='+x}>{x.replace('-', ' ')}</Link>)}<label>Price</label><div className="priceBox">₹0 — ₹1,00,000</div><label>Rating</label><div>☆ 4★ & above</div></aside><main className="listing"><div className="listTop"><div><small>RAVENMART CATALOGUE</small><h2>{q?`Search results for “${q}”`:cat?cat.replaceAll('-',' ').toUpperCase():'All Products'} <span>({list.length})</span></h2></div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Sort: Popularity</option><option value="priceLow">Price: Low to High</option><option value="priceHigh">Price: High to Low</option></select></div>{loading?<div className="loading">Loading premium products…</div>:list.length?<div className="grid">{list.map(p=><ProductCard p={p} key={p.id}/>)}</div>:<div className="empty"><h3>No products loaded</h3><p>Start the Django backend and refresh this page.</p><Link to="/" className="btn">Back Home</Link></div>}</main></div>}
function Product(){const {id}=useParams();const {add,wish,toggleWish}=useCart();const [p,setP]=useState(null);const [size,setSize]=useState('');const [qty,setQty]=useState(1);useEffect(()=>{api.get('/products/'+id+'/').then(r=>setP(mobileImageForProduct(r.data))).catch(()=>setP(LOCAL_PRODUCTS.find(x=>String(x.id)===String(id))||null))},[id]);if(!p)return <div className="loading">Loading product…</div>;return <section className="product"><div className="gallery"><img src={imageSrc(p.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallbackFor(p.image);}} loading="lazy" alt={p.name}/><div className="thumbs">{[1,2,3,4].map(x=><img src={imageSrc(p.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallbackFor(p.image);}} loading="lazy" alt={p.name}/>)}</div></div><div className="details"><small>{p.category_name} / {p.brand}</small><h1>{p.name}</h1><div className="rating big">★ {p.rating} <small>{p.reviews.toLocaleString()} ratings & reviews</small></div><hr/><h2>{money(p.price)} <del>{money(p.mrp)}</del> <mark>{p.discount}% OFF</mark></h2><p>Inclusive of all taxes · No-cost EMI available on select cards.</p><div className="offer"><b>Bank Offer</b> · Save extra 10% with eligible payment methods</div>{p.sizes?.length>0&&<><h4>Size</h4><div className="chips">{p.sizes.map(s=><button className={size===s?'selected':''} onClick={()=>setSize(s)}>{s}</button>)}</div></>}<h4>Quantity</h4><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus/></button>{qty}<button onClick={()=>setQty(qty+1)}><Plus/></button></div><div className="buyRow"><button className="add bigBtn" onClick={()=>{for(let i=0;i<qty;i++)add(p)}}>Add to Cart</button><Link className="buy bigBtn" to="/checkout">Buy Now</Link><button className="iconBtn" onClick={()=>toggleWish(p)}><Heart/></button></div><div className="perks"><div><Truck/>Free Delivery</div><div><RotateCcw/>7 Days Return</div><div><ShieldCheck/>Secure Payment</div></div></div></section>}
function Cart(){const {cart,remove,change}=useCart();const total=cart.reduce((s,i)=>s+i.price*i.qty,0);return <section className="cartPage"><div className="sectionHead"><h2>My Cart <span>({cart.reduce((s,i)=>s+i.qty,0)} items)</span></h2></div>{!cart.length?<div className="empty">Your cart is waiting for something great. <Link to="/shop" className="btn">Continue Shopping</Link></div>:<div className="cartLayout"><div>{cart.map(i=><div className="cartItem"><img src={imageSrc(i.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallbackFor(i.image);}} loading="lazy"/><div><small>{i.brand}</small><h3>{i.name}</h3><strong>{money(i.price)}</strong><div className="qty"><button onClick={()=>change(i.id,-1)}><Minus/></button>{i.qty}<button onClick={()=>change(i.id,1)}><Plus/></button></div><button className="remove" onClick={()=>remove(i.id)}><Trash2/> Remove</button></div></div>)}</div><aside className="summary"><h3>Price Details</h3><p>Price ({cart.length} items) <b>{money(total)}</b></p><p>Discount <b className="green">-₹{Math.round(total*.1).toLocaleString('en-IN')}</b></p><p>Delivery <b className="green">FREE</b></p><hr/><h2>Total <b>{money(total*.9)}</b></h2><Link to="/checkout" className="btn full">Proceed to Checkout</Link></aside></div>}</section>}
function Checkout(){const {cart}=useCart();const [form,setForm]=useState({customer_name:'',email:'',phone:'',address:'',payment:'UPI (GPay / PhonePe / Paytm)'});const [done,setDone]=useState(false);const total=cart.reduce((s,i)=>s+i.price*i.qty,0)*.9;const submit=e=>{e.preventDefault();api.post('/orders/',{...form,total,items:cart.map(i=>({product_id:i.id,quantity:i.qty}))}).then(()=>setDone(true))};if(done)return <div className="success"><div>✓</div><h1>Order Placed Successfully</h1><p>Thank you for shopping with RavenMart.</p><Link to="/shop" className="btn">Continue Shopping</Link></div>;return <section className="checkout"><div className="steps"><b>1 Cart</b><b>2 Address</b><b>3 Payment</b><b>4 Place Order</b></div><form onSubmit={submit}><div className="formCard"><h2>Delivery Address</h2><input required placeholder="Full name" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/><input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input required placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><textarea required placeholder="Complete delivery address" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/><h2>Payment Method</h2>{['UPI (GPay / PhonePe / Paytm)','Credit / Debit Card','Net Banking','Cash on Delivery'].map(x=><label className="radio"><input type="radio" name="pay" checked={form.payment===x} onChange={()=>setForm({...form,payment:x})}/>{x}</label>)}<button className="btn full">Place Order</button></div><aside className="summary"><h3>Order Summary</h3>{cart.map(i=><p>{i.name} × {i.qty} <b>{money(i.price*i.qty)}</b></p>)}<hr/><h2>Total <b>{money(total)}</b></h2></aside></form></section>}
function Wishlist(){const {wish,add,toggleWish}=useCart();return <section className="section"><div className="sectionHead"><h2>My Wishlist</h2></div>{wish.length?<div className="grid">{wish.map(p=><ProductCard p={p}/>)}</div>:<div className="empty">Your wishlist is empty.</div>}</section>}
function Account(){return <section className="auth"><div><small>RAVENMART ACCOUNT</small><h1>Welcome Back</h1><p>Sign in to continue shopping.</p><input placeholder="Email address"/><input placeholder="Password" type="password"/><button className="btn full">Login</button><hr/><p>New here? <b>Create an account</b></p></div></section>}
function Contact(){return <section className="contactPage"><div className="contactInner"><div className="contactIntro"><small>RAVENMART SUPPORT</small><h1>Contact Us</h1><p>Need help with an order, product, return, or anything else? Send us a message and our support team will get back to you.</p><div className="contactInfo"><div><Mail/><span><b>Email</b><small>support@ravenmart.local</small></span></div><div><Phone/><span><b>Phone</b><small>+91 98765 43210</small></span></div><div><MapPin/><span><b>Store</b><small>Coimbatore, Tamil Nadu, India</small></span></div></div></div><form className="contactForm" onSubmit={e=>{e.preventDefault();alert('Thank you! Your message has been submitted.')}}><h2>Send a Message</h2><input required placeholder="Your name"/><input required type="email" placeholder="Email address"/><input placeholder="Phone number"/><textarea required placeholder="How can we help you?"></textarea><button className="btn full" type="submit">Send Message</button></form></div></section>}
function Orders(){const [orders,setOrders]=useState([]);useEffect(()=>api.get('/orders/').then(r=>setOrders(r.data.results||r.data)),[]);return <section className="section"><div className="sectionHead"><h2>My Orders</h2></div>{orders.length?orders.map(o=><div className="order"><div><b>Order #RM{o.id}</b><small>{new Date(o.created_at).toLocaleDateString()}</small></div><strong>{money(o.total)}</strong><mark>{o.status}</mark></div>):<div className="empty">No orders yet.</div>}</section>}
const ADMIN_ITEMS=[
  ['Dashboard','/admin-dashboard'],['Products','/admin-dashboard/products'],['Orders','/admin-dashboard/orders'],
  ['Users','/admin-dashboard/users'],['Categories','/admin-dashboard/categories'],['Reviews','/admin-dashboard/reviews'],
  ['Coupons','/admin-dashboard/coupons'],['Settings','/admin-dashboard/settings']
];

function AdminShell({children,title='Dashboard'}){
  const loc=useLocation();
  return <section className="admin">
    <aside className="adminSide">
      <h2>RavenMart<br/>Admin</h2>
      <nav>{ADMIN_ITEMS.map(([label,to])=><Link key={to} className={(loc.pathname===to||(to!=='/admin-dashboard'&&loc.pathname.startsWith(to)))?'active':''} to={to}>{label}</Link>)}</nav>
    </aside>
    <main className="adminMain">
      <div className="adminMobileNav">{ADMIN_ITEMS.map(([label,to])=><Link key={to} className={loc.pathname===to?'active':''} to={to}>{label}</Link>)}</div>
      {children}
    </main>
  </section>
}

function AdminStats({stats}){
  return <div className="stats">
    <div><small>Total Products</small><b>{stats.products||0}</b><span>↑ 8%</span></div>
    <div><small>Total Orders</small><b>{stats.orders||0}</b><span>↑ 12%</span></div>
    <div><small>Categories</small><b>{stats.categories||0}</b><span>Active</span></div>
    <div><small>Revenue</small><b>{money(stats.revenue||0)}</b><span>Live</span></div>
  </div>
}

function AdminDashboard(){
  const [stats,setStats]=useState({});
  useEffect(()=>{api.get('/stats/').then(r=>setStats(r.data)).catch(()=>{});},[]);
  const bars=[35,55,42,72,60,85,70,95,78,88,75,100];
  return <AdminShell><small>ADMIN CONSOLE</small><h1>Dashboard</h1><AdminStats stats={stats}/>
    <div className="chart"><h3>Sales Overview</h3><div className="bars">{bars.map((x,i)=><i key={i} style={{height:x+'%'}} title={'Month '+(i+1)}></i>)}</div><div className="barLabels">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(x=><span key={x}>{x}</span>)}</div></div>
    <div className="adminQuick"><Link to="/admin-dashboard/products"><b>Manage Products</b><span>Add, edit and delete catalog items</span></Link><Link to="/admin-dashboard/orders"><b>Manage Orders</b><span>View orders and update status</span></Link><Link to="/admin-dashboard/categories"><b>Manage Categories</b><span>View and organize categories</span></Link></div>
  </AdminShell>
}

function AdminProducts(){
  const [products,setProducts]=useState([]); const [loading,setLoading]=useState(true); const [show,setShow]=useState(false); const [saving,setSaving]=useState(false);
  const blank={name:'',brand:'RavenMart',category:'',price:'',mrp:'',discount:0,image:'/product-images/wallets/wallet-01.jpg',description:'',stock:25,featured:false};
  const [form,setForm]=useState(blank);
  const load=()=>{setLoading(true);api.get('/products/',{params:{page_size:100}}).then(r=>setProducts(r.data.results||r.data)).catch(()=>setProducts([])).finally(()=>setLoading(false));};
  useEffect(load,[]);
  const save=e=>{e.preventDefault();setSaving(true);const data={...form,price:Number(form.price),mrp:Number(form.mrp||form.price),stock:Number(form.stock),discount:Number(form.discount)};api.post('/products/',data).then(()=>{setShow(false);setForm(blank);load();}).catch(()=>alert('Could not add product. Check that the Django backend is running.')).finally(()=>setSaving(false));};
  const del=id=>{if(!confirm('Delete this product?'))return;api.delete('/products/'+id+'/').then(load).catch(()=>alert('Delete failed.'));};
  return <AdminShell><div className="adminPageHead"><div><small>CATALOG MANAGEMENT</small><h1>Products</h1></div><button className="btn" onClick={()=>setShow(true)}><Plus size={17}/> Add Product</button></div>
    {show&&<form className="adminForm" onSubmit={save}><h3>Add Product</h3><div className="adminFormGrid"><input required placeholder="Product name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Brand" value={form.brand} onChange={e=>setForm({...form,brand:e.target.value})}/><input required placeholder="Category ID" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/><input required type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/><input type="number" placeholder="MRP" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})}/><input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/><input className="wide" placeholder="Image URL / local path" value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/><textarea className="wide" placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div><div className="adminFormActions"><button type="button" onClick={()=>setShow(false)}>Cancel</button><button className="btn" disabled={saving}>{saving?'Saving…':'Save Product'}</button></div></form>}
    <div className="adminTableWrap">{loading?<div className="loading">Loading products…</div>:<table className="adminTable"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Action</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td><div className="tableProduct"><img src={imageSrc(p.image)} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=fallbackFor(p.image)}}/><span>{p.name}</span></div></td><td>{p.category_name||'—'}</td><td>{money(p.price)}</td><td>{p.stock}</td><td>★ {p.rating}</td><td><button className="dangerBtn" onClick={()=>del(p.id)}><Trash2 size={15}/> Delete</button></td></tr>)}</tbody></table>}</div>
  </AdminShell>
}

function AdminOrders(){
 const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true);
 const load=()=>{setLoading(true);api.get('/orders/').then(r=>setOrders(r.data.results||r.data)).catch(()=>setOrders([])).finally(()=>setLoading(false));}; useEffect(load,[]);
 const update=(id,status)=>api.patch('/orders/'+id+'/',{status}).then(load).catch(()=>alert('Could not update order.'));
 return <AdminShell><small>SALES MANAGEMENT</small><h1>Orders</h1><div className="adminTableWrap">{loading?<div className="loading">Loading orders…</div>:orders.length?<table className="adminTable"><thead><tr><th>Order</th><th>Customer</th><th>Payment</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>#RM{o.id}<small>{new Date(o.created_at).toLocaleDateString()}</small></td><td>{o.customer_name}<small>{o.email}</small></td><td>{o.payment}</td><td>{money(o.total)}</td><td><mark className={'status '+String(o.status).toLowerCase()}>{o.status}</mark></td><td><select value={o.status} onChange={e=>update(o.id,e.target.value)}>{['PLACED','PACKED','SHIPPED','DELIVERED'].map(x=><option key={x}>{x}</option>)}</select></td></tr>)}</tbody></table>:<div className="empty">No orders yet.</div>}</div></AdminShell>
}

function AdminUsers(){
 const [orders,setOrders]=useState([]); useEffect(()=>{api.get('/orders/').then(r=>setOrders(r.data.results||r.data)).catch(()=>{});},[]);
 const users=[...new Map(orders.map(o=>[o.email,{name:o.customer_name,email:o.email,phone:o.phone,orders:orders.filter(x=>x.email===o.email).length}])).values()];
 return <AdminShell><small>CUSTOMER MANAGEMENT</small><h1>Users</h1><div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th></tr></thead><tbody>{users.length?users.map(u=><tr key={u.email}><td>{u.name}</td><td>{u.email}</td><td>{u.phone||'—'}</td><td>{u.orders}</td></tr>):<tr><td colSpan="4">No customer orders yet. Users will appear here after checkout.</td></tr>}</tbody></table></div></AdminShell>
}

function AdminCategories(){
 const [cats,setCats]=useState([]); const [name,setName]=useState(''); const load=()=>api.get('/categories/').then(r=>setCats(r.data.results||r.data)).catch(()=>setCats([])); useEffect(load,[]);
 const add=()=>{if(!name.trim())return;api.post('/categories/',{name:name.trim(),slug:name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}).then(()=>{setName('');load()}).catch(()=>alert('Could not create category.'))};
 const del=id=>{if(confirm('Delete category?'))api.delete('/categories/'+id+'/').then(load)};
 return <AdminShell><div className="adminPageHead"><div><small>CATALOG STRUCTURE</small><h1>Categories</h1></div><div className="inlineAdd"><input placeholder="New category" value={name} onChange={e=>setName(e.target.value)}/><button className="btn" onClick={add}>Add</button></div></div><div className="categoryAdminGrid">{cats.map(c=><div key={c.id}><b>{c.name}</b><small>{c.slug}</small><button className="dangerBtn" onClick={()=>del(c.id)}><Trash2 size={14}/></button></div>)}</div></AdminShell>
}

function AdminReviews(){return <AdminShell><small>CUSTOMER FEEDBACK</small><h1>Reviews</h1><div className="adminInfoGrid"><div><b>Product ratings</b><strong>4.3 / 5</strong><span>Ratings are stored with products.</span></div><div><b>Review moderation</b><strong>Ready</strong><span>Connect a review model/API when reviews are enabled.</span></div><div><b>Pending reports</b><strong>0</strong><span>No moderation queue is configured in the current backend.</span></div></div></AdminShell>}

function AdminCoupons(){
 const [coupons,setCoupons]=useState(()=>JSON.parse(localStorage.getItem('rm_coupons')||'[]')); const [code,setCode]=useState(''); const [discount,setDiscount]=useState('10');
 const add=()=>{if(!code.trim())return;const next=[...coupons,{id:Date.now(),code:code.trim().toUpperCase(),discount:Number(discount)}];setCoupons(next);localStorage.setItem('rm_coupons',JSON.stringify(next));setCode('')}; const del=id=>{const next=coupons.filter(x=>x.id!==id);setCoupons(next);localStorage.setItem('rm_coupons',JSON.stringify(next))};
 return <AdminShell><div className="adminPageHead"><div><small>PROMOTIONS</small><h1>Coupons</h1></div><div className="inlineAdd"><input placeholder="CODE" value={code} onChange={e=>setCode(e.target.value)}/><input type="number" min="1" max="90" value={discount} onChange={e=>setDiscount(e.target.value)} /><button className="btn" onClick={add}>Create</button></div></div><div className="couponGrid">{coupons.length?coupons.map(c=><div key={c.id}><b>{c.code}</b><span>{c.discount}% OFF</span><button className="dangerBtn" onClick={()=>del(c.id)}><Trash2 size={14}/></button></div>):<div className="empty">No coupons created yet.</div>}</div></AdminShell>
}

function AdminSettings(){
 const [saved,setSaved]=useState(false); const [form,setForm]=useState(()=>JSON.parse(localStorage.getItem('rm_admin_settings')||'{"storeName":"RavenMart","freeDelivery":"499","supportEmail":"support@ravenmart.local"}'));
 const save=e=>{e.preventDefault();localStorage.setItem('rm_admin_settings',JSON.stringify(form));setSaved(true);setTimeout(()=>setSaved(false),1800)};
 return <AdminShell><small>STORE CONFIGURATION</small><h1>Settings</h1><form className="settingsForm" onSubmit={save}><label>Store name<input value={form.storeName} onChange={e=>setForm({...form,storeName:e.target.value})}/></label><label>Free delivery threshold (₹)<input type="number" value={form.freeDelivery} onChange={e=>setForm({...form,freeDelivery:e.target.value})}/></label><label>Support email<input type="email" value={form.supportEmail} onChange={e=>setForm({...form,supportEmail:e.target.value})}/></label><button className="btn">{saved?'Saved ✓':'Save Settings'}</button></form></AdminShell>
}

function Admin(){return <AdminDashboard/>}
function App(){return <><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/account" element={<Account/>}/><Route path="/contact" element={<Contact/>}/><Route path="/orders" element={<Orders/>}/><Route path="/admin-dashboard" element={<AdminDashboard/>}/><Route path="/admin-dashboard/products" element={<AdminProducts/>}/><Route path="/admin-dashboard/orders" element={<AdminOrders/>}/><Route path="/admin-dashboard/users" element={<AdminUsers/>}/><Route path="/admin-dashboard/categories" element={<AdminCategories/>}/><Route path="/admin-dashboard/reviews" element={<AdminReviews/>}/><Route path="/admin-dashboard/coupons" element={<AdminCoupons/>}/><Route path="/admin-dashboard/settings" element={<AdminSettings/>}/></Routes><footer><div className="footerInner"><div className="logo">Raven<span>Mart</span></div><p>Shop smarter. Live better.</p><div className="footlinks"><Link to="/shop">Shop</Link><Link to="/orders">Orders</Link><Link to="/account">Account</Link><Link to="/contact">Contact</Link><Link to="/admin-dashboard">Admin</Link></div><div className="footerContact"><a href="mailto:support@ravenmart.local">support@ravenmart.local</a><a href="tel:+919876543210">+91 98765 43210</a></div><small>© 2026 RavenMart. All rights reserved.</small></div></footer></>}
createRoot(document.getElementById('root')).render(<BrowserRouter><CartProvider><App/></CartProvider></BrowserRouter>);
