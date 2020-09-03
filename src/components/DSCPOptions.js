/*
 *------------------------------------------------------------------
 * DSCPOptions.js
 * 
 * Renders the list of available DSCP options for IPv4/IPv6 protocol.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";

class DSCPOptions extends Component {
  render() {
    return (
      <React.Fragment>
        <option value="0">0 - Default/Best Effort</option>
        <option value="8">8 - CS1</option>
        <option value="10">10 - AF11</option>
        <option value="12">12 - AF12</option>
        <option value="14">14 - AF13</option>
        <option value="16">16 - CS2</option>
        <option value="18">18 - AF21</option>
        <option value="20">20 - AF22</option>
        <option value="22">22 - AF23</option>
        <option value="24">24 - CS3</option>
        <option value="26">26 - AF31</option>
        <option value="28">28 - AF32</option>
        <option value="30">30 - AF33</option>
        <option value="32">32 - CS4</option>
        <option value="34">34 - AF41</option>
        <option value="36">36 - AF42</option>
        <option value="38">38 - AF43</option>
        <option value="40">40 - CS5</option>
        <option value="46">46 - EF/High Priority EF</option>
        <option value="48">48 - CS6</option>
        <option value="56">56 - CS7</option>
      </React.Fragment>
    );
  }
}

export default DSCPOptions;
