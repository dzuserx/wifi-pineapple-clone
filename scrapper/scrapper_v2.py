import requests
from bs4 import BeautifulSoup, NavigableString
import pandas as pd
import os
import re

# List of URLs to scrape
base_url = "https://docs.hak5.org"
urls = [
    "https://docs.hak5.org/wifi-pineapple/ui-overview/introduction-to-the-ui/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/dashboard/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/campaigns/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/pineap/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/recon/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/handshakes/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/modules/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/settings/",
    "https://docs.hak5.org/wifi-pineapple/ui-overview/cloud-c2/"
]

# Output folders
excel_file = "hak5_ui_overview_v2.xlsx"
img_folder = "images_v2"
os.makedirs(img_folder, exist_ok=True)

data_rows = []

for item_id, url in enumerate(urls, start=1):
    print(f"Processing {url}")
    resp = requests.get(url)
    soup = BeautifulSoup(resp.content, "html.parser")

    h1_tags = soup.find_all("h1")

    for item_h1_number, h1_tag in enumerate(h1_tags, start=1):
        item_h1_text = h1_tag.get_text(strip=True)

        # Append first row for H1 only (no image yet)
        data_rows.append({
            "item_id": item_id,
            "item_h1_number": item_h1_number,
            "item_h1": item_h1_text,
            "item_h1_description1": item_h1_text,
            "item_h1_description2": "",
            "item_h2_h3_number": "",
            "item_h2_h3": "",
            "item_h2_h3_description1_html": "",
            "item_h2_h3_custom_img_name_light-mode": "",
            "item_h2_h3_img_link1_light-mode": "",
            "item_h2_h3_img_link2_light-mode": "",
            "item_h2_h3_img_link_dark-mode": ""
        })

        # Find all h2 and h3 tags
        h2_h3_tags = soup.find_all(["h2", "h3"])
        for item_h2_number, h2_h3_tag in enumerate(h2_h3_tags, start=1):
            # Extract text content (stop at <a>)
            h2_text_parts = []
            for child in h2_h3_tag.children:
                if getattr(child, "name", None) == "a":
                    break
                if isinstance(child, NavigableString):
                    h2_text_parts.append(str(child))
                else:
                    h2_text_parts.append(child.get_text(strip=True))
            item_h2_text = " ".join(h2_text_parts).strip()

            # Extract description text (stop before <figure>)
            desc_parts = []
            next_tag = h2_h3_tag.find_next_sibling()
            while next_tag and next_tag.name not in ["h2", "h3", "figure"]:
                desc_parts.append(str(next_tag))
                next_tag = next_tag.find_next_sibling()
            item_h2_description_html = "\n".join(desc_parts).strip()

            # Extract figure image link
            item_h2_img_link = ""
            if next_tag and next_tag.name == "figure":
                img_tag = next_tag.find("img")
                if img_tag and img_tag.get("src"):
                    item_h2_img_link = f"{base_url}{img_tag['src']}"

            # Build custom image name
            custom_item_h1 = re.sub(r"\s+", "_", item_h1_text.lower())
            custom_item_h2 = re.sub(r"\s+", "_", item_h2_text.lower())
            ui_theme = "light-mode"
            item_h2_custom_img_name = ""

            # Download image
            """
            if item_h2_img_link:
                try:
                    item_h2_custom_img_name = f"{item_id}_{custom_item_h1}_{item_h2_number}_{custom_item_h2}_{ui_theme}.png"
                    img_resp = requests.get(item_h2_img_link)
                    img_path = os.path.join(img_folder, item_h2_custom_img_name)
                    with open(img_path, "wb") as f:
                        f.write(img_resp.content)
                    print(f"✅ Downloaded {item_h2_img_link}")
                except Exception as e:
                    print(f"⚠️ Failed to download {item_h2_img_link}: {e}")
            """
            # Append row for h2/h3
            data_rows.append({
                "item_id": item_id,
                "item_h1_number": item_h1_number,
                "item_h1": item_h1_text,
                "item_h1_description1": "",
                "item_h1_description2": "",
                "item_h2_h3_number": item_h2_number,
                "item_h2_h3": item_h2_text,
                "item_h2_h3_description1_html": item_h2_description_html,
                "item_h2_h3_custom_img_name_light-mode": item_h2_custom_img_name,
                "item_h2_h3_img_link1_light-mode": item_h2_img_link,
                "item_h2_h3_img_link2_light-mode": item_h2_img_link,
                "item_h2_h3_img_link_dark-mode": ""
            })

# Save results to Excel
df = pd.DataFrame(data_rows)
df.to_excel(excel_file, index=False)
print(f"\n✅ Done! Data saved to {excel_file}, images in '{img_folder}/'")
