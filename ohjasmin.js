/*-----------------------------------------------------------------------------
 **
 ** - Oh Jasmin Dynamic DNS -
 **
 ** Copyright 2000 - 2015 by
 ** SwordLord - the coding crew - http://www.swordlord.com
 ** and contributing authors
 **
 ** This program is free software; you can redistribute it and/or modify it
 ** under the terms of the GNU General Public License as published by the Free
 ** Software Foundation, either version 3 of the License, or (at your option)
 ** any later version.
 **
 ** This program is distributed in the hope that it will be useful, but WITHOUT
 ** ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 ** FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 ** more details.
 **
 ** You should have received a copy of the GNU General Public License along
 ** with this program. If not, see <http://www.gnu.org/licenses/>.
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

// see this URL for official dyndns protocol specifications:
// http://www.dyndns.com/developers/specs/syntax.html
//
// http://username:password@members.dyndns.org/nic/update?hostname=yourhostname&myip=ipaddress&wildcard=NOCHG&mx=NOCHG&backmx=NOCHG

// we have to sanitise the input for obvious reasons...
// the only special char allowed is the dot in the user id and in the fully qualified domainname

//-----------------------------------------------------------------------------
var log = require('./libs/log').log;

var config = require('./config').config;
var authlib = require('./libs/authentication');

var dyndns = require('./libs/dyndns');

var crossroads = require('crossroads');
crossroads.ignoreState = true;

var http = require('http');
var url  = require('url');

var auth = require('http-auth');

var db = require('./libs/db');

//-----------------------------------------------------------------------------
var basic = auth.basic({
        realm: "Oh Jasmin Dynamic DNS"
    }, function (username, password, callback) 
    	{
			authlib.checkLogin(username, password, callback);
		}
);

//-----------------------------------------------------------------------------
// legacy way, move to new URL method if you do not absolutely need this schema
crossroads.addRoute('/nic/update{?query}', dyndns.onUpdateLegacy);
crossroads.addRoute('/ddns/update/', dyndns.onUpdate);

crossroads.bypassed.add(onBypass);

function onBypass(req, res, path)
{
	log.info('URL unknown: ' + path);

	res.writeHead(200, {'Content-Type': 'text/plain'});

	var json = JSON.stringify({
		info: path,
		exitCode: -1,
		programOutput: 'function unknown'
	});

	res.end(json);
}

db.init();

//-----------------------------------------------------------------------------
var server = http.createServer(basic, function (req, res)
{
	var sUrl = url.parse(req.url).path;
	log.debug("Processing request for path: " + sUrl);
	crossroads.parse(sUrl, [req, res]);
});

server.on('error', function (e)
{
	log.debug("Error: " + e);
});

server.listen(config.port, config.ip);
log.info("Server running at http://" + config.ip + ":" + config.port + "/");
log.debug("Test ohjasmin.js with that url: http://domain:password@" + config.ip + ":" + config.port + "/ddns/update/");


