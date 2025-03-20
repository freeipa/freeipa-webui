Name:           freeipa-webui
Version:        0.1.1
Release:        %autorelease
Summary:        Modern web application for administration of FreeIPA

License:        GPL-3.0-only
URL:            https://github.com/freeipa/%{name}.git
# See https://docs.fedoraproject.org/en-US/packaging-guidelines/SourceURL/#_troublesome_urls
Source0:        https://github.com/freeipa/%{name}/archive/refs/tags/v%{version}.tar.gz#/%{name}-%{version}.tar.gz
# Prepared with "nodejs-packaging-bundler %%{name} %%{version} %%{SOURCE0}"
Source1:        %{name}-%{version}-nm-prod.tgz
Source2:        %{name}-%{version}-nm-dev.tgz
Source3:        %{name}-%{version}-bundled-licenses.txt

BuildArch:      noarch
ExclusiveArch:  %{nodejs_arches} noarch

Requires:       freeipa-server
Requires:       nodejs

BuildRequires:  nodejs-devel
BuildRequires:  nodejs-npm

# Inspired by
# https://src.fedoraproject.org/rpms/nodejs-aw-webui/blob/rawhide/f/nodejs-aw-webui.spec
# https://src.fedoraproject.org/rpms/anaconda-webui/blob/rawhide/f/anaconda-webui.spec

%description
%{summary}.


%prep
%autosetup
# License
cp -p %{SOURCE3} .

mkdir -p node_modules
# node_modules_prod
tar xfz %{SOURCE1} --strip-components 2 -C node_modules

# node_modules_dev
tar xfz %{SOURCE2} --strip-components 2 -C node_modules


%build
npm run build


%install
mkdir -p %{buildroot}%{_datadir}/%{name}
cp -pr dist -t %{buildroot}%{_datadir}/%{name}

# Create apache config
mkdir -p %{buildroot}%{_sysconfdir}/httpd/conf.d
cat >> %{buildroot}%{_sysconfdir}/httpd/conf.d/ipa-webui.conf <<EOF
Alias /ipa/modern_ui "/usr/share/freeipa-webui/dist"
<Directory "/usr/share/freeipa-webui/dist">
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


%check
%nodejs_symlink_deps --check
npm run test
# The rest is overkill


%post
%systemd_post httpd


%files
%doc README.md
# Add proper docs, needs to be compiled
%license COPYING %{name}-%{version}-bundled-licenses.txt
%{_datadir}/%{name}
%{_sysconfdir}/httpd/conf.d/ipa-webui.conf


%changelog
%autochangelog
