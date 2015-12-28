#! /bin/bash
#
#----------------------------------------------------------------------------
#
# - Oh Jasmin Dynamic DNS -
#
# Copyright 2000 - 2015 by
# SwordLord - the coding crew - http://www.swordlord.com
# and contributing authors
#
# This program is free software; you can redistribute it and/or modify it
# under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
# FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
# for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#-----------------------------------------------------------------------------
#
# Original Author:
# LordAndrej@swordlord.com
# LordEidi@swordlord.com
# LordFilu@swordlord.com
#
# $Id:
#
#-----------------------------------------------------------------------------

# exiting script when admin did not change configuration
echo ""
echo "************************"
echo "Hello from updatedns.sh"
echo "************************"
echo "I was not configured! "
echo "Please configure me "
echo "and remove this warning!"
echo "************************"
exit 0

TARGET_DIR="/etc/tinydns/root/"
BASE_DIR="/etc/tinydns/root/base_files/"
TARGET_FILE="/etc/tinydns/root/data"

# remove old dns-file
rm $TARGET_FILE

# generate / concat new from primary
for i in "$BASE_DIR"/primary/* 
do
    cat ${i} >> $TARGET_FILE
done

# concat new from dyndns
for i in "$BASE_DIR"/dyndns/*
do
    cat ${i} >> $TARGET_FILE           
done

# tinydns-data has to be executed in the same directory where the file data is
cd /etc/tinydns/root

# generate data.cdb from data for dbndns
/usr/bin/tinydns-data

# copy to secondary
#..


# EOF
