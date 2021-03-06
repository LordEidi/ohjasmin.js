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
 ** LordFilu@swordlord.com
 **
 ** $Id:
 **
 -----------------------------------------------------------------------------*/

var log = require('../libs/log').log;
var HOST = require('../libs/db').HOST;

function onUpdateLegacy(req, res, query)
{
    // check that all needed params were given
    // currently we only support the hostname
    // hostname=yourhostname&myip=ipaddress&wildcard=NOCHG&mx=NOCHG&backmx=NOCHG
    if (!query.hasOwnProperty("hostname")) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write("nohost");
        res.end();
        return;
    }

    onUpdate(req, res);
}

function onUpdate(req, res)
{
    res.writeHead(200,{'Content-Type':'text/plain'});

    // this is a bit uncool (to get the username again) but the dyndns logic needs the user as well
    var header = req.headers['authorization'] || '';
    var token = header.split(/\s+/).pop() || '';
    var auth = new Buffer(token, 'base64').toString();
    var parts = auth.split(/:/);

    var username = parts[0].replace('/[^a-zA-Z0-9_-.]/g' , '');

    res.writeHead(200, {'Content-Type': 'text/plain'});

    HOST.find({where: {domain: username}}).then(function (host, error) {

        if(error || !host) {
            log.warn('could not find host');
            res.write("nohost");
            res.end();
        }
        else {
            //path ok, check if IP has changed
            var ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            if (host.ip != ip) {
                host.ip = ip;

                host.save().then(function () {
                    log.info('host %s updated with ip %s', username, ip);
                    res.write("good " + ip);
                    res.end();

                    // touch trigger file
                    var fs = require('fs');

                    var triggerFile = config.update_trigger_file;
                    var chmod = config.update_files_chmod;

                    fs.writeFileSync(triggerFile, '', { encoding: 'utf8' });
                    fs.chmodSync(triggerFile, chmod)

                    log.info('Triggerfile %s written', triggerFile);

                });
            }
            else {
                log.info('host %s ip did not change', username);
                res.write("nochg " + ip);
                res.end();
            }
        }
    });
}

// Exporting.
module.exports = {
    onUpdate: onUpdate,
    onUpdateLegacy: onUpdateLegacy
};
