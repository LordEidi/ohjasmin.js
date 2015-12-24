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

var bcrypt = require('bcryptjs');

var config = require('./config').config;

var log = require('./libs/log').log;
var DB = require('./libs/db');
var HOST = DB.HOST;

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(config.bcrypt_rounds);
var hash = bcrypt.hashSync(config.test_user_good_pwd, salt);

// Give the db script a chance to sync
setTimeout(function() {
        addHostRecord();
    }, 1000);

function addHostRecord() {

    HOST.findOrCreate({
        where: {domain: config.test_user_good_name},
        defaults: {
            password: hash,
            ip: "127.0.0.3"
        }
    }).spread(function (host, created) {
        if (created) {
            log.debug('Created host: ' + JSON.stringify(host, null, 4));
            host.save().then(function () {
                log.info('host updated');
            });
        }
        else {
            log.debug('Loaded host: ' + JSON.stringify(host, null, 4));
        }
    });
};