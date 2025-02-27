# Running FreeIPA web UI tests in ipalab-config environment

The test environment is built with the help of
[podman](https://podman.io) and orchestrated with
[ipalab-config](https://github.com/rjeffman/ipalab-config) and
[podman-compose](https://github.com/containers/podman-compose) tools. FreeIPA
environment is deployed with the help of
[ansible-freeipa](https://github.com/freeipa/ansible-freeipa).

The environment can be prepared with the help of ansible playbook,
`local-test.yaml`. The playbook can be run as

```
$ ansible-playbook tests/ipalab/local-test.yaml
...
```

The playbook will create own Python virtual environment and install required
components there (`ipalab-config`, `podman-compose`, ansible modules, etc.).
It then will use a `podman-compose` tool to generate an environment for the
FreeIPA topology defined in `ipa.yaml.in`. The resulting environment will have
FreeIPA server installed with the help of `ansible-freeipa` and then FreeIPA
client enrolled into it. The server will have Modern UI pre-configured.
Finally, the client will be configured to run Cypress-based tests.

If low level manipulations of the environment are needed, one can switch to it
with

```
$ source tests/ipalab/_venv/bin/activate
$ cd tests/ipalab/_venv
```

`ipalab-config` generates podman compose data in `CONFIG_DIR` folder. If you
want to run `podman-compose` commands manually, make sure to change to that
folder first:

```
$ source tests/ipalab/_venv/bin/activate
$ cd tests/ipalab/_venv/CONFIG_DIR
$ podman-compose stats
```

## Running Cypress tests

In order to run Cypress tests, we use `playbooks/cypress-run.yaml` playbook:

```
$ ansible-playbook tests/ipalab/playbooks/cypress-run.yaml
...
```

The playbook itself will run commands within `client.ipa.demo` container
instance as root. Within the instance `/freeipa-webui` is configured as a
volume mounting top level of this project's checkout.

As Cypress runs, it will export screenshots to
`/freeipa-webui/cypress/screenshots`. Additionally, the output of cypress tool
run will be stored in `/freeipa-webui/cypress.log`.

## Shutting down the environment

In order to shut down the environment, one needs to run `podman-compose down`
in `tests/ipalab/_venv/CONFIG_DIR` folder.

```
$ source tests/ipalab/_venv/bin/activate
$ cd tests/ipalab/_venv/CONFIG_DIR
$ podman-compose down
$ deactivate
```
