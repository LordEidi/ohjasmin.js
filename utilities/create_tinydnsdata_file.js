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

var program = require('commander');
var log = require('../libs/log').log;

var sHost = require('../libs/db').HOST;

program
    .version('1.0.0')
    .option('-o, --out <path>', 'File to write records to. Default is dyndata', 'dyndata')

program
    .parse(process.argv);

sHost.findAndCountAll().then(function (result) {

    fs = require('fs');
    var now = new Date().toISOString();
    fs.appendFileSync(program.out, "# dyndns data written at " + now + "\n");

    for (var i = 0; i < result.count; ++i)
    {
        var host = result.rows[i];
        var line = host.type + host.domain + ':' + host.ip + ':' + host.ttl

        fs.appendFileSync(program.out, line.toString() + "\n");
    }

    log.info('File %s written', program.out);
    process.exit(1);

}).error(function(error){

    log.error(error);
    process.exit(0);
});
