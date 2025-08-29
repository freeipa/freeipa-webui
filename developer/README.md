# FreeIPA WebUI development environment

Run the container:

```
developer/dev-env.sh
```

Run the container, rebuilding the container image:

```
developer/dev-env.sh -b
```

> NOTE: To build the container you'll need to have Ansible installed on your system and the ansible-freeipa collection (you can use Python's virtual environments):

```
pip install ansible-core
ansible-galaxy collection install -r developer/requirements.yml
```

Kill the container:

```
developer/dev-env.sh -k
```

> NOTE: Data in the container is not persisted, any change will be lost.

Build the container image locally:

```
developer/dev-env.sh -B
```

Start the development server:

```
developer/dev-env.sh -d
```

Build the pages for production:

```
developer/dev-env.sh -p
```

Run Cypress integration tests:

```
developer/dev-env.sh -c
```

Run Cypress integration tests through graphical debugger:

```
developer/dev-env.sh -C
```

## Using the container

To run any command inside the container:

```
podman exec webui <command>
```

To run an interactive command in the container, for example `bash`:

```
podman exec -it webui bash
```

## Using a browser to access the webui

As the IPA deployment runs in a rootless container with the network in its own namespace, it is necessary to use `podman share` to be able to reach the network.

Using Chrome to access the webui:

```
podman unshare --rootless-netns google-chrome --no-sandbox
```

To use Firefox, you'll need a different profile. To ease access, a script is provided to access the webui using Firefox:

```
developer/open-firefox.sh https://webui.ipa.test/ipa/modern-ui
```

If you have any Firefox window open with a default (or your own) profile, you'll need a to run Firefox under a different profile to access the container's web server. You'll also ned to start Firefox using `podman unshare`. Something like

```
podman unshare --rootless-netns firefox -P "my-dev-profile" --new-window https://webui.ipa.test/ipa/modern-ui
```

The provided `developer/open-firefox.sh` script will create a Firefox profile named 'webui-profile', and try to copy the IPA CA certificate and trust it for this specific profile.It will also allow different profiles, and manage the profiles it created. Run the script with `-h` to check the avaiable options.

## Limitations

- When rebuilding the image, close all brower windows accessing the WebUI to use the new IPA certificate.
