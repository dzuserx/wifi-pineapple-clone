import os

# Base path where to create the structure
BASE = r"E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\template_deepseek"
ROOT = os.path.join(BASE, "wifi-pineapple-frontend")

# File structure definition
structure = {
    "": ["index.html", "README.md"],
    "css": ["bootstrap.min.css", "font-awesome.min.css", "pineapple.css"],
    "css/themes": ["light.css", "dark.css"],
    "js": ["jquery.min.js", "bootstrap.min.js", "vue.min.js", "pineapple.js"],
    "js/modules": [
        "dashboard.js", "recon.js", "pineap.js", "networking.js",
        "modules.js", "reporting.js", "help.js"
    ],
    "js/utils": ["api.js", "theme.js", "helpers.js"],
    "img/logos": ["hak5-logo.png", "pineapple-logo.png"],
    "img/icons": [
        "dashboard.png", "recon.png", "pineap.png", "networking.png",
        "modules.png", "reporting.png", "help.png"
    ],
    "img/ui-screenshots/light-mode": [],
    "img/ui-screenshots/dark-mode": [],
    "modules/dashboard": ["dashboard.html"],
    "modules/recon": ["recon.html"],
    "modules/pineap": ["pineap.html"],
    "modules/networking": ["networking.html"],
    "modules/modules": ["modules.html"],
    "modules/reporting": ["reporting.html"],
    "modules/help": ["help.html"],
    "api/mock": [
        "dashboard.json", "recon.json", "pineap.json", "networking.json",
        "modules.json", "reporting.json", "help.json"
    ]
}

def create_structure(base, struct):
    for folder, files in struct.items():
        dir_path = os.path.join(base, folder)
        os.makedirs(dir_path, exist_ok=True)
        for f in files:
            file_path = os.path.join(dir_path, f)
            # Create file only if not exists
            if not os.path.exists(file_path):
                with open(file_path, "w", encoding="utf-8") as fh:
                    # Put minimal placeholder text
                    if f.endswith(".html"):
                        fh.write(f"<!-- {f} placeholder -->\n")
                    elif f.endswith(".css"):
                        fh.write(f"/* {f} placeholder */\n")
                    elif f.endswith(".js"):
                        fh.write(f"// {f} placeholder\n")
                    elif f.endswith(".json"):
                        fh.write("{ }\n")
                    elif f.endswith(".md"):
                        fh.write("# WiFi Pineapple Frontend\n\nRepo instructions, Excel mapping.\n")
                    else:
                        # for png or others, just leave empty file
                        fh.write("")
                print(f"Created {file_path}")
            else:
                print(f"Exists {file_path}")

if __name__ == "__main__":
    create_structure(ROOT, structure)
    print("\n✅ Folder structure created at:", ROOT)
