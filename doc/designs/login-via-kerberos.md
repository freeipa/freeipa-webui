# Authentication via Kerberos

## Introduction

The Kerberos authentication should be performed by taking the already-configured kerberos credentials (via `kinit`) and authenticate through the `/ipa/session/login_kerberos` endpoint.

## How to reproduce

It is assumed that no ticket is created, no browser has been opened yet, and there is a vagrant machine up and running containing the modern WebUI (see `README` file instructions).

[From local] Destroy all kerberos keys:

```
>> kdestroy -A
```

To be able to test the results in local, we need to modify the `resolved` file and add the IP of our already created vagrant VM. Add the following lines in the `/etc/systemd/resolved.conf` file:

```
[Resolve]
...
DNS=<ip-of-the-vagrant-vm>
```

Save the changes and restart the service.

```
>> sudo systemctl restart systemd-resolved.service
```

Create a ticket against admin + the webui realm

```
>> kinit admin@DOM-IPA.DEMO
```

You can check if the ticket was successfully create it by executing `klist -A`. Alternatively, you can also create the ticket while debugging by executing `KRB5_TRACE=/dev/stdout kinit admin@DOM-IPA.DEMO`.

These steps should be enough to test the authentication via Kerberos:

- Open a new tab on any browser (recommended: Firefox or Chrome)
- Navigate to the `/login` page
- Follow the instructions mentioned in the `Browser Kerberos setup` link (or `/ipa/config/ssbrowser.html`)([link from the FreeIPA demo](https://ipa.demo1.freeipa.org/ipa/config/ssbrowser.html)) for your specific browser
  - NOTE: No need to add any certificate, so you can skip those specific steps
- Close the browser and open it again to apply the changes (that includes ALL tabs from that browser)
- Go to the `/login` page and click the `Login` button (without entering any user + pwd). You should be authenticated now.

If this doesn't work, try the steps described in 'Plan B'.

## Plan B

This approach assumes that we want to configure the Kerberos authentication in a server with a different name (e.g., `<my-webui-local-instance>.ipa.demo`). This can be configured via the WebUI or CLI commands

### Option 1: WebUI

Create the zone for `dom-ipa.demo`

- Access the WebUI with our credentials
- Go to `Network services` > `DNS` > `DNS zones`
- Create a new zone called `dom-ipa.demo.` (the final `.` is important!)
- Access the settings page of the already-created zone
- Create new records (you can use the same values from e.g. `dom-server.ipa.demo` as a reference):
  - `_kerberos` (`TXT` and `URI` types)
  - `_kerberos._tcp` (if it doesn't exist)
- Save the changes
- At the end, it should look like something similar to this:
  ![image](https://github.com/user-attachments/assets/10c04be4-04a3-44a6-9b61-1da0884790fd)
  **Disclaimer:** The image show more values defined, but there might be not necessary in this case

### Option 2: CLI

Execute the following commands to generate the zone:

- Access vagrant machine: `vagrant ssh`
- Create a ticket: `kinit`
- Create DNS zone: `ipa dnszone_add mynewzone.ipa.demo.`
- Create the records:
  - `ipa dnsrecord_add somezone.ipa.demo. --uri-priority=0 --uri-weight=100 --uri-target=krb5srv:m:tcp:server.ipa.demo`
    - Record name: `_kerberos`
  - `ipa dnsrecord_add somezone.ipa.demo. --uri-priority=0 --uri-weight=100 --uri-target=krb5srv:m:udp:server.ipa.demo`
    - Record name: `_kerberos`
  - `ipa dnsrecord_add somezone.ipa.demo. --txt-data=DOM-IPA.DEMO`
    - Record name: `_kerberos`
  - `ipa dnsrecord_add somezone --srv-priority=0 --srv-weight=100 --srv-port=88 --srv-target=server.ipa.demo`
    - Record name: `_kerberos._tcp`
  - `ipa dnsrecord_add somezone --srv-priority=0 --srv-weight=100 --srv-port=88 --srv-target=server.ipa.demo`
    - Record name: `_kerberos._udp`

Modify the kerberos configuration file to be able to create tickets for the `DOM-IPA.DEMO` realm

- `sudo vim /etc/krb5.conf.d/ipa.demo`
- Add the following settings:

```
[libdefaults]
default_realm = DOM-IPA.DEMO

[realms]
DOM-IPA.DEMO = {
   default_domain = ipa.demo
}
```

- Save the changes

Check if there is a krb ticket and print the version numbers

```
>> kvno HTTP/server.ipa.demo
```

Open a Google chrome window while adding the `ipa.demo` server to the whitelist

- Be sure to close any chrome tab that could've been opened before executing this
- This will work for normal tabs (not incognito)

```
>> google-chrome --auth-server-whitelist="*.ipa.demo"
```

If there is a kerberos ticket, this should automatically log in to the WebUI
