FreeIPA WebUI development environment
=====================================

Start the container:

```
developer/dev-env.sh
```

Stop the container:

```
dev-env.sh -s
```

Build the container locally:

```
developer/dev-env.sh -b
```

To build the container you'll need to have Ansible installed on your system and the ansible-freeipa collection:

```
pip install ansible-core
ansible-galaxy collection install -r developer/requirements.yml
```

To run any command inside the container:

```
podman exec webui <command>
```

To run an interactive command in the container, for example `bash`:

```
podman exec -it webui bash
```

Using Chrome to access the webui:

```
podman unshare --rootless-netns google-chrome --no-sandbox
```

To use Firefox, you'll need a different profile. To ease access, a script is provided to access the webui using Firefox:

```
developer/open-firefox.sh
```

If you have any Firefox window open with a default (or your own) profile, you'll need a to run Firefox under a different profile to access the container's web server. You'll also ned to start Firefox using `podman unshare`. Something like

```
podman unshare --rootless-netns firefox -P "my-dev-profile" --new-window https://webui.ipa.test
```

The provided `developer/open-firefox.sh` script will create a Firefox profile named 'webui-profile', and try to copy the IPA CA certificate and trust it for this specific profile.It will also allow different profiles, and manage the profiles it created. Run the script with `-h` to check the avaiable options.



Limitations
-----------

- When rebuilding the image, close all brower windows accessing the WebUI to use the new certificate.
