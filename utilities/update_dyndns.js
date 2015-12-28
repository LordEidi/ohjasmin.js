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

var sHost = require('../libs/db').HOST;

var outFile = config.update_dyndata_destination;
var mainScriptFile = config.update_main_script;

sHost.findAndCountAll().then(function (result) {

    var fs = require('fs');

    // make sure, that the old file is removed
    if(existsSync(fs, outFile)){
        fs.unlinkSync(outFile);
    }

    var now = new Date().toISOString();
    fs.appendFileSync(outFile, "# dyndns data written at " + now + "\n");

    // create one line for every single record, formatted according tinydns.data format
    for (var i = 0; i < result.count; ++i)
    {
        var host = result.rows[i];
        var line = host.type + host.domain + ':' + host.ip + ':' + host.ttl

        fs.appendFileSync(outFile, line.toString() + "\n");
    }

    var chmod = config.update_files_chmod;
    fs.chmodSync(outFile, chmod)

    log.info('Datafile %s written', outFile);

    // call update script to start the dns update process
    log.info('Starting DNS update %s', mainScriptFile);
    var process = require('child_process');
    var exec = process.exec(mainScriptFile, function (error, stdout, stderr) {
        if(error)
        {
            log.error(error);
        }

        log.info(stdout);

        log.info('DNS update ended.');

    });

}).error(function(error){

    log.error(error);
    process.exit(0);
});

// quick hack to check if a file exists
function existsSync(fs, filename) {
    try {
        fs.accessSync(filename);
        return true;
    } catch(ex) {
        return false;
    }
}