/*
 *------------------------------------------------------------------
 * EthernetPlusMinus.js
 * 
 * Renders the Ethernet label with +/- buttons in the landing page.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaMinus } from "react-icons/fa";

class EthernetPlusMinus extends Component {
  render() {
    return (
      <React.Fragment>
        <tr>
          <td>
            <Button variant="light" onClick={this.props.minusAction}>
              <FaMinus />
            </Button>
          </td>
          <td>
            <span
              style={{
                color: "white",
                backgroundColor: "#007bff",
                borderColor: "#007bff",
                display: "inline-block",
                height: "100%",
                width: "95%",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.25rem",
                fontSize: "1rem",
              }}
            >
              Ethernet
            </span>
          </td>
          <td>
            <Button variant="light" onClick={this.props.plusAction}>
              <FaPlus />
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <br />
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default EthernetPlusMinus;
