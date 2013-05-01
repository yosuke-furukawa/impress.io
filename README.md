impress.io = socket.io + impress.js
===================================

What is impress.io?
---------

**impress.io** is a presentation tool using *impress.js* and *socket.io*

Feature
--------

+ Synchronize presenter's page and listeners' page
+ Catch Github webhook, Reload
+ Catch file update, Reload

How to use impress.io
---------
<!-- data-x="1000" -->
<!-- data-y="3000" -->
<!-- data-z="500" -->
<!-- data-scale="3" -->
<!-- data-rotate="90" -->

**impress.io** uses *markdown2impress*


requirement tools:

0. Node.js & perl

1. cpanm

    $ curl -L http://cpanmin.us | perl - --sudo App::cpanminus

2. grunt

    $ npm install grunt-cli -g

How to create presentation
---------

    $ git clone git://github.com/yosuke-furukawa/impress.io.git
    $ cd impress.io
    $ npm install
    $ grunt build // if you have errors, sudo may help you.

Write markdown and use markdown2impress
--------

    $ grunt create --file=README.md // or write your markdown
    $ open index.html

If you are presenter, you would run socket.io and use it to be better!
--------

How to run socket.io
--------

you need external host for running Socket.io.

    $ grunt create:user --user=<username> --pass=<password>
    $ grunt forever:start
    $ grunt forever:stop // for stop

+ access **http://your_host_name:port/**
+ enter your *username* and *password* and login.

Recreate impress page for socket.io
-------

    $ grunt create --file=README.md --socket_url=http://your_host_name:port/
    $ open index.html

If you don't wanna recreate, use watchImpress command
-------

    $ grunt watchImpress --file=README.md --socket_url=http://your_host_name:port/

Catch Github webhook, then reload all client browsers.
-------

+ Settings > Service Hooks > WebHookURLs

+ Add http://your_host_name:webhookport/

want to know more?
------

[**Use The Source, Luke**](https://github.com/yosuke-furukawa/impress.io)
![joda](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARgAAAEYCAMAAACwUBm+AAAAAXNSR0IArs4c6QAAAKtQTFRFsAAAvbWSLUUrLEQqY1s8UYJMqJ1vNTEgOiIdIzYhjIFVLhsXZ6lgSEIsP2U8JhcCVzMsSXZEgXdOO145XJdWOl03LzAYMk4vSXNExr+hwcuxRTs1Qmk+RW9Am49eFRANQz4pUoNMQWc+OSMDTz0wLBsCNVMxa2NBOyUDUoNNSnlEWo9VRGxAVzYFl6tXCggHbLNmMUIcHhwTXkk5f3VNRT8wUT8xAAAACQocRBWFFwAAAAF0Uk5TAEDm2GYAAAPCSURBVHja7d3JctNAFIZRMwRCCGEmzPM8z/D+T8bu/ptbXXJFdij5fMt2Wuo+2UgqxVmtttq5WVotLzBgwIABAwYMGDCn0qVqbo69psPqVpWx+1XG5iaavF8wYMCAAQMGDBgwi4DJ6Y6qkxB1HNlcN3a92gbR5P2CAQMGDBgwYMCAWSxMlrU+UY5yu2l9okfV4bAxUVbf7TJnAwMGDBgwYMCAAbMLMHeqbGR82Zy+VR1Ht81nVca6R+UdTLaU24Ruzd3qM/e4yjnAgAEDBgwYMGDA7AJMd1l/3NRdVGcj3eX/2WEhCmDGxnM7yqygu8XIPjJj8iN/MGDAgAEDBgwYMAuDGb8q0RGlLCHLv1t9qDKWn3vdNHVuEI6HPaxO9Jo3GDBgwIABAwYMmIXBdC9ShGgMk+XnkXUeuGcsP/e1+lhNnZsL/G5Vs3OAAQMGDBgwYMCAWSxMR3SzOmraG5atdy9wZKzb+vg16qyqe2FltbnAgAEDBgwYMGDALAxmTJSuN3WA76rnVca6GTnemGN1WoEBAwYMGDBgwIBZGMxUomy4+xO899V4LAg5Xnc2MGDAgAEDBgwYMGA218Wq+2K1LDqvY9xZu8zN8fICdM6btYABAwYMGDBgwIABMzfH0+pGU5afze2tXebmeAfVz+p8BQYMGDBgwIABAwbMPBzZ+oWmfJrln1273FhkbHzee9WWbw7AgAEDBgwYMGDALAKm43hcdctKgblcPamOhuXnXlY5Xs6bsW4FGyQCAwYMGDBgwIABswiYMceZKgvMo+h8mrHLTdn676rj+FEFoTtHd8MwOxEYMGDAgAEDBgyYRcBM5UhXqiymW3R3c9ARhWO/OmjqfjVZy+xEYMCAAQMGDBgwYBYG073OnCV0RFNhMhaOa9WfKmOB6XjHMN1tQmaAAQMGDBgwYMCA2VWY7vXjz1U4croAzgPztwIDBgwYMGDAgAEDZhswh035NBw59Dww3RgYMGDAgAEDBgwYMJuD6f4tXT7NUqfCdBvZLkxXdgQGDBgwYMCAAQNmt2DGj8WzwAfV/w7T/aq7mxwwYMCAAQMGDBgwuwqTOo7uTwTngflSzQ3TdaJvAwEDBgwYMGDAgAED5gSvgbyo5oHZ4Pc+gwEDBgwYMGDAgAEzhOm+5G0qTGaAAQMGDBgwYMCAAXNaMOcnls3tNwWm+zRzp54NDBgwYMCAAQMGDJh5YNL36k1TLuGvVq+qnKMbS5n7tulT9asCAwYMGDBgwIABA2ZumKuztLnjgQEDBgwYMGDAgNl5mH/4/ltKA6vBNAAAAABJRU5ErkJggg==)
