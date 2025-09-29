Detailed User Journey Flow

-------------------  Phase 1: Interface Setup  ---------------------------------
1. Select Interface
Interface Selection Menu
├── Auto-detection of available wireless interfaces
├── Display interface details (driver, chipset, capabilities)
├── Manual interface selection from list
├── Interface validation and capability check
├── Support for multiple interface selection
└── Return to Main Menu
2. Put Interface in Monitor Mode
Monitor Mode Activation
├── Check current interface mode
├── Stop conflicting network services
├── Enable monitor mode using airmon-ng
├── Verify monitor mode activation
├── Set monitor mode interface name
├── Optional channel setting
├── Monitor mode status confirmation
└── Error handling for failed activation
3. Put Interface in Managed Mode
Managed Mode Restoration
├── Stop monitor mode processes
├── Restore managed mode using airmon-ng
├── Reset interface to default state
├── Restart network services
├── Network connectivity verification
├── Interface status confirmation
└── Cleanup temporary files
-------------------  End Phase 1: Interface Setup  ------------------------------

-------------------  Phase 2: Target Discovery  ---------------------------------
4. Explore for targets
4.1. Passive Exploration
Passive Network Discovery
├── Start airodump-ng scan on selected interface
├── Real-time target network display
├── Filter networks by ESSID/BSSID
├── Display network details:
│   ├── BSSID (MAC address)
│   ├── ESSID (Network name)
│   ├── Channel
│   ├── Signal strength
│   ├── Encryption type (WEP/WPA/WPA2)
│   ├── WPS status
│   └── Client count
├── Save scan results to file
├── Export to different formats
├── Continuous monitoring option
└── Return to Exploration Menu
4.2. Active Exploration
Active Network Discovery
├── Send probe requests to discover hidden networks
├── Client association and disassociation tracking
├── Targeted network probing
├── Active client detection
├── Network mapping and topology
├── Save active scan results
├── Compare with passive results
└── Return to Exploration Menu
4.3. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu
-------------------  End Phase 2: Target Discovery  ----------------------------

-------------------  Phase 3: Attack Methods  ----------------------------------
5. DOS Attacks Menu
5.1. Deauth Attack
Deauthentication Attack
├── Select target network from scan results
├── Choose specific client or broadcast
├── Set attack duration (continuous/timed)
├── Configure number of deauth packets
├── Set packet interval
├── Execute deauthentication attack
├── Real-time attack monitoring
├── Client disconnection verification
├── Stop attack manually
└── Return to DOS Menu
5.2. Beacon Flood Attack
Beacon Flood Attack
├── Set number of fake access points
├── Configure SSID list (random/predefined)
├── Set transmission rate and power
├── Choose channels (single/multiple/all)
├── Start beacon flood attack
├── Monitor fake AP creation
├── Network scanner confusion
├── Stop attack
└── Return to DOS Menu
5.3. Auth DOS Attack
Authentication DOS Attack
├── Target specific access point
├── Authentication request flood
├── Association request flood
├── Set attack intensity
├── Monitor AP response
├── Check attack effectiveness
├── Stop attack
└── Return to DOS Menu
5.4. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu

6. Handshake Tools Menu
6.1. Capture Handshake
WPA Handshake Capture
├── Select target network from scan results
├── Start handshake monitoring
├── Deauth clients to force handshake
├── Real-time handshake detection
├── Automatic handshake saving
├── Multiple handshake capture
├── Stop capture process
├── Handshake file management
└── Return to Handshake Menu
6.2. Clean/Optimize Handshake
Handshake Processing
├── Load captured handshake file
├── Remove duplicate packets
├── Optimize capture file size
├── Verify file integrity
├── Convert between formats
├── Export cleaned handshake
├── Batch processing option
└── Return to Handshake Menu
6.3. Verify Handshake
Handshake Validation
├── Load handshake file for verification
├── Validate WPA 4-way handshake completeness
├── Check for EAPOL packets
├── Verify handshake authenticity
├── Detailed validation report
├── Multiple file verification
└── Return to Handshake Menu
6.4. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu

7. Offline WPA/WPA2 decrypt Menu
7.1. Dictionary Attack
Dictionary-based Password Cracking
├── Select handshake file
├── Choose wordlist (built-in/custom)
├── Configure attack rules:
│   ├── Word mangling rules
│   ├── Character substitution
│   ├── Case variations
│   └── Pattern matching
├── Set performance options
├── Execute dictionary attack
├── Real-time progress monitoring
├── Password recovery notification
├── Save results
└── Return to Decrypt Menu
7.2. Bruteforce Attack
Bruteforce Password Cracking
├── Select handshake file
├── Define character set:
│   ├── Lowercase letters
│   ├── Uppercase letters
│   ├── Numbers
│   ├── Special characters
│   └── Custom character set
├── Set password length range
├── Configure mask attacks
├── Set performance optimization
├── Start bruteforce process
├── Progress tracking
├── Estimated time calculation
├── Stop/resume capability
└── Return to Decrypt Menu
7.3. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu

