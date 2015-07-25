# php-piratebox
## Project

A PirateBox is an anonymous offline file-sharing communications system, according to the [PirateBox project](http://www.piratebox.cc).

This project is just a powerful web interface, conceived in this spirit. You can use it on any hardware configured with an HTTP server and a PHP backend.

If you want to use it like a real PirateBox, you need to configure a wifi hotspot with a captive portal redirecting all web requests on it. For example, this project is also available as a [YunoHost](http://yunohost.org) application for this purpose. Thus, installing the [corresponding Yunohost application](https://github.com/labriqueinternet/piratebox_ynh) sets up all the necessary stuff for you, including the HTTP/PHP server side configurations. This last was integrated in the "[La Brique Internet](http://labriqueinter.net)" project.

This project is not affiliated with the official PirateBox project.

## Features
### Overview

* File-sharing without authentication
* Integrated web chat (can be disabled)
* Drag and drop supported with multiple files
* Folders browsing
* Pinned files or folders (marked with a star and cannot be deleted nor renamed)
* Free folders creation (can be disabled)
* Free files and folders renaming (can be disabled)
* Free files and (empty) folders deleting (can be disabled)
* Fancy URLs (can be disabled)
* Keyboard shortcuts and context menus
* Full AJAX with direct URLs and browser history
* Do not require a database
* Completely translatable with gettext
* Responsive design (mobile-friendly)

Some [screenshots](#screenshots) are available.

### Main shortcuts

On the files tab:

* **Right/Left arrows**: browses between files and folders
* **Enter**: downloads the selected file or gets into the selected folder
* **Del**: deletes the selected file
* **F2**: renames the selected file or folder
* **Escape**: unselects the selected file or folder
* **Insert**: uploads files
* **Page Down**: creates a folder
* **F4**: shows the chat tab

You also can directly download a file by double-clicking it.

On the chat tab:

* **Up arrow**: completes the input field with the last posted message
* **Down arrow**: cleans the input field
* **F3**: shows the files tab

### Options

All options are available in */config.php*:

* **app_name**: name of the service ("PirateBox" by default but brandable)
* **enable_chat**: boolean for enabling the web chat or not
* **allow_renaming**: boolean for allowing free renaming of the existing files or not
* **allow_deleting**: boolean for allowing free deleting of the existing files or not
* **default_pseudo**: default pseudo in the chat when the user has not defined one ("anonymous" by default, completed with a random number)
* **time_format**: format to use for displaying dates, using the [PHP date](https://php.net/manual/en/function.date.php) syntax
* **fancyurls**: boolean for enabling fancy URLs or not (see below the required specific configuration at the HTTP server side)
* **base_path**: unix path of the root of the interface in the server
* **base_uri**: root of the interface regarding the URLs (folders to add after the domain name)
* **base_uploads**: optional unix path in case of the *uploads/* folder is located elsewhere in the server (see HTTP configuration below)
* **base_chat**: optional unix path in case of the *chat/* folder (containing the chat log file) is located elsewhere in the server (see HTTP configuration below)
* **max_space**: maximum available space in percent for the data, on the partition where *base_uploads* is located

For pinning a file or a folder, just remove the write permission for the owner on the server:

    # chmod u-w /var/www/piratebox/public/uploads/foo.bar

## Server configuration
### HTTP server

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

      # 10 minutes max for uploading a file
      fastcgi_send_timeout 600;
    }
    
    # OPTIONAL: use fancy urls
    # WITH: $options['fancyurls'] = true
    location @piratebox {
    
      # WITH: $options['base_uri'] = '/foobar/'
      rewrite ^/foobar/(.*)$ /foobar/?/get&dir=$1;
    }
    
    location / {
      index index.html index.php;
    
      # OPTIONAL: use fancy urls
      try_files $uri $uri/ @piratebox;
    }

### PHP backend

Example with php-fpm:

    ; Max file size
    php_value[upload_max_filesize] = 10G
    php_value[post_max_size] = 10G
    
    ; 10 minutes max for uploading a file
    php_value[max_execution_time] = 600

### Permissions

For example, if your PHP pool uses *www-data* as unix user:

    # chown www-data: public/uploads/
    # chown www-data: public/chat/

## Screenshots

![Files tab](/screenshots/piratebox1.png?raw=true "Files tab")
![Files tab (mobile)](/screenshots/piratebox4.png?raw=true "Files tab (mobile)")
![Tabs menu (mobile)](/screenshots/piratebox3.png?raw=true "Mobile tabs")
![Download file](/screenshots/piratebox8.png?raw=true "Download file")
![Download file (mobile)](/screenshots/piratebox2.png?raw=true "Download file (mobile)")
![Upload files (mobile)](/screenshots/piratebox9.png?raw=true "Upload files (mobile)")
![Chat tab](/screenshots/piratebox5.png?raw=true "Chat tab")
![Upload files](/screenshots/piratebox7.png?raw=true "Upload files")
![Chat tab (mobile)](/screenshots/piratebox6.png?raw=true "Chat tab (mobile)")
![Tabs menu 2 (mobile)](/screenshots/piratebox10.png?raw=true "Tabs menu 2 (mobile)")
