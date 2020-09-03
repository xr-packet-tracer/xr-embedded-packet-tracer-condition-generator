/*
 *------------------------------------------------------------------
 * IPPrecedenceOptions.js
 * 
 * Renders the list of available IP Precedence options for IPv4/IPv6 protocol.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";

class IPPrecedenceOptions extends Component {
  render() {
    return (
      <React.Fragment>
        <option value="0">0 - Routine or Best Effort</option>
        <option value="1">1 - Priority</option>
        <option value="2">2 - Immediate</option>
        <option value="3">3 - Flash</option>
        <option value="4">4 - Flash Override</option>
        <option value="5">5 - Critical</option>
        <option value="6">6 - Internet</option>
        <option value="7">7 - Network</option>
      </React.Fragment>
    );
  }
}

export default IPPrecedenceOptions;