8. WPS Attacks Menu
8.1. WPS PIN Attack
WPS PIN Brute Force
├── Scan for WPS-enabled access points
├── Select target WPS network
├── PIN brute force attack using Reaver
├── Real-time PIN attempt tracking
├── WPS lockout detection
├── PIN recovery progress
├── WPA key extraction on success
├── Save recovered credentials
└── Return to WPS Menu
8.2. WPS Pixie Dust Attack
Pixie Dust Attack
├── Scan for Pixie Dust vulnerable APs
├── Check WPS vulnerability status
├── Offline PIN calculation using pixiewps
├── Instant WPS PIN recovery
├── WPA key extraction
├── Bypass WPS lockouts
├── Save attack results
└── Return to WPS Menu
8.3. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu

9. Evil Twin Attacks Menu
9.1. Evil Twin AP Attack
Basic Evil Twin Attack
├── Select target network to clone
├── Configure rogue AP settings:
│   ├── SSID (same as target)
│   ├── Channel matching
│   ├── MAC address spoofing
│   └── Power settings
├── Set up DHCP server
├── Start rogue access point
├── Deauth legitimate AP clients
├── Capture client connections
├── Monitor connected clients
├── Stop attack and cleanup
└── Return to Evil Twin Menu
9.2. Evil Twin AP Attack with sniffing
Evil Twin with Traffic Sniffing
├── All basic Evil Twin features
├── Enable traffic capture and sniffing
├── Capture unencrypted data:
│   ├── HTTP traffic
│   ├── FTP credentials
│   ├── Email data
│   └── Other plaintext protocols
├── Real-time packet analysis
├── Save captured data
├── Data filtering and search
└── Return to Evil Twin Menu
9.3. Evil Twin AP Attack with sniffing and sslstrip
Advanced Evil Twin with SSL Stripping
├── All Evil Twin with sniffing features
├── Enable SSL stripping for HTTPS
├── Downgrade HTTPS to HTTP
├── Capture SSL-encrypted credentials:
│   ├── Webmail logins
│   ├── Social media credentials
│   ├── Banking information
│   └── Other secure logins
├── Session hijacking capability
├── Real-time credential capture
├── Save stolen credentials
└── Return to Evil Twin Menu
9.4. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu

10. WEP Attacks Menu
10.1. WEP Fake Auth Attack
WEP Fake Authentication Attack
├── Select WEP-enabled target network
├── Fake authentication with access point
├── Generate and inject ARP requests
├── Capture initialization vectors (IVs)
├── IV collection monitoring
├── Automatic WEP key cracking
├── Key recovery notification
├── Save recovered WEP key
└── Return to WEP Menu
10.2. WEP Chop-Chop Attack
WEP Chop-Chop Attack
├── Select WEP target network
├── Packet fragmentation technique
├── Keystream recovery process
├── PRGA (Pseudo Random Generation Algorithm) extraction
├── WEP key calculation
├── Automated attack process
├── Key recovery
├── Save results
└── Return to WEP Menu
10.3. WEP Fragmentation Attack
WEP Fragmentation Attack
├── Select WEP target network
├── ARP packet injection
├── Optimized IV collection
├── Faster key recovery method
├── Automated cracking process
├── Real-time progress monitoring
├── WEP key recovery
├── Save cracked key
└── Return to WEP Menu
10.4. Return to Main Menu
Navigation
└── Return to Airgeddon Main Menu
-------------------  End Phase 3: Attack Methods  ----------------------------------

Advanced Features Flow
Persistence & Configuration
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

Logging & Reporting
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

Utility Functions
UTILITIES MENU
├── Update Airgeddon
│   ├── Check for updates
│   ├── Automatic update
│   ├── Manual update
│   ├── Update verification
│   └── Return to Utilities Menu
├── Check Dependencies
│   ├── Verify required tools
│   ├── Install missing dependencies
│   ├── Update existing tools
│   ├── Dependency status report
│   └── Return to Utilities Menu
├── System Information
│   ├── Hardware information
│   ├── Network interface details
│   ├── System resource usage
│   ├── Wireless capabilities
│   └── Return to Utilities Menu
├── Clean Temporary Files
│   ├── Scan for temporary files
│   ├── Select files to clean
│   ├── Secure deletion options
│   ├── Cleanup confirmation
│   └── Return to Utilities Menu
└── About Airgeddon
    ├── Version information
    ├── Author credits
    ├── License information
    ├── Support information
    └── Return to Utilities Menu