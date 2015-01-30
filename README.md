ohjasmin.js
===========

![ohjasmin.js](https://raw.githubusercontent.com/LordEidi/ohjasmin.js/master/ohjasmin_logo.png)

**ohjasmin.js** and **ohjasmindns** (c) 2000-2015 by [SwordLord - the coding crew](http://www.swordlord.com/)

## Introduction ##

**ohjasmin.js** is a poor woman's dyndns solution based on node.js and dbndns or alternatively djbdns. Send a web requests to your instance of **ohjasmin.js** and **ohjasmin.js** takes care that your hostname always points to your current IP address.

**ohjasmin.js** feeds an instance of djbdns or dbndns. It does so indirectly and uses an intermediate store for your dyndns data. Which means that with a few lines of script you could add your own DNS backend.


## Status ##

While the PHP version of **ohjasmindns** is running since years, **ohjasmin.js** is fresh and still considered beta software and should be handled as such.


## Installation ##

To be written.


## Configuration ##

All parameters which can be configured right now are in the file *config.js*.


## Testing ##

The supplied dns_root directory contains the data for the user "hostname" with password "password".


## Contribution ##

If you happen to know how to write JavaScript, documentation or can help out with something else, drop us a note at *contact at swordlord dot com*. As more helping hands we have, as quicker these get up and running.


## Dependencies ##

For now, have a look at the package.json file.


## License ##

**ohjasmin.js** is published under the GNU General Public Licence version 3. See the LICENCE file for details.



