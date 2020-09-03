/*
 *------------------------------------------------------------------
 * AddHeader.js
 *
 * Renders designed frame header.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";
import { Form } from "react-bootstrap";

class AddHeader extends Component {
  render(props) {
    return (
      <React.Fragment>
        <tr>
          <td>
            <span
              style={{
                color: "white",
                backgroundColor: "#17a2b8",
                borderColor: "#17a2b8",
                display: "block",
                height: "100%",
                width: "95%",
                padding: "0.375rem 0.75rem",
                borderRadius: "0.25rem",
                fontSize: "1rem",
                lineHeight: "1.5",
              }}
            >
              {/* Prints the prop name in the table */}
              {this.props.name === "PPPoE"
                ? this.props.name + " + PPP"
                : this.props.name}
            </span>
          </td>
          <td>
            {/* Associate a checkbox for all protocols except
             * PPPoE and PW Control Word.
             */}
            {this.props.name !== "PPPoE" &&
            this.props.name !== "PW Control Word" ? (
              <Form.Check
                onChange={() => this.props.action(this.props.valueForEventKey)}
              />
            ) : null}
          </td>
        </tr>
      </React.Fragment>
    );
  }
}

export default AddHeader;
