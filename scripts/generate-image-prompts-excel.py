import json
import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel():
    base_dir = r"C:\Users\PC\.gemini\antigravity\scratch\bikechala"
    bikes_path = os.path.join(base_dir, "src", "data", "bikes.json")
    
    with open(bikes_path, "r", encoding="utf-8") as f:
        bikes = json.load(f)
        
    wb = openpyxl.Workbook()
    # remove default sheet
    default_sheet = wb.active
    
    # -------------------------------------------------------------
    # 1. Styles
    # -------------------------------------------------------------
    font_family = "Segoe UI"
    
    header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Dark Slate / Navy
    header_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    
    sub_header_fill = PatternFill(start_color="334155", end_color="334155", fill_type="solid")
    sub_header_font = Font(name=font_family, size=10, bold=True, color="F8FAFC")
    
    accent_fill = PatternFill(start_color="EA580C", end_color="EA580C", fill_type="solid") # BikeChala Orange
    accent_font = Font(name=font_family, size=11, bold=True, color="FFFFFF")
    
    zebra_even = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
    zebra_odd = PatternFill(start_color="FFFFFF", end_color="FFFFFF", fill_type="solid")
    
    halo_tag_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Light Amber
    halo_tag_font = Font(name=font_family, size=10, bold=True, color="92400E")
    
    high_tag_fill = PatternFill(start_color="E0F2FE", end_color="E0F2FE", fill_type="solid") # Light Sky Blue
    high_tag_font = Font(name=font_family, size=10, bold=True, color="0369A1")
    
    norm_tag_fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid") # Neutral Gray
    norm_tag_font = Font(name=font_family, size=10, bold=False, color="475569")
    
    border_thin = Side(border_style="thin", color="CBD5E1")
    cell_border = Border(left=border_thin, right=border_thin, top=border_thin, bottom=border_thin)
    
    align_center = Alignment(horizontal="center", vertical="center")
    align_left = Alignment(horizontal="left", vertical="center")
    align_wrap_left = Alignment(horizontal="left", vertical="center", wrap_text=True)

    # -------------------------------------------------------------
    # Helper to classify iconic/halo bikes for 3 shots vs 2 shots
    # -------------------------------------------------------------
    halo_keywords = [
        "himalayan", "scrambler", "tiger", "adventure", "ninja", "panigale", "monster", 
        "hayabusa", "gold wing", "super meteor", "continental gt", "interceptor", 
        "r15", "mt-15", "duke 390", "rc 390", "ns400z", "dominar 400", "f77", "speed 400", 
        "aerox", "ather 450", "s1 pro", "classic 350", "bullet 350", "apache rtr 310",
        "zx-6r", "z900", "diavel", "multistrada", "desertx", "streetfighter"
    ]
    
    def is_halo(bike):
        slug = bike["slug"].lower()
        price = bike.get("exShowroomPriceInr") or 0
        cat = bike.get("category", "")
        if price >= 350000:
            return True
        if any(k in slug for k in halo_keywords):
            return True
        if cat in ["sports", "adventure"]:
            return True
        return False

    # -------------------------------------------------------------
    # 2. Build Prompts
    # -------------------------------------------------------------
    all_prompts = []
    
    for b in bikes:
        slug = b["slug"]
        brand = b["brand"]
        name = b["name"]
        cat = b.get("category", "naked")
        fuel = b.get("fuelType", "petrol")
        cc = b.get("engineCc")
        halo = is_halo(b)
        price_inr = b.get("exShowroomPriceInr") or 0
        priority = "Halo / Flagship" if halo else ("High Volume" if price_inr < 180000 and price_inr > 0 else "Standard")
        
        # Color & design notes
        color_note = "signature factory OEM color scheme"
        if "yamaha" in slug:
            color_note = "metallic Racing Blue and Matte Black dual-tone"
        elif "ktm" in slug:
            color_note = "signature vibrant Electric Orange and White livery"
        elif "kawasaki" in slug:
            color_note = "iconic Lime Green and Metallic Spark Black"
        elif "ducati" in slug:
            color_note = "glossy Ducati Red with exposed trellis frame"
        elif "royal-enfield" in slug:
            color_note = "premium metallic British Racing Green or Chrome Black"
        elif "honda" in slug:
            color_note = "deep metallic Pearl Siren Blue and gloss black"
        elif "hero" in slug:
            color_note = "vibrant Sports Red and techno blue dual-tone"
        elif "tvs" in slug:
            color_note = "striking Racing Red with subtle matte charcoal graphics"
        elif "bajaj" in slug:
            color_note = "satin Gloss Pewter Grey with burnt red accents"
        elif "ather" in slug:
            color_note = "futuristic Lunar Grey with high-viz orange accents"
        elif "ola" in slug:
            color_note = "minimalist Liquid Silver / Porcelain White finish"
        elif "bmw" in slug:
            color_note = "M-Sport Triple Black or Light White with racing stripes"
            
        neg_prompt = (
            "text, watermark, logo typography, brand lettering, distorted badges, gibberish characters, "
            "fake writing, illegible decals, blurry details, deformed handlebars, double front wheel, "
            "warped spokes, extra exhaust pipes, unrealistic reflections, floating parts, CGI video game render"
        )
        
        # Prompt 1: Showroom / Studio Hero Shot (For ALL bikes)
        if cat in ["scooter"]:
            p1_scene = "Minimalist luxury automotive showroom with seamless light-grey epoxy floor and soft diffused overhead light panels."
            p1_prompt = (
                f"Commercial automotive catalog photography of a pristine 2024 {brand} {name} scooter in {color_note}. "
                f"Full motorcycle side-profile three-quarter perspective, parked inside an ultra-modern minimalist architectural showroom. "
                f"Polished seamless grey concrete flooring with soft diffuse reflections, overhead diffused studio softbox lightbank, "
                f"gleaming body panels, sharp LED daytime running lights illuminated, crystal-clear alloy wheels and disc brakes. "
                f"Shot on Hasselblad H6D-100c, 85mm f/4 lens, studio lighting, hyper-realistic, 8k resolution, ray-traced shadows, "
                f"crisp mechanical detail, completely clean bodywork with no text, no decals, no watermarks."
            )
        elif cat in ["adventure", "off-road"]:
            p1_scene = "Architectural industrial showroom with dark slate floor, warm spotlighting, and exposed brushed concrete backdrop."
            p1_prompt = (
                f"High-end automotive studio photography of a rugged 2024 {brand} {name} adventure motorcycle in {color_note}. "
                f"Front three-quarter stance, high ground clearance, tall adventure windscreen, steel spoke wheels, deep knobby all-terrain tires, "
                f"inverted front forks, engine bash plate. Parked in a dark modern automotive pavilion with polished dark charcoal stone floor. "
                f"Subtle rim lighting highlighting the sculpted fuel tank and rugged frame. "
                f"Shot on Sony A1, 70mm f/2.8, ultra-sharp focus, commercial automotive advertising quality, 8k resolution, no text, no badges, no watermark."
            )
        elif cat in ["sports"]:
            p1_scene = "High-tech futuristic automotive studio with gloss black floor and geometric linear LED lightbars tracing the aerodynamics."
            p1_prompt = (
                f"Masterpiece commercial studio photography of a 2024 {brand} {name} supersport motorcycle in {color_note}. "
                f"Aggressive aerodynamic front three-quarter stance, sharp full fairing, aerodynamic winglets, clip-on handlebars, "
                f"radial Brembo brake calipers, perimeter frame, wide rear racing radial tire. "
                f"Standing on a mirror-gloss black automotive showroom turntable with clean white linear overhead softbox strip lighting. "
                f"Incredible metallic paint depth, realistic carbon fiber weave, pristine reflection. Hasselblad 100MP, f/3.2, 8k, no text, no watermark."
            )
        elif cat in ["cruiser"]:
            p1_scene = "Heritage architectural showroom with rustic reclaimed timber floor, dark bronze accents, and warm ambient spotlighting."
            p1_prompt = (
                f"Ultra-realistic commercial photography of a 2024 {brand} {name} modern classic cruiser motorcycle in {color_note}. "
                f"Side profile three-quarter hero view, teardrop sculpted fuel tank, wide touring handlebars, low-slung premium stitched leather seat, "
                f"twin exhaust pipes, gleaming engine cooling fins, spoked alloy wheels. "
                f"Set inside a curated industrial brick and warm timber showroom, ambient vintage spotlighting creating rich warm specular highlights. "
                f"Shot on Leica S3, 70mm Summarit lens, f/2.8, magazine cover quality, 8k resolution, no text, no letters, no watermark."
            )
        else: # naked & commuter
            p1_scene = "Modern clean dealership showroom with polished stone floor and natural bright architectural window illumination."
            p1_prompt = (
                f"Ultra-detailed commercial automotive photograph of a brand new 2024 {brand} {name} motorcycle in {color_note}. "
                f"Clean side three-quarter profile showing the muscular fuel tank, exposed engine casing, perimeter frame, alloy wheels, and disc brakes. "
                f"Stationed inside a modern bright dealership showroom with polished reflective flooring and soft diffuse ambient lighting. "
                f"Immaculate factory condition, crisp tires, gleaming paint lacquer, authentic realistic automotive photography, 8k resolution, "
                f"Shot on Canon EOS R5, 50mm f/2.8, sharp focus, no text, no fake decals, no watermarks."
            )
            
        all_prompts.append({
            "slug": slug,
            "brand": brand,
            "model": name,
            "category": cat.title(),
            "fuel": fuel.title(),
            "shot_idx": "Shot 1 (Hero)",
            "shot_type": "Showroom / Studio Hero",
            "setting": p1_scene,
            "target_filename": f"{slug}-hero.webp",
            "prompt": p1_prompt,
            "neg_prompt": neg_prompt,
            "aspect": "16:9 Landscape",
            "priority": priority
        })
        
        # Prompt 2: Real-World Environment / Action Shot (Tailored by category)
        if cat in ["adventure", "off-road"]:
            p2_scene = "Winding gravel switchbacks of Ladakh / Spiti Valley at sunset, snow-capped mountain ranges in the backdrop."
            p2_prompt = (
                f"Cinematic outdoor action photography of the 2024 {brand} {name} adventure motorcycle conquering an unpaved mountain pass in Spiti Valley. "
                f"The bike is stationary on a rocky scenic overlook at golden hour, dramatic Himalayan snow peaks glowing under warm twilight sky. "
                f"Detailed knobby dual-sport tires with realistic light dust, tall touring screen, auxiliary fog lamps, rugged dual luggage mounts. "
                f"Epic wide-angle landscape framing, National Geographic expedition style, shot on Hasselblad H6D, f/4, 8k resolution, no text, no watermark."
            )
            p2_type = "Off-road / Adventure Expedition"
        elif cat in ["sports"]:
            p2_scene = "Apex corner of an asphalt Grand Prix race circuit with red-white kerbs and warm golden hour sunlight."
            p2_prompt = (
                f"Dynamic motorsport photography of the 2024 {brand} {name} supersport motorcycle on the apex kerb of a world-class asphalt racetrack. "
                f"Front three-quarter dynamic tracking shot, low camera angle, crisp tarmac texture, high-performance racing tires, "
                f"aerodynamic cowl cutting through the air, brilliant sun flare highlighting the muscular fuel tank curve. "
                f"Motion blur in the distant grandstand while the motorcycle remains tack sharp. Shot on Nikon Z9 at 1/2000s, 85mm f/2.0, 8k, no text, no watermark."
            )
            p2_type = "Track / Dynamic Apex"
        elif cat in ["cruiser"]:
            p2_scene = "Scenic coastal cliffside highway overlooking the ocean at sunset with warm amber rays."
            p2_prompt = (
                f"Cinematic lifestyle automotive photograph of the 2024 {brand} {name} cruiser parked on the scenic asphalt shoulder of a winding coastal highway. "
                f"Golden hour sunset glowing over the ocean horizon, warm golden rim light outlining the relaxed cruiser silhouette, twin exhausts, and teardrop tank. "
                f"Rich deep paint reflections, gentle sea breeze atmosphere, authentic road trip spirit. Shot on Phase One IQ4, 80mm f/2.8, photorealistic, 8k, no text, no watermark."
            )
            p2_type = "Coastal / Scenic Touring"
        elif cat in ["scooter"]:
            p2_scene = "Contemporary urban glass architectural plaza with lush minimalist landscaping and morning sunlight."
            p2_prompt = (
                f"Vibrant urban lifestyle photography of a 2024 {brand} {name} scooter parked outside a modern glass-facade cafe in a high-tech smart city. "
                f"Morning sunlight casting soft natural shadows on clean paved promenade, lush manicured planters in gentle background blur. "
                f"Sleek clean body styling, LED headlight glow, pristine alloy wheels, effortless urban elegance. "
                f"Shot on Sony A7R V, 50mm f/2.2, crisp commercial magazine look, 8k resolution, no text, no watermark."
            )
            p2_type = "Smart City / Urban Lifestyle"
        elif cat in ["naked"]:
            p2_scene = "Rain-slicked modern metropolitan boulevard at night with glowing neon reflections and city bokeh."
            p2_prompt = (
                f"Moody cinematic night photography of the 2024 {brand} {name} streetfighter motorcycle parked under streetlamps on an urban wet asphalt street. "
                f"Vibrant cyan and warm amber neon reflections glistening on wet ground, soft city bokeh background. "
                f"Aggressive low headlight stance, exposed trellis frame, muscular tank, crisp metallic textures. "
                f"Commercial automotive campaign style, shot on Sony A1 with 85mm f/1.8 G-Master, ultra-detailed, 8k, no text, no watermark."
            )
            p2_type = "Urban Night Streetfighter"
        else: # commuter
            p2_scene = "Quiet tree-lined countryside paved road with fresh morning light and open green horizons."
            p2_prompt = (
                f"Crisp outdoor landscape automotive photograph of a 2024 {brand} {name} motorcycle parked on the paved roadside of a tranquil green country highway. "
                f"Fresh early morning sun casting long gentle shadows, clear blue sky, authentic Indian rural-suburban scenic backdrop. "
                f"Pristine glossy paint, polished chrome crash guards, clean utilitarian elegance, sharp mechanical engine detail. "
                f"Shot on Canon EOS R5, 50mm f/2.8, natural lifelike colors, 8k resolution, no text, no logos, no watermark."
            )
            p2_type = "Scenic Road / Daily Commute"
            
        all_prompts.append({
            "slug": slug,
            "brand": brand,
            "model": name,
            "category": cat.title(),
            "fuel": fuel.title(),
            "shot_idx": "Shot 2 (Environment)",
            "shot_type": p2_type,
            "setting": p2_scene,
            "target_filename": f"{slug}-action.webp",
            "prompt": p2_prompt,
            "neg_prompt": neg_prompt,
            "aspect": "16:9 Landscape",
            "priority": priority
        })
        
        # Prompt 3: Detailed 3/4 Dramatic Mechanical Close-up (For HALO & FLAGSHIP models)
        if halo:
            p3_scene = "Moody dark studio vignette with high-contrast rim lighting focusing on mechanical precision."
            p3_prompt = (
                f"Extreme-detail commercial automotive close-up of the 2024 {brand} {name} motorcycle. "
                f"Low-angle dramatic three-quarter composition highlighting the front upside-down suspension, drilled petal disc brakes with radial calipers, "
                f"sculpted front fairing, and intricate engine casing. "
                f"Dark moody studio background with directional cinematic rim light catching edges of metallic paint and cast alloy wheels. "
                f"Hyper-detailed mechanical textures, authentic engineering craftsmanship. Hasselblad H6D-100c, 90mm macro f/4, 8k, no text, no watermark."
            )
            all_prompts.append({
                "slug": slug,
                "brand": brand,
                "model": name,
                "category": cat.title(),
                "fuel": fuel.title(),
                "shot_idx": "Shot 3 (Detail)",
                "shot_type": "Low-Angle Mechanical Detail",
                "setting": p3_scene,
                "target_filename": f"{slug}-detail.webp",
                "prompt": p3_prompt,
                "neg_prompt": neg_prompt,
                "aspect": "4:3 Classic",
                "priority": priority
            })

    print(f"Total prompt rows generated: {len(all_prompts)}")

    # -------------------------------------------------------------
    # 3. Sheet 1: Guide & Instructions
    # -------------------------------------------------------------
    ws_guide = wb.create_sheet(title="User Guide & Google Flow")
    
    ws_guide.column_dimensions["A"].width = 5
    ws_guide.column_dimensions["B"].width = 28
    ws_guide.column_dimensions["C"].width = 90
    
    # Title
    ws_guide.merge_cells("B2:C2")
    ws_guide["B2"] = "BikeChala.com - AI Image Generation Master Blueprint"
    ws_guide["B2"].font = Font(name=font_family, size=16, bold=True, color="EA580C")
    ws_guide["B2"].alignment = align_left
    
    ws_guide.merge_cells("B3:C3")
    ws_guide["B3"] = "Curated for Google Flow / Imagen 3 / Midjourney v6 / Flux.1 to produce ultra-realistic motorcycle photography."
    ws_guide["B3"].font = Font(name=font_family, size=10, italic=True, color="64748B")
    ws_guide["B3"].alignment = align_left
    
    guide_sections = [
        ("1. Generation Philosophy", 
         "Every prompt in this sheet has been engineered to eliminate AI 'gibberish' (fake brand badges, warped typography, warped spokes, or mutant parts). "
         "Instead of generating fake badges, the prompts focus on authentic lighting, correct silhouettes, OEM factory paint finishes, and high-fidelity camera optics (Hasselblad, Sony A1, Leica)."),
        
        ("2. How to Use in Google Flow / Imagen", 
         "1. Go to the 'All Bike Prompts' tab.\n"
         "2. Copy the 'Generation Prompt' column into your Google Flow / ImageFX / Imagen interface.\n"
         "3. Copy the 'Negative Prompt' into the negative prompt field to ensure no distorted text or watermarks.\n"
         "4. Set Aspect Ratio to 16:9 for Hero/Action shots, or 4:3 for Detail shots.\n"
         "5. Generate 2 to 4 candidates, and pick the cleanest, most realistic rendering."),
        
        ("3. Saving & Integration Workflow", 
         "1. Download your chosen image.\n"
         "2. Rename it to the exact value in 'Target Filename' (e.g. 'yamaha-r15-v4-hero.webp' or '.jpg').\n"
         "3. Place the image in your project under: public/images/bikes/\n"
         "4. Once placed, the website automatically loads it via src/data/images.json!"),
         
        ("4. Shot Distribution Strategy", 
         f"• Total Bikes Covered: {len(bikes)} models across 24 brands.\n"
         f"• Total Prompts Generated: {len(all_prompts)} tailored scenarios.\n"
         "• Flagship / Halo Models (Superbikes, ADVs, Cult Classics): 3 Shots (Showroom Hero, Dynamic Action/Off-road, Mechanical Detail).\n"
         "• Standard & Commuter Models: 2 Shots (Showroom Hero, Real-world Scenic Road)."),
         
        ("5. Pro-Tips for Zero AI Gibberish", 
         "• If an AI tool attempts to draw letters on the fuel tank, specify '--no text, letters, font' or use inpainting to wipe the tank smooth.\n"
         "• For adventure bikes (Himalayan, KTM Adventure), keep the offroad terrain subtle so the motorcycle silhouette remains 100% visible.\n"
         "• For studio hero shots, a clean neutral background (dark slate or light concrete) makes the motorcycle pop best on the website.")
    ]
    
    curr_row = 5
    for title, desc in guide_sections:
        ws_guide.cell(row=curr_row, column=2, value=title).font = Font(name=font_family, size=11, bold=True, color="1E293B")
        ws_guide.cell(row=curr_row, column=2).fill = PatternFill(start_color="F1F5F9", end_color="F1F5F9", fill_type="solid")
        ws_guide.cell(row=curr_row, column=2).border = cell_border
        
        cell_desc = ws_guide.cell(row=curr_row, column=3, value=desc)
        cell_desc.font = Font(name=font_family, size=10, color="334155")
        cell_desc.alignment = Alignment(wrap_text=True, vertical="top")
        cell_desc.border = cell_border
        
        line_count = desc.count("\n") + len(desc) // 80 + 1
        ws_guide.row_dimensions[curr_row].height = max(35, line_count * 18)
        curr_row += 2

    # -------------------------------------------------------------
    # 4. Sheet 2: All Bike Prompts (Main Data)
    # -------------------------------------------------------------
    ws_data = wb.create_sheet(title="All Bike Prompts")
    ws_data.views.sheetView[0].showGridLines = True
    
    headers = [
        ("ID", 6),
        ("Brand", 15),
        ("Model Name", 26),
        ("Category", 14),
        ("Fuel", 10),
        ("Shot #", 16),
        ("Shot Type", 24),
        ("Target Filename", 28),
        ("Scenery / Setting", 35),
        ("Ultra-Realistic Generation Prompt", 85),
        ("Negative Prompt (Anti-Gibberish)", 45),
        ("Aspect Ratio", 15),
        ("Priority", 16),
        ("Status", 12)
    ]
    
    # Write headers
    for col_idx, (h_title, h_width) in enumerate(headers, 1):
        cell = ws_data.cell(row=1, column=col_idx, value=h_title)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = align_center
        cell.border = cell_border
        ws_data.column_dimensions[get_column_letter(col_idx)].width = h_width
    
    ws_data.row_dimensions[1].height = 28
    ws_data.freeze_panes = "A2"
    
    # Write data rows
    for row_idx, item in enumerate(all_prompts, 2):
        row_fill = zebra_even if row_idx % 2 == 0 else zebra_odd
        ws_data.row_dimensions[row_idx].height = 45
        
        row_values = [
            row_idx - 1,
            item["brand"],
            item["model"],
            item["category"],
            item["fuel"],
            item["shot_idx"],
            item["shot_type"],
            item["target_filename"],
            item["setting"],
            item["prompt"],
            item["neg_prompt"],
            item["aspect"],
            item["priority"],
            "Pending"
        ]
        
        for col_idx, val in enumerate(row_values, 1):
            cell = ws_data.cell(row=row_idx, column=col_idx, value=val)
            cell.fill = row_fill
            cell.border = cell_border
            cell.font = Font(name=font_family, size=10, color="0F172A")
            
            # Alignments
            if col_idx in [1, 5, 6, 12, 14]:
                cell.alignment = align_center
            elif col_idx in [9, 10, 11]:
                cell.alignment = align_wrap_left
            else:
                cell.alignment = align_left
                
            # Priority badge styling
            if col_idx == 13:
                if val == "Halo / Flagship":
                    cell.fill = halo_tag_fill
                    cell.font = halo_tag_font
                elif val == "High Volume":
                    cell.fill = high_tag_fill
                    cell.font = high_tag_font
                else:
                    cell.fill = norm_tag_fill
                    cell.font = norm_tag_font
                cell.alignment = align_center
                
            # Status styling
            if col_idx == 14:
                cell.font = Font(name=font_family, size=10, bold=True, color="64748B")

    # Autofilter
    ws_data.auto_filter.ref = f"A1:N{len(all_prompts) + 1}"

    # -------------------------------------------------------------
    # 5. Sheet 3: Summary by Brand
    # -------------------------------------------------------------
    ws_brand = wb.create_sheet(title="Summary by Brand")
    ws_brand.views.sheetView[0].showGridLines = True
    
    brand_headers = [("Brand", 20), ("Total Models", 14), ("Total Images Planned", 22), ("Halo Models", 14), ("Top Categories", 35)]
    for col_idx, (h_title, h_width) in enumerate(brand_headers, 1):
        cell = ws_brand.cell(row=1, column=col_idx, value=h_title)
        cell.fill = sub_header_fill
        cell.font = sub_header_font
        cell.alignment = align_center
        cell.border = cell_border
        ws_brand.column_dimensions[get_column_letter(col_idx)].width = h_width
    ws_brand.row_dimensions[1].height = 25
    
    # Aggregate brand stats
    brand_map = {}
    for b in bikes:
        br = b["brand"]
        if br not in brand_map:
            brand_map[br] = {"count": 0, "halo": 0, "cats": set(), "images": 0}
        brand_map[br]["count"] += 1
        brand_map[br]["cats"].add(b.get("category", "").title())
        is_h = is_halo(b)
        if is_h:
            brand_map[br]["halo"] += 1
            brand_map[br]["images"] += 3
        else:
            brand_map[br]["images"] += 2
            
    sorted_brands = sorted(brand_map.items(), key=lambda x: x[1]["count"], reverse=True)
    
    for r_idx, (br, st) in enumerate(sorted_brands, 2):
        r_fill = zebra_even if r_idx % 2 == 0 else zebra_odd
        ws_brand.row_dimensions[r_idx].height = 20
        
        vals = [br, st["count"], st["images"], st["halo"], ", ".join(sorted(st["cats"]))]
        for c_idx, v in enumerate(vals, 1):
            cell = ws_brand.cell(row=r_idx, column=c_idx, value=v)
            cell.fill = r_fill
            cell.border = cell_border
            cell.font = Font(name=font_family, size=10, color="0F172A")
            if c_idx in [2, 3, 4]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left

    # Total row
    tot_row = len(sorted_brands) + 2
    ws_brand.cell(row=tot_row, column=1, value="TOTAL").font = Font(name=font_family, size=10, bold=True)
    ws_brand.cell(row=tot_row, column=2, value=sum(s["count"] for _, s in sorted_brands)).font = Font(name=font_family, size=10, bold=True)
    ws_brand.cell(row=tot_row, column=3, value=sum(s["images"] for _, s in sorted_brands)).font = Font(name=font_family, size=10, bold=True)
    ws_brand.cell(row=tot_row, column=4, value=sum(s["halo"] for _, s in sorted_brands)).font = Font(name=font_family, size=10, bold=True)
    ws_brand.cell(row=tot_row, column=5, value=f"{len(sorted_brands)} Brands Covered").font = Font(name=font_family, size=10, bold=True)
    
    for c in range(1, 6):
        c_cell = ws_brand.cell(row=tot_row, column=c)
        c_cell.fill = PatternFill(start_color="E2E8F0", end_color="E2E8F0", fill_type="solid")
        c_cell.border = cell_border
        if c in [2, 3, 4]:
            c_cell.alignment = align_center

    # -------------------------------------------------------------
    # 6. Sheet 4: Summary by Category
    # -------------------------------------------------------------
    ws_cat = wb.create_sheet(title="Summary by Category")
    ws_cat.views.sheetView[0].showGridLines = True
    
    cat_headers = [("Category", 18), ("Total Models", 14), ("Images Planned", 16), ("Ideal Scenery Setting", 45)]
    for col_idx, (h_title, h_width) in enumerate(cat_headers, 1):
        cell = ws_cat.cell(row=1, column=col_idx, value=h_title)
        cell.fill = sub_header_fill
        cell.font = sub_header_font
        cell.alignment = align_center
        cell.border = cell_border
        ws_cat.column_dimensions[get_column_letter(col_idx)].width = h_width
    ws_cat.row_dimensions[1].height = 25
    
    cat_scenery = {
        "Adventure": "Ladakh/Spiti gravel mountain pass, misty trails, sunrise dramatic lighting",
        "Sports": "Grand Prix racetrack apex kerb, high-gloss turntable showroom, neon city",
        "Naked": "Industrial loft showroom, rain-slicked urban night boulevard, neon reflections",
        "Cruiser": "Scenic coastal cliff highway at golden hour, heritage timber & brick workshop",
        "Scooter": "Minimalist futuristic showroom, modern smart city cafe promenade, bright daylight",
        "Commuter": "Clean modern dealership showroom, tree-lined suburban morning highway",
        "Off-Road": "Rugged dirt trail, sand dunes, rocky switchback, aggressive natural dust freeze"
    }
    
    cat_map = {}
    for b in bikes:
        ct = b.get("category", "naked").title()
        if ct not in cat_map:
            cat_map[ct] = {"count": 0, "images": 0}
        cat_map[ct]["count"] += 1
        cat_map[ct]["images"] += 3 if is_halo(b) else 2
        
    for r_idx, (ct, st) in enumerate(sorted(cat_map.items(), key=lambda x: x[1]["count"], reverse=True), 2):
        r_fill = zebra_even if r_idx % 2 == 0 else zebra_odd
        ws_cat.row_dimensions[r_idx].height = 22
        
        vals = [ct, st["count"], st["images"], cat_scenery.get(ct, "Modern automotive showroom")]
        for c_idx, v in enumerate(vals, 1):
            cell = ws_cat.cell(row=r_idx, column=c_idx, value=v)
            cell.fill = r_fill
            cell.border = cell_border
            cell.font = Font(name=font_family, size=10, color="0F172A")
            if c_idx in [2, 3]:
                cell.alignment = align_center
            else:
                cell.alignment = align_left
                
    # Remove default sheet if exists
    if "Sheet" in wb.sheetnames:
        del wb["Sheet"]

    # -------------------------------------------------------------
    # Save Files
    # -------------------------------------------------------------
    out_file1 = os.path.join(base_dir, "bikechala-image-generation-prompts.xlsx")
    wb.save(out_file1)
    print(f"Saved primary Excel file to: {out_file1}")
    
    artifact_dir = r"C:\Users\PC\.gemini\antigravity\brain\589ffcb7-5363-4d6b-8506-3c9f8c0f10b5"
    out_file2 = os.path.join(artifact_dir, "bikechala-image-generation-prompts.xlsx")
    wb.save(out_file2)
    print(f"Saved copy to artifacts: {out_file2}")

if __name__ == "__main__":
    build_excel()
