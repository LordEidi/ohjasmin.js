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

// Exporting.
module.exports = {
    checkLogin: checkLogin
};