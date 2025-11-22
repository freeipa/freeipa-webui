# Scenario: server-addc

This scenario is meant to test IPA integration with Active Directory,
through trusts.

This scenario provides two hosts:

- webui:
  - An IPA server deployed
  - DNS and Trust enabled
  - There's no KRA for faster deployment
  - IP address is 192.168.57.10
  - Hostname is webui.linux.ipa.test
- Samba AD DC:
  - A Samba AD DC deployed, with forwarders to 'webui'
  - IP address is 192.168.57.250
  - Hostname is dc.ad.ipa.test
  - Administrator user is 'Administrator'
  - Regular users 'jdoe' and 'anne' are configured.
  - All passwords are 'Secret123'

To set up a trust between Samba AD DC and IPA run:

```
podman exec -it webui bash
kinit admin <<< Secret123
ipa dnsforwardzone-add ad.ipa.test --forwarder 192.168.57.250
ipa trust-add ad.ipa.test --admin Administrator --two-way True <<< Secret123
```

> **NOTE**: To use the development server (Vite) edit the file
> `vite.config.ts` in the repository root and change 'server: cors: origin'
> attribute to `https://webui.linux.ipa.test`.
