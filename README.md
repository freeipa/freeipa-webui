[![Gating tests](https://github.com/freeipa/freeipa-webui/actions/workflows/gating.yml/badge.svg)](https://github.com/freeipa/freeipa-webui/actions/workflows/gating.yml)

# FreeIPA Web UI

New version of the web application for administration of FreeIPA built using [React](https://reactjs.org/) and [PatternFly](https://www.patternfly.org/).

You can read more about the plans [here](https://github.com/freeipa/freeipa-webui/discussions/34).

## Mock-ups

**Note**: these mockups are for general direction we're taking the Web UI. Some finer details and interactions will be worked out as we develop the application.

![Mockup of the Vertical navigation](doc/mockup-navigation.png)
![Mockup of the Delete dialog](doc/mockup-delete.png)
![Mockup of how scrolling affects tables](doc/mockup-scrolling.png)
![Mockup of a user settings pages](doc/mockup-settings.png)

## Development environment

This project relies on containers to set up a development environment with FreeIPA installed and configured. The development environment is based on testing scenarios and only one scenario can be run at a time. More information on the development scenarios can be found in the [developer/README.md](developer/README.md) file.

1. Clone this repository

```
git clone https://github.com/freeipa/freeipa-webui
cd freeipa-webui
```

2. Install the requirements

These instructions assume that [`podman`](https://podman.io) is available on the system. Installation of `podman` is not in the scope of this document, but the alternative method with a Python virtual environment can be used:

```
python3 -m venv /tmp/webui
. /tmp/webui/bin/activate
pip install podman
```

If you want to use any non-default scenario, or you want to rebuild a modified version of the default scenario, you'll also need [`podman-compose`](https://github.com/containers/podman-compose) and [Ansible](https://ansible.com). You'll also need the ansible-freeipa and podman Ansible collections. Assuming the virtual environment is being used:

```
pip install ansible-core podman-compose
ansible-galaxy collection install -r developer/requirements.yml
```

3. Start the default scenario

```
./developer/dev-env.sh
```

To run a different scenario, you need to build it first, and then start it:

```
./developer/dev-env.sh -B no-dns
./developer/dev-env.sh -s no-dns
```

You can list the available scenarios:

```
./developer/dev-env.sh -l
```

> Note: once a scenario is built, the images are kept in the localhost registry, and the scenario can be started again, without building again.

4. Add the default scenario container IP addresses to `/etc/hosts`

```
sudo tee -a /etc/hosts < developer/scenarios/single-server/hosts
```

> Note: You must add the specific `hosts` file for the scenario (the example uses the scenario `single-server`). Each scenario uses a different CIDR, and some may have different hostnames for the webui. Cleaning up old entries is a good practice.

5. Prepare the webui to execute:

```
podman exec webui npm install
```

6. Starting the webui

To start the webui development server (and watch the project for changes), run:

```
./developer/dev-env.sh -d
```

or directly through `podman` with:

```
podman exec -it webui npm run dev
```

> Note that changes to the project can be made outside of the container that they will be notified to the development server running in the container, if using Linux. There's currently a limitation in macOS and Windows that may prevent the development webserver to be notified of file changes. This limitation currently affects all container environments (podman, docker and Apple's container).

Instead of the development server, you can build the project for production using either

```
./developer/dev-env.sh -p
```

or directly on the host with:

```
npm run build
```

7. Accessing the webui

As the containers are executing as rootless containers, in its own network namespace, it is needed to use `podman unshare --rootless-netns` to start a browser that is able to access the container network. It is also necessary to use a separate profile. Also the IPA CA certificate is not trusted by the host, so an exception need to be granted.

To ease the process a script is provided:

```
./developer/open-browser.sh https://webui.ipa.test/ipa/modern-ui
```

The script will create a new profile (`webui-profile`), if needed, trust the IPA CA certificate, and open the webui in a new browser window.
Both Mozilla's Firefox and Google's Chrome are supported.

When using browsers deployed via Flatpak, some additional settings may be required. Currently, only Firefox is supported as Flatpak.

It may happen the the keyboard does not work when running the browser with permission to access the container's network. This will mostly happen with browsers deployed with Flatpak. A workaround is provided for this issue by using the `open-browser.sh` option`-w`. The workaround requires `sudo`.

The default credentials for the development environment are **admin** and **Secret123**.

## Development pre-checks

We use handful of tools to help us with code quality, all of these tools are being run on the pipeline, you can and should run them locally as well.

### Eslint

We use [eslint](https://eslint.org) to check for linting errors.
To run eslint, execute the following command:

```bash
$ npm run lint
```

To fix eslint errors, execute the following command:

```bash
$ npm run lint:fix
```

Not all of these can be fixed automatically, you should fix errors manually as well.

### Prettier

We use [prettier](https://prettier.io) to check for formatting errors.
Prettier is integrated to eslint, so if the changes only concern TypeScript, running eslint is usually enough.

To run prettier, execute the following command:

```bash
$ npm run prettier
```

To fix prettier errors, execute the following command:

```bash
$ npm run prettier:fix
```

### Knip

We use [knip](https://knip.dev) to check for unused imports, exports and dead code.
To run knip, execute the following command:

```bash
$ npm run knip
```

These errors should be fixed manually.

## Testing

### Integration tests

Integration testing uses [Cypress](https://www.cypress.io) library, which runs [Gherkin-defined](https://cucumber.io/docs/gherkin) steps.

#### Launching the existing tests

> [!WARNING]
> Never run integration tests on a production server. Clean-up step would delete all existing entries, e.g. users.

This instructions assume you are running the integration tests against the development container.

> Note: The integration tests, currently, do not cleanup the test environment, it is recommended that you restart the container (`developer/dev-env.sh -r`) before running the integration tests.

Run the integration tests in headless mode with:

```
./developer/dev-env.sh -c
```

You can provide arguments to Cypress using the _long options_. For example, you can run only the hosts tests with:

```
./developer/dev-env.sh -c --spec cypress/e2e/hosts/hosts.feature
```

If you want to open the graphical debugger use:

```
./developer/dev-env.sh -C
```

Once the graphical debugger opens, select the desired feature file you want to execute.

#### Adding new integration tests

The integration tests use the **.feature** suffix and can be found in the _tests_ subfolder, together with the steps describing each feature.

### Unit tests

Unit tests use [vitest](https://vitest.dev).

#### Launching the existing tests

The existing tests can be launched by executing

```
podman exec webui npm test
```

You can also run the unit tests on your host machine with:

```
npm test
```

> For ensuring proper package versions, we suggest running unit tests inside of the container.

#### Adding new tests

The unit tests live, where the component that is being tested lives, the name should be the same, only with the **.test.tsx** suffix instead.

If you require FreeIPA to be running, please use integration tests instead.

## License

FreeIPA Web UI is licensed under the [GPLv3+](./COPYING) as
[FreeIPA](https://github.com/freeipa/freeipa).
