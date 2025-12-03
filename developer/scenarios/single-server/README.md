# Scenario: single-server

This is the default webui testing scenario, with a single IPA server.

## Hosts

- webui:
  - Hostname: webui.ipa.test
  - IP address: 192.168.56.10
  - DNS, AD Trust and KRA.

## Notes

This scenario may be started without `podman-compose` with:

```
dev-env.sh -s
```
