/*-----------------------------------------------------------------------------
 **
 ** - Oh Jasmin Dynamic DNS -
 **
 ** Copyright 2000 - 2015 by
 ** SwordLord - the coding crew - http://www.swordlord.com
 ** and contributing authors
 **
 ** This program is free software; you can redistribute it and/or modify it
 ** under the terms of the GNU Affero General Public License as published by
 ** the Free Software Foundation, either version 3 of the License, or
 ** (at your option) any later version.
 **
 ** This program is distributed in the hope that it will be useful, but WITHOUT
 ** ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 ** FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
 ** for more details.
 **
 ** You should have received a copy of the GNU Affero General Public License
 ** along with this program. If not, see <http://www.gnu.org/licenses/>.
 **
 **-----------------------------------------------------------------------------
 **
 ** Original Authors:
 ** LordEidi@swordlord.com
 **
 ** $Id:
 **
 -----------------------------------------------------------------------------*/

var config = require('../config').config;
var log = require('../libs/log').log;

var program = require('commander');

var bcrypt = require('bcryptjs');

var DB = require('../libs/db');
var HOST = DB.HOST;

program
    .version('1.0.0')
    .option('-f, --fqdn <fqdn>', 'Fully qualified domain name')
    .option('-p, --pwd <password>', 'Password to be used for authentication')
    .option('-i, --ip <ip>', 'Initial IP address. Default is 127.0.0.1', '127.0.0.1')
    .option('-l, --ttl <ttl>', 'Time to live. Default is 300', 300)
    .option('-t, --type <type>', 'Host type. Default is =', '=')
    .option('-o, --override', 'Override an existing domain? Default is false');

program
    .parse(process.argv);

// Give the db script a chance to sync
setTimeout(function() {
        addHostRecord();
    }, 1000);

function addHostRecord() {

    if(!program.fqdn)
    {
        log.error("Mandatory argument '-f, --fqdn <fqdn>' missing");
        process.exit(1);
    }

    if(!program.pwd)
    {
        log.error("Mandatory argument '-p, --pwd <password>' missing");
        process.exit(1);
    }

    var defaults = {};

    var salt = bcrypt.genSaltSync(config.bcrypt_rounds);
    var hash = bcrypt.hashSync(program.pwd, salt);
    defaults.password = hash;

    defaults.ip = program.ip;
    defaults.ttl = program.ttl;
    defaults.type = program.type;


    HOST.findOrCreate({
        where: {domain: program.fqdn},
        defaults: defaults
    }).spread(function (host, created) {
        if (created) {
            log.debug('Created host: ' + JSON.stringify(host, null, 4));

            host.save().then(function () {
                log.info('Host updated');
            });
        }
        else {
            log.debug('Loaded host: ' + JSON.stringify(host, null, 4));

            if(program.override) {

                host.password = defaults.password;
                host.ip = defaults.ip;
                host.ttl = defaults.ttl;
                host.type = defaults.type;

                host.save().then(function () {
                    log.info('Host updated');
                });
            } else
            {
                log.debug('Host not updated (argument -o missing)');
            }
        }
    });
};