[![Gating tests](https://github.com/freeipa/freeipa-webui/actions/workflows/gating.yml/badge.svg)](https://github.com/freeipa/freeipa-webui/actions/workflows/gating.yml)

# FreeIPA Web UI

New version of the web application for administration of FreeIPA built using
[React](https://reactjs.org/) and [PatternFly 4](https://www.patternfly.org/v4/).

## Development environment

This project relies on Vagrant to set-up a virtual machine with FreeIPA installed
and configured.

1. Install requirements

> Although these instructions target Fedora as host, any OS with Vagrant can be used,
> `sshfs` and `libvirt` are the preffered options, if you plan to use a different distro,
> please update `Vagrantfile` accordingly.

```bash
$ sudo dnf install vagrant vagrant-libvirt vagrant-sshfs
```

2. Clone this repository

3. Start and provision the guest virtual machine: `vagrant up`

4. Add guest machine's IP address to your `/etc/hosts` pointing to its hostname, e.g:

```
192.168.122.5 server.ipa.demo
```

At this point you can access your live instance at `https://server.ipa.demo/ipa/ui/`.
However, you still need to configure your front-end environment, it's up to you to choose
between your host or guest machine.

> If you decide to use your guest machine, just ssh into it, go to the synced folder:
>
> ```
> $ vagrant ssh
> $ cd /usr/src/freeipa-webui/
> ```

Now you can install the project's dependencies:

```
$ npm install
```

To build (and watch the project for changes), run:

```
$ npm run watch
```

Now your dev environment is ready, you can do changes and see them at:
`https://server.ipa.demo/ipa/modern_ui/`

### Considerations

- Live reload is currently not available.

## Testing

TBD

- [audit-ci](https://github.com/IBM/audit-ci)

## License

FreeIPA Web UI is licensed under the [GPLv3+](./COPYING) as
[FreeIPA](https://github.com/freeipa/freeipa).
