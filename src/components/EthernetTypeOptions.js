/*
 *------------------------------------------------------------------
 * EthernetTypeOptions.js
 * 
 * Renders the list of available options for Ethernet Type field.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";

class EthernetTypeOptions extends Component {
  render() {
    return (
      <React.Fragment>
        <option value="">-- Select a Type --</option>
        <option>IPv4</option>
        <option>IPv6</option>
        <option>MPLS Unicast</option>
        <option>MPLS Multicast</option>
        <option>ARP</option>
        <option>Dot1q</option>
        <option>PPPoE Discovery Stage</option>
        <option>PPPoE Session Stage</option>
      </React.Fragment>
    );
  }
}

export default EthernetTypeOptions;
