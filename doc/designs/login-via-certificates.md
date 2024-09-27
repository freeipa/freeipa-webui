# Authentication via Certificates

## Introduction

The certificate authentication method takes as argument the username to perform the api call to the `/ipa/session/login_x509` endpoint after clicking the `Login using certificate` button.

## Steps to configure

This has been extracted from the [official RHEL documentation](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/configuring_and_managing_identity_management/dc-web-ui-auth_configuring-and-managing-idm#requesting-and-exporting-a-user-certificate_dc-web-ui-auth). Please refer to it for troubleshooting.

[**Inside the vagrant VM**] Create a ticket to configure the IDM server and generate the script to generate certs.

```
>> kinit admin
>> ipa-advise config-server-for-smart-card-auth > server_certificate_script.sh
>> chmod +x server_certificate_script.sh
>> ./server_certificate_script.sh /etc/ipa/ca.crt
```

Log in into FreeIPA, create a new user (e.g. Mary Shelley, aka. `mshelley`), and generate a certificate for her from the Vagrant VM as super user.

```
>> sudo su -
>> mkdir certdb/
>> certutil -N -d certdb/
>> cd certdb/
>> certutil -R -d ./certdb/ -a -g 4096 -n mshelley -s "CN=mshelley,O=DOM-IPA.DEMO" > certificate_request.csr
>> ipa cert-request certificate_request.csr --principal=mshelley@DOM-IPA.DEMO --profile-id=IECUserRoles --certificate-out=mshelley.pem
>> certutil -A -d ./certdb/ -n mshelley -t "P,," -i /root/mshelley.pem
```

Check that the generated certificate is not orphan:

```
>> certutil -K -d ./certdb/
```

Generate .p12 file based on generated .pem, move it to a public folder and change the permissions (that would allow to tranfer it via `scp`):

```
>> pk12util -d <absolute-path-to-folder>/certdb -o /root/certdb/mshelley.p12 -n mshelley
>> mkdir /home/vagrant/certs
>> cp /root/certdb/mshelley.p12 /home/vagrant/certs
>> chmod 666 /home/vagrant/certs/mshelley.p12
```

Now, the `.p12` certificate can be exported to **your local**:

```
# In our local, go to the folder where the vagrantFile sits (inside the WebUI project)
>> vagrant ssh-config > config.txt
>> scp -F config.txt default:/home/vagrant/certs/mshelley.p12 ~/Downloads
```

At this point, the `.p12` file should be in your local.

Now the [certificate](https://server.ipa.demo/ipa/config/ca.crt) ([alternative link](https://ipa.demo1.freeipa.org/ipa/config/ca.crt)) for the `DOM.IPA.DEMO` realm should be downloaded as described in the [Browser kerberos setup](https://server.ipa.demo/ipa/config/ssbrowser.html) ([alternative link](https://ipa.demo1.freeipa.org/ipa/config/ssbrowser.html)) page. For this example, we will use the steps described for Firefox browser.

To add both certificates to **Firefox browser**:

- Go to `Settings` > `Privacy and Security` > `View certificates`
- Add the realm certificate (`DOM-IPA.DEMO`) in the `Authorities` label
- Add the user certificate (`mshelley`) under `Your certificates`. Write the same password you used when it was created

As a final step, you must enable the post-handshake auth parameter:

- Write in Firefox: `about:config`
- Search: `security.tls.enable_post_handshake_auth`
- Enable it to `true`
- Restart Firefox

## Try certificate authentication in the modern WebUI

To test the certificate authentication, go to the [modern WebUI login page](https://server.ipa.demo/ipa/modern_ui/login), write the username `mshelley` and click `Login using Certificate`.
