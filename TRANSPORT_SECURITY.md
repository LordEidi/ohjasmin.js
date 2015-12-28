ohjasmin.js
===========

![ohjasmin.js](https://raw.githubusercontent.com/LordEidi/ohjasmin.js/master/ohjasmin_logo.png)

**ohjasmin.js** and **ohjasmindns** (c) 2000-2015 by [SwordLord - the coding crew](https://www.swordlord.com/)

## Transport Security ##

###How to set up transport security###

Since **ohjasmin.js** does not bring it's own transport crypto, you may need to install a TLS server in front of **ohjasmin.js**. You can do so
with nginx, which is a lightweight http server and proxy.

First prepare your /etc/apt/sources.list file (or just install the standard Debian package, your choice):

    deb http://nginx.org/packages/debian/ jessie nginx
    deb-src http://nginx.org/packages/debian/ jessie nginx

Update apt-cache and install nginx to your system.

    sudo update
    sudo apt-get install nginx

Now configure a proxy configuration so that your instance of nginx will serve / prox the content of / for the
**ohjasmin.js** server. To do so, you will need a configuration along this example:

    server {
        listen   443;
        server_name  dyndns.yourdomain.tld;

        access_log  /var/www/logs/jasmin_access.log combined;
        error_log  /var/www/logs/jasmin_error.log;

        root /var/www/pages/;
        index  index.html index.htm;

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /var/www/nginx-default;
        }

        location / {
            proxy_pass         http://127.0.0.1:8888;
            proxy_redirect     off;
            proxy_set_header   Host             $host;
            proxy_set_header   X-Real-IP        $remote_addr;
            proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
            proxy_buffering    off;
        }

        ssl  on;
        ssl_certificate  /etc/nginx/certs/yourdomain.tld.pem;
        ssl_certificate_key  /etc/nginx/certs/yourdomain.tld.pem;
        ssl_session_timeout  5m;

        # modern configuration. tweak to your needs.
        ssl_protocols TLSv1.1 TLSv1.2;
        ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!3DES:!MD5:!PSK';
        ssl_prefer_server_ciphers on;
    
        # HSTS (ngx_http_headers_module is required) (15768000 seconds = 6 months)
        add_header Strict-Transport-Security max-age=15768000;
    }

Please check this site for updates on what TLS settings currently make sense:

    https://mozilla.github.io/server-side-tls/ssl-config-generator/

Now run or reset your nginx and start your instance of **ohjasmin.js**.

Thats it, your instance of **ohjasmin.js** should run now. All logs are sent to stdout and ohjasmin.log.

