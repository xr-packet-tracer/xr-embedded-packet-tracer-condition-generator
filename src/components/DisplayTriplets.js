/*
 *------------------------------------------------------------------
 * DisplayTriplets.js
 *
 * Renders the calculated offset/value/mask triplets.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaCopy } from "react-icons/fa";
import copy from "copy-to-clipboard";

class DisplayTriplets extends Component {
  /*
   * The composite string consiting of all the triplets genrated for a 
   * protocol is available in props. 
   * This string is split into a string array using "\n" as the delimiter.
   * For each string in the string array the substring consiting of only the
   * triplet value is fetched and displayed alongwith a copy to clipboard button.
   */
  render(props) {
    return (
      <React.Fragment>
        <Card.Footer className="text-muted">
          {this.props.action.split("\n").map((line, i) =>
            line !== "" ? (
              <div key={"x" + i} style={{ padding: "2px" }}>
                {line}
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip>Copy to Clipboard</Tooltip>}
                >
                  <small style={{ padding: "4px" }}>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => {
                        copy(
                          line.substring(line.indexOf(":") + 2, line.length)
                        );
                      }}
                    >
                      <FaCopy />
                    </Button>
                  </small>
                </OverlayTrigger>
              </div>
            ) : null
          )}
        </Card.Footer>
      </React.Fragment>
    );
  }
}

export default DisplayTriplets;
