# Airgeddon Attack Paths

## Initial Setup
1. Language Selection (13 languages)
2. Interface Selection
   - Wireless adapter check
   - Monitor mode capability check
3. System Checks
   - Dependencies verification
   - Tool availability check
   - Auto-update verification

## Main Attack Paths

### 1. Evil Twin Attacks
Sequential flow:
1. Without Internet
   - Target network selection
   - AP creation
   - Client deauthentication
   
2. With Internet
   - Interface selection
   - Internet connection sharing
   - AP configuration
   
3. Captive Portal
   - Portal setup
   - Credential harvesting
   - Client redirection
   
4. Advanced Options
   - SSL implementation
   - DNS spoofing
   - BeEF framework integration

### 2. DoS (Denial of Service)
Attack methods:
1. Deauthentication
   - Single client
   - All clients
   - Timed attack
   
2. Authentication flood
   - Multiple fake clients
   - AP overload
   
3. Beacon flood
   - Fake networks creation
   - Channel flooding

### 3. Handshake/PMKID Capture
Process flow:
1. Target Selection
2. Capture Methods:
   - Standard handshake
   - PMKID hash
3. Offline Cracking:
   - Dictionary attack
   - Brute force
   - Rule-based attack

### 4. WPS Attacks
Methods:
1. Pixie Dust
   - Automatic PIN calculation
   - Quick exploitation
   
2. PIN Attacks
   - Bruteforce
   - Known PINs
   - Null PIN
   - Custom PIN

### 5. WEP Attacks
Techniques:
1. All-in-One
   - Automatic method selection
   - Multiple vector attack
   
2. Specific Methods
   - ARP replay
   - Chop-Chop
   - Fragmentation
   - Caffe Latte
   - Hirte attack

### 6. Enterprise Attacks
Workflow:
1. Fake AP Creation
   - RADIUS server setup
   - Certificate generation
   
2. Hash Capture
   - Client authentication
   - Credential collection
   
3. Offline Cracking
   - Hash processing
   - Password recovery

### 7. WPA3 Attacks
Methods:
1. Online Attack
   - Protocol exploitation
   - Authentication bypass
   
2. DragonBlood
   - Downgrade attack
   - Key recovery

## Post-Attack Options
1. Cracking Tools Integration
   - Hashcat
   - John the Ripper
   - Aircrack-ng

2. Result Analysis
   - Captured credentials
   - Hash verification
   - Success validation

3. Clean-up Operations
   - Interface restoration
   - Network normalization
   - Log management

Each attack path includes:
- Pre-attack validation
- Real-time monitoring
- Error handling
- Attack status tracking
- Result verification
- Recovery options