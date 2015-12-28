ohjasmin.js
===========

![ohjasmin.js](https://raw.githubusercontent.com/LordEidi/ohjasmin.js/master/ohjasmin_logo.png)

**ohjasmin.js** and **ohjasmindns** (c) 2000-2015 by [SwordLord - the coding crew](https://www.swordlord.com/)

## Introduction ##

**ohjasmin.js** is a poor woman's dyndns solution based on node.js and dbndns or alternatively djbdns. Send a web requests to your instance of **ohjasmin.js** and **ohjasmin.js** takes care that your hostname always points to your current IP address.

**ohjasmin.js** feeds an instance of djbdns or dbndns. It does so indirectly and uses an intermediate store for your dyndns data. Which means that by adding **ohjasmin.js** to your setup you get your very own dynamic DNS backend.


## Status ##

While the PHP version of **ohjasmindns** is running since years, **ohjasmin.js** is fresh and still considered beta software and should be handled as such.

Whats missing:

- Update script to update your instance of dbndns when your IP address changes.


## Installation ##

If you want to run **ohjasmin.js** under a specific user (node), do this:

    sudo adduser node
    su node
    cd
    mkdir ohjasmin
    cd ohjasmin

Go into the directory where you want to run your copy of **ohjasmin.js** and get the latest and greatest:

    cd /home/node/ohjasmin
    git clone https://github.com/LordEidi/ohjasmin.js.git

And then with the magic of npm get the required libraries

    npm install

If everything worked according to plan, you should now have a new installation of the latest **ohjasmin.js**.

###Use supervisord to run **ohjasmin.js** as a service###

Now we want to make sure that **ohjasmin.js** runs forever. First install the required software:

    sudo apt-get install supervisor

Then copy the file utilities/ohjasmin_supervisor.conf into your local supervisor configuration directory. This is usually done like this:
 
    cp utilities/ohjasmin_supervisor.conf /etc/supervisor/conf.d/ohjasmin.conf 
    
Make sure you change the configuration to your local setup.

### Adding hosts ###

There is a small script in the utilities folder which helps in adding and updating domain records. You can see the options when calling it with the --help argument:

    node add_domain.js --help
    
Adding the test users for the tests below would require you to do this:

    node add_domain.js -f dyndns.example.org -p test -i 127.0.0.4
    node add_domain.js -f demo -p demo -i 127.0.0.4

See this link for details regarding the -t/--type argument: http://cr.yp.to/djbdns/tinydns-data.html.

**Warning** If your configuration file has relative paths for sqlite files, make sure to run add_domain from the same folder as you run **ohjasmin.js** from.

###How to set up transport security###

Since **ohjasmin.js** does not bring it's own transport crypto, you may need to install a TLS server in front of **ohjasmin.js**. You can do so
with nginx, which is a lightweight http server and proxy.

Please see [transport security](TRANSPORT_SECURITY.md) for details.


## Configuration ##

All parameters which can be configured right now are in the file *config.js*.

| Option        | Description           | 
| ------------- |:-------------:| 
| port     | On which port ohjasmin.js should run. |
| ip_server     | The IP address on which the server binds to. |
| ip_test     | Which IP address the test script will call. |
| db_*     | The configuration of your database backend. db_storage can contain whatever sequelize can talk to. |
| log_*     | Configure the logging options here. A sane configuration would be to use level WARN in production. |
| bcrypt_rounds     | How many rounds should be used to hash the domain passwords. |


## Testing ##

Run **ohjasmin.js** and then run the tests with this command:

    npm test
    
if everything is fine, you should get no errors. Please make sure to add the test users before running these tests. See chapter [adding hosts](#adding-hosts) above.


## Contribution ##

If you happen to know how to write JavaScript, documentation or can help out with something else, drop us a note at *contact at swordlord dot com*. As more helping hands we have, as quicker these get up and running.


## Dependencies ##

You will need node.js and either dbndns or djbdns to make use of **ohjasmin.js**.


## License ##

**ohjasmin.js** is published under the AGPL-3.0. See the LICENCE file for details.



