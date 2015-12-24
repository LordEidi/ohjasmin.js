/*-----------------------------------------------------------------------------
 **
 ** - Oh Jasmin Dynamic DNS -
 **
 ** Copyright 2015 by
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
 **
 ** $Id:
 **
 -----------------------------------------------------------------------------*/
var test = require('tape');
var request = require('request');

var config = require('../config').config;

var username = config.test_user_good_name;
var password = config.test_user_good_pwd;

test('Updating IP', function (t) {

    t.plan(2);

    var options = {
        method: 'GET',
        uri: "http://" + config.ip_test + ":" + config.port + "/nic/update?hostname=" + username + "&myip=ipaddress&wildcard=NOCHG&mx=NOCHG&backmx=NOCHG",
        auth: {
            'user': username,
            'pass': password,
            'sendImmediately': true
        } ,
        followRedirect: false
    }

    request(options, function (error, response, body) {

        if (!error) {
            t.equal(response.statusCode, 200, "StatusCode matches");

            // that answer is either nochange or good (no ip change)
            var re = /(nochg|good) \d+\.\d+\.\d+\.\d+/i;
            t.ok(response.body.match(re), "Response message matches");
        }
        else {
            t.fail();
        }
    });
});
