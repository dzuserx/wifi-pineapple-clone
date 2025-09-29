Detailed User Journey Flow

-------------------  Phase 1: Interface Setup card  ---------------------------------
1. Select Interface
Interface Selection Menu
Create a Select tag with a List available wireless interfaces with interface details (driver, chipset, capabilities) : Create json mock data

2. Put Interface in Monitor or Managed Mode
Beside the Select tag with a List of interfaces, Create a Select tag with options: Monitor and Managed

3. Validation
Add a button at bottom left of the card, to return by sliding back to "Section 1: Preparation" card
Add a button at bottom right of the card, to save the configured setting above and continue to Target Discovery
-------------------  End Phase 1: Interface Setup  ------------------------------

-------------------  Phase 2: Target Discovery card ---------------------------------
4. Explore for targets
Display a list of networks: Create json mock data
├── Checkbox
├── # (item number)
├── BSSID (MAC address)
├── ESSID (Network name)
├── Channel
├── Signal strength
├── Encryption type (WEP/WPA/WPA2)
├── WPS status
└── Client count (Show * if client count > 0 else show 0)
Below the list create an input field to enter the item number of the target network for individual selection
Beside the input field, Create a button to save the selected target networks above and continue to Attack Methods selection
-------------------  End Phase 2: Target Discovery  ----------------------------

-------------------  Phase 3: Attack Methods card  ----------------------------------
5. DOS Attacks Menu
-------- Submenu to appear inthe next card to slide in ----------
5.1. Deauth Attack
5.2. Beacon Flood Attack
5.3. Auth DOS Attack
-------- End Submenu to appear inthe next card to slide in ----------

6. Handshake Tools Menu
-------- Submenu to appear inthe next card to slide in ----------
6.1. Capture WPA Handshake
6.2. Clean/Optimize Handshake
6.3. Verify Handshake
-------- End Submenu to appear inthe next card to slide in ----------

7. Offline WPA/WPA2 decrypt Menu
-------- Submenu to appear inthe next card to slide in ----------
7.1. Dictionary Attack
7.2. Bruteforce Attack
-------- End Submenu to appear inthe next card to slide in ----------

8. WPS Attacks Menu
-------- Submenu to appear inthe next card to slide in ----------
8.1. WPS PIN Attack
8.2. WPS Pixie Dust Attack
-------- End Submenu to appear inthe next card to slide in ----------

9. Evil Twin Attacks Menu
-------- Submenu to appear inthe next card to slide in ----------
9.1. Evil Twin AP Attack
9.2. Evil Twin AP Attack with sniffing
9.3. Evil Twin AP Attack with sniffing and sslstrip
-------- End Submenu to appear inthe next card to slide in ----------

10. WEP Attacks Menu
-------- Submenu to appear inthe next card to slide in ----------
10.1. WEP Fake Auth Attack
10.2. WEP Chop-Chop Attack
10.3. WEP Fragmentation Attack
-------- End Submenu to appear inthe next card to slide in ----------

-------------------  End Phase 3: Attack Methods  ----------------------------------

Advanced Features Flow
Persistence & Configuration card: Create json mock data
CONFIGURATION MENU
├── Language Selection
│   ├── English (default)
│   ├── Spanish
│   ├── French
│   ├── Multiple other languages
│   └── Return to Config Menu
├── Interface Preferences
│   ├── Default interface selection
│   ├── Monitor mode preferences
│   ├── Power settings
│   ├── Channel preferences
│   └── Return to Config Menu
├── Default Wordlists
│   ├── Select default wordlists
│   ├── Add custom wordlist paths
│   ├── Wordlist management
│   ├── Test wordlist validity
│   └── Return to Config Menu
├── Attack Presets
│   ├── Save current attack configuration
│   ├── Load saved presets
│   ├── Manage preset library
│   ├── Export/import presets
│   └── Return to Config Menu
├── Save Current Settings
│   ├── Save all current preferences
│   ├── Auto-save option
│   ├── Settings backup
│   └── Return to Config Menu
└── Reset to Defaults
    ├── Reset all settings
    ├── Confirm reset action
    ├── Restore defaults
    └── Return to Config Menu

Logging & Reporting card: Create json mock data
LOGGING MENU
├── Enable/Disable Logging
│   ├── Toggle logging system
│   ├── Set log file location
│   ├── Log rotation settings
│   └── Return to Logging Menu
├── View Attack Logs
│   ├── Browse log files
│   ├── Real-time log viewing
│   ├── Log filtering and search
│   ├── Clear current log view
│   └── Return to Logging Menu
├── Export Results
│   ├── Export to text format
│   ├── Export to CSV
│   ├── Export to HTML report
│   ├── Custom export options
│   └── Return to Logging Menu
├── Clear Logs
│   ├── Clear current session logs
│   ├── Clear all historical logs
│   ├── Confirm deletion
│   └── Return to Logging Menu
└── Set Log Level
    ├── Debug (most verbose)
    ├── Info (standard)
    ├── Warning (important only)
    ├── Error (errors only)
    └── Return to Logging Menu

Utility Functions card: Create json mock data
UTILITIES MENU
├── Update Airgeddon
│   ├── Check for updates
│   ├── Automatic update
│   ├── Manual update
│   ├── Update verification
├── Check Dependencies
│   ├── Verify required tools
│   ├── Install missing dependencies
│   ├── Update existing tools
│   ├── Dependency status report
├── System Information
│   ├── Hardware information
│   ├── Network interface details
│   ├── System resource usage
│   ├── Wireless capabilities
├── Clean Temporary Files
│   ├── Scan for temporary files
│   ├── Select files to clean
│   ├── Secure deletion options
└── About Airgeddon
    ├── Version information
    ├── Author credits
    ├── License information
    ├── Support information
    └── Return to Utilities Menu