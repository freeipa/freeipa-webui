# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.hostname = "server.ipa.demo"
  config.vm.box = "fedora/39-cloud-base"

  config.vm.synced_folder ".", "/vagrant", disabled: true
  config.vm.synced_folder ".", "/usr/src/freeipa-webui"

  # Needed by Cypress - optional if you edit your /etc/hosts
  config.vm.network "forwarded_port", guest: 443, host: 443

  config.vm.provider "libvirt" do |v,override|
    v.memory = 4096
    v.cpus = 1
    override.vm.synced_folder ".", "/usr/src/freeipa-webui", type: "sshfs"
  end

  # Virtualbox is used by the CI
  config.vm.provider "virtualbox" do |vb|
    vb.memory = 2048
  end

  # Install system dependencies
  config.vm.provision "shell",
    inline: "dnf install neovim freeipa-server freeipa-server-dns haveged tmux nodejs -y"

  # Enable entropy daemon
  config.vm.provision "shell",
    inline: "systemctl enable --now haveged"

  # Add eth0 ip address to /etc/hosts
  config.vm.provision "shell",
    inline: "echo \"$(hostname -I) server.ipa.demo\" | tee -a /etc/hosts"

  # Install ipa server
  config.vm.provision "shell",
    inline: "ipa-server-install -U -n dom-server.ipa.demo -r DOM-IPA.DEMO -p Secret123 -a Secret123 --forwarder 8.8.8.8 --setup-dns --setup-kra"

  # Set SELinux to permissive mode
  config.vm.provision "shell", inline: <<~EOS
    set -e
    setenforce 0
    sed -i 's/SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
  EOS

  # Serve freeipa-webui via Apache
  config.vm.provision "shell", inline: <<~EOS
    set -e
    cat >> /etc/httpd/conf.d/ipa.conf <<EOF

    Alias /ipa/modern_ui "/usr/src/freeipa-webui/dist"
    <Directory "/usr/src/freeipa-webui/dist">
      SetHandler None
      AllowOverride None
      Satisfy Any
      Require all granted
      RewriteEngine On
      RewriteRule ^(.*)/js/(.*)\\\\.(js|map)$ js/\\$2.\\$3 [L]
      RewriteRule ^(.*)/public/images/(.*)$ public/images/\\$2 [L]
      RewriteRule ^(.*)/(.*)\\\\.(css|ico|woff2)$ \\$2.\\$3 [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteRule ^ index.html [QSA,L]
    </Directory>
    EOF

    systemctl restart httpd
  EOS

  # Print instructions
  config.vm.provision "shell",
    inline: "echo \"Please append the line below to the /etc/hosts file on your machine:\n$(hostname -I|sed 's/10\.0\.2\.15//') server.ipa.demo\""
end
