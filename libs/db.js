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

var Sequelize = require('sequelize');

var sequelize = new Sequelize(config.db_name, config.db_uid, config.db_pwd, {
    dialect: config.db_dialect,
    storage: config.db_storage,
    logging: logdb
});

function logdb(message)
{
    if(config.db_logging) {
        log.debug(message);
    }
}

// host is the only table we need
var HOST = sequelize.define('host', {
    domain: { type: Sequelize.STRING, allowNull: false, unique: true, primaryKey: true},
    password: { type: Sequelize.STRING, allowNull: false},
    ip: { type: Sequelize.STRING, allowNull: false, defaultValue: '127.0.0.1'},
    type: { type: Sequelize.STRING, allowNull: false, defaultValue: '='},
    ttl: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 300}
},{
    underscored: true,
    timestamps: true
});

sequelize.sync().then(function()
    {
        log.info("Database structure updated");

    }).error(function(error)
    {
        log.error("Database structure update crashed: " + error);
    }
);

// Exporting.
module.exports = {
    HOST: HOST,
    sequelize: sequelize
};