import pandas as pd

# Input Excel file
excel_path = r"E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\scrapper\hak5_ui_overview_observation_v2.xlsx"
# Output HTML file
output_html = r"E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\scrapper\hak5_ui_overview_observation_v11.html"

# Load Excel into DataFrame
df = pd.read_excel(excel_path)

# Convert DataFrame to HTML table
html_table = df.to_html(index=False, escape=False, border=1)

# Save as standalone HTML file
with open(output_html, "w", encoding="utf-8") as f:
    f.write("<html><head><meta charset='UTF-8'><title>Excel to HTML Table</title></head><body> <style> body { background-color: #1a1a1a; /* dark blue */ color: white;  /* text color */ } </style>")
    f.write("<h2>Excel Data Export</h2>")
    f.write(html_table)
    f.write("</body></html>")

print(f"✅ HTML table saved to: {output_html}")
