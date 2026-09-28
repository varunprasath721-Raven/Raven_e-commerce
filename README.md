# RavenMart — Premium Full-Stack Marketplace (Camera Category Update)

Amazon/Flipkart-style marketplace built for the React JS + Django syllabus.

## Stack
- React + Vite
- React Router
- Context API
- Hooks: useState, useEffect, useMemo, useCallback, useRef
- REST API integration with Axios
- Django + Django REST Framework
- SQLite
- Django Admin
- CRUD-ready product API
- Cart, wishlist, checkout, orders
- Responsive premium UI

## Run
### Backend
```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_products
python manage.py createsuperuser
python manage.py runserver
```
Backend: http://125.0.0.1:8000
Admin: http://125.0.0.1:8000/admin/

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:5173

The frontend expects the API at `http://125.0.0.1:8000/api`.

## Product catalogue
The seed command creates **20 products per subcategory** across the main marketplace sections, including. Product cards use real product-photo sources (not avatar placeholders), and category filters are wired to the seeded child categories:
- Men: T-Shirts, Shirts, Pants, Jeans, Shoes
- Women: Tops, Dresses, Jeans, Sarees, Shoes
- Kids: Boys, Girls, Shoes
- Electronics: Mobiles, Laptops, Earbuds, Watches, Cameras
- Toys: Toys
- Accessories: Belts, Wallets, Sunglasses, Caps, Perfumes
- Home & Kitchen, Beauty, Sports, Books, Grocery

You can add/edit/delete products from Django Admin.

### Important
If you previously ran an older RavenMart build, run `python manage.py seed_products` once after replacing the files so the old placeholder image URLs are replaced by the new product-photo URLs.


## Laptop real-photo update
The Laptop category has been updated to use the 15 real laptop photos supplied with this project. They are stored locally in `frontend/public/product-images/laptops/` and mapped to the named laptop models in `LAPTOP_IMAGES_INSTALLED.txt`. The laptop seed count is 15 because 15 laptop photos were supplied in this upload. Run `python manage.py seed_products` after replacing the project files.

## Women’s Shoes — 25 real pair photos
This version includes **25 user-supplied shoe pair photos** in `frontend/public/product-images/shoes/` (`shoe-01.jpg` through `shoe-25.jpg`). The Women → Shoes seed data uses all 25 local images, so the catalog does not depend on remote placeholder shoe photos for these products.

After extracting the ZIP, run:
```bash
cd backend
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```
Then open the frontend and select **Shoes** from the category filters.

## Latest update: Tops category
The Tops category now contains 20 product slots using local JPG images in `frontend/public/product-images/tops/`. The React catalogue and Django `seed_products` command are both wired to these images. See `TOPS_IMAGES_INSTALLED.txt` for setup details.

## Smartwatch category update
The Watches category is wired to 20 local JPG product images in `frontend/public/product-images/watches/`, with the requested Apple, Samsung, OnePlus, Amazfit, Garmin, Huawei, boAt, Noise, Fire-Boltt, Fastrack, Titan, Google, Redmi, Xiaomi, Realme, Honor, CMF and Fossil product names.

## Camera category — 20 local photos
The Electronics → Cameras category now uses 20 local JPG images in `frontend/public/product-images/cameras/` (`camera-01.jpg` through `camera-20.jpg`). The Django seed command and React local fallback both use these images. Run `python manage.py seed_products` after replacing the project files.

## Toys Category - 20 Images
The Toys category now uses 20 supplied product photos in `frontend/public/product-images/toys/` and matching backend static copies. Product names and image paths are configured in the frontend and `seed_products` command.


## Current Update – Sunglasses
- Added 20 products under the **Sunglasses** category.
- 19 images are the sunglasses images supplied in the latest chat upload.
- Image 20 is a matching derived variant because the latest upload contained 19 visible sunglasses images.
- Real images are installed in both `backend/store/static/product-images/sunglasses/` and `frontend/public/product-images/sunglasses/`.
- Run `python manage.py seed_products` after migration to populate the category.


## Books Category
The Books category contains 20 book-cover products using the supplied images plus a 20th Django Web Development cover. Frontend assets are in `frontend/public/product-images/books/` and backend static assets are in `backend/store/static/product-images/books/`.

Run the backend with `python manage.py runserver` and the frontend with `npm install` followed by `npm run dev`.

## Latest update: Caps category — 20 images
The Accessories → Caps category now contains 20 local JPG product images in `frontend/public/product-images/caps/` and matching Django static assets in `backend/store/static/product-images/caps/`. The React catalogue fallback and Django `seed_products` command are wired to all 20 cap products.

Run after extracting the ZIP:
```bash
cd backend
python manage.py migrate
python manage.py seed_products
python manage.py runserver
```
Then in a second terminal:
```bash
cd frontend
npm install
npm run dev
```

The upload contained 19 visible cap photos; `cap-20.jpg` is a derived charcoal variant of the first supplied cap photo so the requested category has 20 product slots.


## Perfume category update
- 20 perfume product images are installed under `frontend/public/product-images/perfumes/`.
- 19 are the user-supplied photos from the latest update; item 20 is the existing RavenMart premium catalog image converted to JPG.
- `seed_products` now uses the same local perfume image paths, names, brands and fixed prices.
