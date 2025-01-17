Name:           freeipa-webui
Version:        0.1.1
Release:        %autorelease
Summary:        New version of the web application for administration of FreeIPA built using React and PatternFly 6.

License:        GPL-3.0-only
URL:            https://github.com/freeipa/freeipa-webui.git
Source0:        %{name}-%{version}.tar.gz

# Build dependencies
BuildRequires:  nodejs
BuildRequires:  npm
#BuildRequires:  nodejs-webpack


# Runtime dependencies
Requires:       nodejs


%description
New version of the web application for administration of FreeIPA built using React and PatternFly 5.

# Ensure npm modules are not shipped from upstream
rm -rf node_modules

%prep
%autosetup
npm install -g webpack webpack-cli


%build
# Install npm dependencies
npm install --production
npm run build

%install
# Create the install directory
mkdir -p %{buildroot}%{_datadir}/%{name}

# Copy project files to the install directory
cp -r * %{buildroot}%{_datadir}/%{name}

%files
%{_datadir}/%{name}
%doc README.md
%license LICENSE


%changelog
%autochangelog
