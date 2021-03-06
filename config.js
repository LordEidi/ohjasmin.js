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

// Place all your configuration options here

var config =
{
    // server specific configuration
    // please use a proxy in front of ohjasmin to support TLS
    // we suggest you use nginx as the TLS endpoint
    port: 8888,
    ip_test: '127.0.0.1',
    ip_server: '127.0.0.1',

    // db specific configuration. you can use whatever sequelize supports.
    db_name: 'ohjasmin',
    db_uid: 'uid',
    db_pwd: 'pwd',
    db_dialect: 'sqlite',
    // if true, sql queries will be logged as DEBUG messages
    db_logging: true,
    db_storage: 'ohjasmin.sqlite',

    // logging
    log_level: 'DEBUG',
    log_file: 'ohjasmin.log',

    // file to be touched to have incron wake up the update script
    update_trigger_file: 'update.trigger',
    update_dyndata_destination: 'dyndata',
    update_files_chmod: '0600',
    update_main_script: 'utilities/updatedns.sh',

    // used for hashing passwords
    bcrypt_rounds: 10,

    // user accounts used for testing
    test_user_good_name: 'dyndns.example.org',
    test_user_good_pwd: 'test',
    test_user_bad_name: 'demo',
    test_user_bad_pwd: 'demo'
};

// Exporting.
module.exports = {
    config: config
};