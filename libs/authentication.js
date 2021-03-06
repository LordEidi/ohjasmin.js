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

var bcrypt = require('bcryptjs');

var config = require('../config').config;

function checkLogin(username, password, callback)
{
    // clean the username from unwanted characters
    username = username.replace('/[^a-zA-Z0-9_-.]/g' , '');

    // if user exists, let her in
    HOST.findOne({ where: { domain: username }})
    .then(function(domain, error) {

        if(error || !domain) {
            log.warn("Authentication attempt for user %s was not successful", username);
            callback(false);
            return;
        }

        var hashed = domain.password;

        bcrypt.compare(password, hashed, function(err, result) {
            log.info("Authentication attempt for user %s was %s", username, result);
            callback(result);
        });

    });
}

// WARNING, THIS CODE IS NOT TESTED YET!
function checkLoginLegacy(username, password, callback)
{
    log.info("Login process started for user: " + username);

    var md5 = crypto.createHash('md5');
    md5.update(password);

    log.debug("Authentication attempt for user: " + username + " with password: " + password);

    // concat the string to a path
    var path = config.dnsRoot + "/" + username + "/" + md5.digest('hex');

    log.debug("Path to user directory: " + path);

    var fs = require('fs');

    // check if path exists
    if(fs.existsSync(path))
    {
        log.info("Login for user " + username + " successful.");
        callback(true);
    }
    else
    {
        log.info("Login for user " + username + " denied.");
        callback(false);
    }
}

// Exporting.
module.exports = {
    checkLogin: checkLogin
};