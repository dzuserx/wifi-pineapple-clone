import os
import requests
import pandas as pd

# Path to your Excel file
excel_file = r"E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\scrapper\hak5_ui_overview_remaing_img.xlsx"

# Folder where images will be saved
output_folder = r"E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\scrapper\remaing_img"
os.makedirs(output_folder, exist_ok=True)

# Read Excel file
df = pd.read_excel(excel_file)

for idx, row in df.iterrows():
    img_name = str(row["img_name"]).strip()
    img_link = str(row["img_link"]).strip()

    if not img_name or not img_link or img_link.lower() == "nan":
        print(f"Skipping row {idx} (missing data)")
        continue

    # Make sure filename has proper extension
    if not os.path.splitext(img_name)[1]:
        img_name += ".png"

    output_path = os.path.join(output_folder, img_name)

    try:
        print(f"Downloading {img_link} -> {output_path}")
        response = requests.get(img_link, timeout=15)
        response.raise_for_status()
        with open(output_path, "wb") as f:
            f.write(response.content)
    except Exception as e:
        print(f"❌ Failed to download {img_link}: {e}")

print("\n✅ Done! Images saved in:", output_folder)
