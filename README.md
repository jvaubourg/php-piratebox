# PirateBox
## Overview

**Warning: work in progress**

### Fancy URLs (nginx)

    location ~ \.php$ {
      ...
    }
    
    location ~ / {
      index index.html index.php;
      try_files $uri $uri/ @piratebox;
    }
    
    location @piratebox {
      # with base_uri => foobar/
      rewrite ^/foobar/(.*)$ /foobar/?/get&dir=$1;
    }
