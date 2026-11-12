import os
import json
import re
from PIL import Image, ImageDraw, ImageFont

def process_and_watermark_images():
    src_dir = r"C:\Users\PC\Downloads\BikeChala images"
    dest_dir = r"C:\Users\PC\.gemini\antigravity\scratch\bikechala\public\images\bikes"
    os.makedirs(dest_dir, exist_ok=True)
    
    bikes_path = r"C:\Users\PC\.gemini\antigravity\scratch\bikechala\src\data\bikes.json"
    images_json_path = r"C:\Users\PC\.gemini\antigravity\scratch\bikechala\src\data\images.json"
    
    with open(bikes_path, "r", encoding="utf-8") as f:
        bikes = json.load(f)
        
    try:
        with open(images_json_path, "r", encoding="utf-8") as f:
            images_data = json.load(f)
    except Exception:
        images_data = {}
        
    # Font setup for watermark
    font_path = r"C:\Windows\Fonts\segoeuib.ttf"
    if not os.path.exists(font_path):
        font_path = r"C:\Windows\Fonts\arialbd.ttf"
        
    files = [f for f in os.listdir(src_dir) if f.lower().endswith(('.jpg', '.png', '.webp', '.jpeg'))]
    print(f"Total downloaded files in source: {len(files)}")
    
    # Pre-process bikes
    # Map by slug and aliases
    bike_by_slug = {b['slug']: b for b in bikes}
    
    # Custom aliases
    aliases = {
        'bmw': 'bmw-motorrad',
        'karizma-xmr': 'hero-karizma-xmr',
        '450x': 'ather-450x',
        'speed-400': 'triumph-speed-400',
    }
    
    def normalize(text):
        t = text.lower().replace('_', ' ').replace('-', ' ')
        t = re.sub(r'[^a-z0-9 ]', '', t)
        return ' '.join(t.split())
        
    # Attempt to match each file
    matched = {} # slug -> [files]
    unmatched = []
    
    for f in files:
        # Strip trailing hash like _47b431da.jpg
        base = re.sub(r'_[a-f0-9]{8}\.[a-zA-Z0-9]+$', '', f, flags=re.I)
        base = re.sub(r'^2024_', '', base)
        norm = normalize(base)
        
        best_match = None
        best_score = 0
        
        for b in bikes:
            brand_slug = b['brandSlug'].replace('-', ' ')
            brand_name = b['brand'].lower()
            model_slug = b['modelSlug'].replace('-', ' ')
            model_name = b['name'].lower()
            
            # Check brand match
            brand_matched = (
                brand_slug in norm or 
                brand_name in norm or
                ('bmw' in norm and 'bmw' in brand_slug) or
                ('enfield' in norm and 'enfield' in brand_slug) or
                ('harley' in norm and 'harley' in brand_slug)
            )
            
            if not brand_matched:
                continue
                
            # Score model match
            model_words = [w for w in normalize(b['name']).split() if w not in ['motorcycle', 'scooter', 'bike', 'new', 'v2', 'v4', '110', '125', '150', '160', '200', '250', '300', '350', '400', '450', '500', '650']]
            numbers = re.findall(r'\b\d+\b', normalize(b['name']))
            
            score = 0
            # Check for numbers in filename
            fn_numbers = re.findall(r'\b\d+\b', norm)
            num_match = True
            if numbers:
                # If bike has numbers, they should match
                for n in numbers:
                    if n in fn_numbers:
                        score += 3
                    else:
                        num_match = False
            
            if not num_match and numbers:
                continue
                
            for w in model_words:
                if w in norm:
                    score += 2
                    
            # Bonus if whole model slug is substring
            if normalize(b['modelSlug']) in norm:
                score += 5
                
            if score > best_score and score >= 2:
                best_score = score
                best_match = b
                
        if best_match:
            matched.setdefault(best_match['slug'], []).append(f)
        else:
            unmatched.append(f)
            
    print(f"Matched {len(matched)} bikes with {sum(len(v) for v in matched.values())} specific images.")
    print(f"Unmatched generic/extra images: {len(unmatched)}")
    
    # Generic category matching for remaining unmatched bikes!
    # Unmatched images contain: Adventure_..., Electric_scooter_..., Scooter_..., Motorcycle_...
    category_pools = {
        'adventure': [],
        'off-road': [],
        'scooter': [],
        'electric': [],
        'sports': [],
        'naked': [],
        'cruiser': [],
        'commuter': []
    }
    
    for f in unmatched:
        fl = f.lower()
        if 'adventure' in fl or 'off-road' in fl:
            category_pools['adventure'].append(f)
        elif 'electric' in fl:
            category_pools['electric'].append(f)
        elif 'scooter' in fl:
            category_pools['scooter'].append(f)
        elif 'racetrack' in fl or 'racing' in fl or 'cornering' in fl:
            category_pools['sports'].append(f)
        elif 'cruis' in fl or 'highway' in fl:
            category_pools['cruiser'].append(f)
        else:
            category_pools['commuter'].append(f)
            category_pools['naked'].append(f)
            
    print(f"Category fallback pool sizes: { {k: len(v) for k, v in category_pools.items()} }")
    
    # Fill remaining bikes that have no image yet from category pool if needed
    cat_pool_idx = {k: 0 for k in category_pools}
    for b in bikes:
        slug = b['slug']
        if slug not in matched and slug not in images_data:
            cat = b.get('category', 'naked')
            fuel = b.get('fuelType', 'petrol')
            pool_key = 'electric' if fuel == 'electric' else cat
            if pool_key not in category_pools or not category_pools[pool_key]:
                pool_key = 'commuter' if cat in ['commuter', 'naked'] else 'sports'
                
            pool = category_pools.get(pool_key)
            if not pool:
                pool = category_pools.get('commuter') or files
                
            if pool:
                matched[slug] = [pool[cat_pool_idx[pool_key] % len(pool)]]
                cat_pool_idx[pool_key] += 1
                
    print(f"After category mapping, total bikes covered: {len(matched)}")
    
    # Watermarking Function
    def apply_watermark(img_path, output_path):
        with Image.open(img_path) as im:
            im = im.convert("RGBA")
            w, h = im.size
            
            # Create overlay layer
            overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
            draw = ImageDraw.Draw(overlay)
            
            # Badge text
            text = "bikechala.com"
            # Scale font size relative to image resolution (e.g. 18px for 1200px width)
            font_size = max(15, int(w * 0.016))
            try:
                font = ImageFont.truetype(font_path, font_size)
            except Exception:
                font = ImageFont.load_default()
                
            # Measure text size
            bbox = draw.textbbox((0, 0), text, font=font)
            text_w = bbox[2] - bbox[0]
            text_h = bbox[3] - bbox[1]
            
            # Padding around text in pill
            pad_x = int(font_size * 0.6)
            pad_y = int(font_size * 0.35)
            
            badge_w = text_w + (pad_x * 2)
            badge_h = text_h + (pad_y * 2)
            
            # Position at bottom right with margin
            margin_x = int(w * 0.02)
            margin_y = int(h * 0.025)
            
            box_x0 = w - badge_w - margin_x
            box_y0 = h - badge_h - margin_y
            box_x1 = w - margin_x
            box_y1 = h - margin_y
            
            # Draw sleek glassmorphic pill background: dark semi-transparent capsule
            pill_radius = int(badge_h / 2)
            draw.rounded_rectangle(
                [box_x0, box_y0, box_x1, box_y1],
                radius=pill_radius,
                fill=(15, 23, 42, 160), # Dark slate, ~63% opacity
                outline=(255, 255, 255, 60), # subtle 1px white border ~24% opacity
                width=1
            )
            
            # Draw brand dot: BikeChala primary orange dot
            dot_radius = int(font_size * 0.22)
            dot_cx = box_x0 + pad_x + dot_radius
            dot_cy = box_y0 + (badge_h // 2)
            draw.ellipse(
                [dot_cx - dot_radius, dot_cy - dot_radius, dot_cx + dot_radius, dot_cy + dot_radius],
                fill=(234, 88, 12, 230) # BikeChala orange (#EA580C)
            )
            
            # Draw clean white text
            text_x = dot_cx + dot_radius + int(font_size * 0.35)
            text_y = box_y0 + pad_y - 1
            draw.text((text_x, text_y), text, font=font, fill=(255, 255, 255, 235))
            
            # Composite overlay
            final_img = Image.alpha_composite(im, overlay)
            # Save as high-quality WebP or JPEG
            final_rgb = final_img.convert("RGB")
            final_rgb.save(output_path, "JPEG", quality=90, optimize=True)
            
    # Process all matched bikes
    count_processed = 0
    for slug, img_files in matched.items():
        primary_file = img_files[0]
        src_file_path = os.path.join(src_dir, primary_file)
        
        target_name = f"{slug}.jpg"
        target_dest = os.path.join(dest_dir, target_name)
        
        try:
            apply_watermark(src_file_path, target_dest)
            images_data[slug] = {
                "src": f"/images/bikes/{target_name}",
                "credit": "bikechala.com",
                "sourceUrl": "https://bikechala.com",
                "fetchedAt": "2026-11-12"
            }
            count_processed += 1
        except Exception as e:
            print(f"Error processing {primary_file} for {slug}: {e}")
            
    # Save images.json
    with open(images_json_path, "w", encoding="utf-8") as f:
        json.dump(images_data, f, indent=1)
        
    print(f"\nSUCCESS! Watermarked and integrated {count_processed} bike images into public/images/bikes/")
    print(f"Total entries in images.json: {len(images_data)}")

if __name__ == "__main__":
    process_and_watermark_images()
