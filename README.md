# PirateBox
## Overview

**Warning: work in progress**

### Configure HTTP server

Example with nginx:

    # Max file size
    client_max_body_size 10G;
    
    # OPTIONAL
    location /public/uploads/ {
    
      # OPTIONAL: use a public/uploads/ folder located elsewhere
      # WITH: $options['base_uploads'] = '/var/spool/piratebox/public/uploads/'
      root /var/spool/piratebox/;
  
      # OPTIONAL: force download for all files
      add_header Content-Type "application/octet-stream";
      add_header Content-Disposition "attachment; filename=$1";
    }
    
    # OPTIONAL
    location /public/chat/ {
    
      # OPTIONAL: use a public/chat/ folder located elsewhere
      # WITH: $options['base_chat'] = '/var/spool/piratebox/public/chat/'
      root /var/spool/piratebox/;

      # OPTIONAL: deny direct access to the chat log
      deny all;
      return 403;
    }
    
    # PHP
    location ~ \.php {
      include /etc/nginx/fastcgi_params;
    
      fastcgi_index index.php;
      fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
      fastcgi_pass unix:/var/run/php.sock;

      # 5 minutes max for uploading a file
      fastcgi_send_timeout 600;
    }
    
    # OPTIONAL: use fancy urls
    # WITH: $options['fancyurls'] = true
    location @piratebox {
    
      # WITH: $options['base_uri'] = 'foobar/'
      rewrite ^/foobar/(.*)$ /foobar/?/get&dir=$1;
    }
    
    location / {
      index index.html index.php;
    
      # OPTIONAL: use fancy urls
      try_files $uri $uri/ @piratebox;
    }

## Configure PHP

Example with php-fpm:

    ; Max file size
    php_value[upload_max_filesize] = 10G
    php_value[post_max_size] = 10G
    
    ; 5 minutes max for uploading a file
    php_value[max_execution_time] = 600

## Configure permissions

If your PHP pool uses *www-data* as user:

    # chown www-data: public/uploads
    # chown www-data: public/chat
