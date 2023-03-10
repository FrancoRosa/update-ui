# Update ui

> UI to upload files and run commands from a password protected zip file to provide patchs or updates

- [Update ui](#update-ui)
  - [Deploy instructions](#deploy-instructions)
  - [How to use it](#how-to-use-it)
  - [Raspberry setup as hotspot](#raspberry-setup-as-hotspot)
    - [Step 1 - Install requirements](#step-1---install-requirements)
    - [Step 2 - Hostapd Configuration](#step-2---hostapd-configuration)
    - [Step 3 - Dnsmasq Configuration](#step-3---dnsmasq-configuration)
    - [Step 4 - DHCP Configuration](#step-4---dhcp-configuration)
    - [Cleaning up - Disabling the hotspot](#cleaning-up---disabling-the-hotspot)

## Deploy instructions

To run this application `nodejs` must be installed, then the main script `main.js` can be run. It will create a server running on port 8000

## How to use it

Create a folder containing any kind of files (txt, png ..) and include a `info.json` file. The json file should contain the update version name, Example:

```json
{
  "update": "2023-02-18 - Mark",
  "instructions": [
    {
      "type": "file",
      "name": "readme.md",
      "dir": "/home/pi"
    },
    {
      "type": "command",
      "name": "sleep 2"
    }
    {
      "type": "command",
      "name": "ls"
    }
  ]
}
```

Please note that instructions has two types, file and command, the script will execute the operations one by one

Then zip the folder, it must be password protected to avoid someone else creating their fake updates, the password can be customized and saved in `password` on this repo.

## Raspberry setup as hotspot

The following instructions were inspired from this source https://www.raspberryconnect.com/projects/65-raspberrypi-hotspot-accesspoints/168-raspberry-pi-hotspot-access-point-dhcpcd-method.

### Step 1 - Install requirements

Install requirements

```bash
sudo apt update
sudo apt upgrade
sudo apt install hostapd
sudo apt install dnsmasq
```

Stop the services to make the configurations required

```bash
sudo systemctl stop hostapd
sudo systemctl stop dnsmasq
```

### Step 2 - Hostapd Configuration

Create the configuration file

```bash
sudo nano /etc/hostapd/hostapd.conf
```

then copy the following:

```bash
interface=wlan0
driver=nl80211
ssid=RPiHotSpot
hw_mode=g
channel=6
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=1234567890
wpa_key_mgmt=WPA-PSK
rsn_pairwise=CCM
```

Finally set the configuration files with the following code:

```bash
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
```

### Step 3 - Dnsmasq Configuration

Open the configuration file

```bash
sudo nano /etc/dnsmasq.conf
```

Go to the end of the file and add the following

```bash
#RPiHotspot config - No Intenet
interface=wlan0
domain-needed
bogus-priv
dhcp-range=192.168.50.150,192.168.50.200,255.255.255.0,12h
```

### Step 4 - DHCP Configuration

Open the configuration file

```bash
sudo nano /etc/dhcpcd.conf
```

At the end of the file add the folowing lines

```bash
#Static Hotspot
interface wlan0
nohook wpa_supplicant
static ip_address=192.168.50.10/24
static routers=192.168.50.1
```

### Cleaning up - Disabling the hotspot

```bash
sudo systemctl disable dnsmasq

sudo systemctl disable hostapd
```

Then remove the lines added on `/etc/dhcpcd.conf`

```bash
#Static Hotspot
interface wlan0
nohook wpa_supplicant
static ip_address=192.168.50.10/24
static routers=192.168.50.1
```
