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

    $ git clone git@github.com:yosuke-furukawa/impress.io.git
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

    $ grunt create:user --user=<username> --pass=<password>
    $ grunt forever:start

+ access [http://localhost:3000/](http://localhost:3000/)
+ enter your <username> and <password> and login.

Recreate impress page for socket.io
-------

    $ grunt create --file=README.md --socket_url=http://localhost:3000/
    $ open index.html



