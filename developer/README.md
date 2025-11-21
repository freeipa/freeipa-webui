# FreeIPA WebUI development environment

Run the default development scenario (single-server):

```
dev-env.sh -s
```

To run a specific scenario available locally (see `Building the development environments` below):

```
dev-env.sh -s <scenario>
```

Kill the currently running scenario:

```
dev-env.sh -k
```

> NOTE: Data in the container is not persisted, any change will be lost.

Start the development server:

```
dev-env.sh -d
```

Build the pages for production:

```
dev-env.sh -p
```

Run Cypress integration tests:

```
dev-env.sh -c
```

Run Cypress integration tests through graphical debugger:

```
dev-env.sh -C
```

## Building the development environments

To be able to build the development environments you'll need `ansible-playbook` and `podman-compose` installed on your system and the ansible-freeipa collection (you can use Python's virtual environments):

```
pip install ansible-core podman-compose
ansible-galaxy collection install -r developer/requirements.yml
```

Build the development environment:

```
dev-env.sh -B <scenario>
```

To build with a specific version of Fedora, use:

```
distro_tag=42 ./developer/dev-env.sh -B <scenario>
```

It is also possible to build scenarios using CentOS Stream:

```
distro=centos distro_tag=stream10 ./developer/dev-env.sh -B <scenario>
```

> Note: Currently, the development server does not work with CentOS Stream, so testing should be done by building the production code with `npm run build`, on the host.

## Using the 'webui' container

All scenarios provide a 'webui' container, which is the initial IPA server, and have a shared directory ("/webui") containing the project repository.

To run any command inside the container:

```
podman exec webui <command>
```

To run an interactive command in the container, for example `bash`:

```
podman exec -it webui bash
```

## Using a browser to access the webui

As the containers are executing as rootless containers, in its own network namespace, it is needed to use `podman unshare --rootless-netns` to start a browser that is able to access the container network. It is also necessary to use a separate profile. Also the IPA CA certificate is not trusted by the host, so an exception needs to be granted.

To ease the process a script is provided:

```
open-browser.sh https://webui.ipa.test/ipa/modern-ui
```

The script will create a new profile (`webui-profile`), if needed, trust the IPA CA certificate, and open the webui in a new browser window.
Both Mozilla's Firefox and Google's Chrome are supported.

> Note: Browsers deployed using Flatpak, may require additional settings. Google Chrome is not supported as Flatpak.

The default credentials for the development environment are **admin** and **Secret123**.

The provided `open-firefox.sh` script can be used to manage the profiles it created. Run the script with `-h` to check the available options.

## Limitations

- When rebuilding the image, close all browser windows accessing the WebUI to use the new IPA certificate.
- The webui will rewrite the URL to use the hostname, so you need to add the container IP address to `/etc/hosts`. Check the file `developer/hosts`.

## Troubleshooting

- If your browser keeps loading the page without displaying anything and giving no errors, you are probably opening the webui in a window that can't access the container network. Close the window/tab and use `open-browser.sh`.
