# WiFi Pineapple Frontend

A fully functional web frontend for WiFi Pineapple penetration testing platform.

## Features

- Responsive design
- Light/Dark theme support
- Modular architecture
- Mock API integration
- Professional UI matching Hak5 design

## Folder structure

```
wifi-pineapple-frontend/
├── airgeddon-menu-structure.md
├── airgeddon-menu-structure2.txt
├── attack-flows.md
├── index.html
├── login.html
├── README.md
├── terminal.html
├── TODO_v1.md
├── TODO_v2.md
├── api/
│   └── mock/
│       ├── campaigns.json
│       ├── cloud-c2.json
│       ├── dashboard.json
│       ├── help.json
│       ├── modules.json
│       ├── networking.json
│       ├── notifications.json
│       ├── pineap.json
│       ├── recon.json
│       ├── reporting.json
│       └── settings.json
├── css/
│   ├── bootstrap.min.css
│   ├── cdnjs_cloudflare_all.min.css
│   ├── font-awesome.min.css
│   ├── pineapple.css
│   └── themes/
│       ├── dark.css
│       └── light.css
├── dev/
│   └── bugs/
│       ├── frontend_final_load.PNG
│       ├── frontend_initial_load.PNG
│       └── good_navigation_tabs.txt
├── img/
│   ├── icons/
│   │   ├── dashboard.png
│   │   ├── help.png
│   │   ├── modules.png
│   │   ├── networking.png
│   │   ├── pineap.png
│   │   ├── recon.png
│   │   └── reporting.png
│   ├── logos/
│   │   ├── hak5-logo.png
│   │   ├── pineapple-logo.png
│   │   └── pineapple-logo2.png
│   └── ui-screenshots/
│       ├── dark-mode/
│       └── light-mode/
├── js/
│   ├── bootstrap.min.js
│   ├── jquery.min.js
│   ├── pineapple.js
│   ├── vue.min.js
│   ├── modules/
│   │   ├── campaigns.js
│   │   ├── cloud-c2.js
│   │   ├── dashboard.js
│   │   ├── help.js
│   │   ├── modules.js
│   │   ├── networking.js
│   │   ├── notifications.js
│   │   ├── pineap.js
│   │   ├── recon.js
│   │   ├── reporting.js
│   │   ├── settings.js
│   │   └── submodules/
│   │       ├── airgeddon.js
│   │       ├── dns-spoof.js
│   │       ├── evil-portal.js
│   │       ├── network-scanner.js
│   │       ├── packet-analyzer.js
│   │       └── url-sniffer.js
│   └── utils/
│       ├── api.js
│       ├── helpers.js
│       └── theme.js
├── modules/
│   ├── campaigns/
│   │   └── campaigns.html
│   ├── cloud-c2/
│   │   └── cloud-c2.html
│   ├── dashboard/
│   │   └── dashboard.html
│   ├── evilportal/
│   │   └── evilportal.html
│   ├── help/
│   │   └── help.html
│   ├── modules/
│   │   ├── modules.html
│   │   └── submodules/
│   │       ├── airgeddon.html
│   │       ├── dns-spoof.html
│   │       ├── evil-portal.html
│   │       └── url-sniffer.html
│   ├── networking/
│   │   └── networking.html
│   ├── notifications/
│   │   └── notifications.html
│   ├── pineap/
│   │   └── pineap.html
│   ├── recon/
│   │   └── recon.html
│   ├── reporting/
│   │   └── reporting.html
│   └── settings/
│       └── settings.html
└── wifi-pineapple-clone/
    ├── .gitattributes
    └── README.md
```

## Installation

1. Extract all files to a web server directory
2. Serve via web server:
   cd E:\PC_X\Documents\Codes\python_env
   venv\Scripts\activate
   cd E:\PC_X\Documents\Codes\Hacks\wifi-pineapple-cloner-frontend\template_deepseek\wifi-pineapple-frontend

   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server -p 8000

3. Open http://localhost:8000 in your browser

## Config

1. GIT
  git config --global user.email "dz_userx@proton.me"
  git config --global user.name "dz_userx"