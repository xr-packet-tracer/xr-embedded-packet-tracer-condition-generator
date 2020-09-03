/*
 *------------------------------------------------------------------
 * UDPForm.js
 *
 * Renders the form for UDP protocol.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";
import {
  Col,
  Form,
  Button,
  Card,
  OverlayTrigger,
  Tooltip,
  Alert,
} from "react-bootstrap";
import { FaQuestion } from "react-icons/fa";
import MY_GLOBAL from "./Globals";
import DisplayTriplets from "./DisplayTriplets";

export class UDPForm extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      udpSubmit: false,
      sourcePort: "",
      destinationPort: "",
      emptyError: false,
      sourcePortError: false,
      destinationPortError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.validateSourcePort = this.validateSourcePort.bind(this);
    this.validateDestinationPort = this.validateDestinationPort.bind(this);
    this.calculateUDPTriplet = this.calculateUDPTriplet.bind(this);
    this.validateUDPForm = this.validateUDPForm.bind(this);
    this.handleUDPSubmit = this.handleUDPSubmit.bind(this);
  }

  /*
   * Handles input change in any of the fields.
   */
  handleChange = (event) => {
    const isCheckbox = event.target.type === "checkbox";
    this.setState({
      [event.target.name]: isCheckbox
        ? event.target.checked
        : event.target.value,
    });
  };

  /*
   * Validates Source Port field of UDP.
   */
  validateSourcePort() {
    let val = parseInt(this.state.sourcePort);
    if (val >= 0 && val <= 65535) return true;
    this.setState(
      {
        sourcePortError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates Destination Port field of UDP.
   */
  validateDestinationPort() {
    let val = parseInt(this.state.destinationPort);
    if (val >= 0 && val <= 65535) return true;
    this.setState(
      {
        destinationPortError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the entire UDP form.
   */
  validateUDPForm() {
    let flag = 0;
    if (this.state.sourcePort === "" && this.state.destinationPort === "") {
      this.setState(
        {
          emptyError: true,
        },
        () => {
          return false;
        }
      );
    } else {
    }

    if (this.state.sourcePort !== "") {
      flag = 1;
      if (!this.validateSourcePort()) return false;
    }

    if (this.state.destinationPort !== "") {
      flag = 1;
      if (!this.validateDestinationPort()) return false;
    }

    if (flag === 1) return true;
  }

  /*
   * Calculates UDP triplets.
   */
  calculateUDPTriplet() {
    let othersOffset = 0;

    /*
     * Calculates the base offset of UDP protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "UDP") break;
      else if (MY_GLOBAL.headersSelected[i] === "Ethernet") othersOffset += 14;
      else if (MY_GLOBAL.headersSelected[i] === "MPLS") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PW Control Word")
        othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PPPoE") othersOffset += 12;
      else if (MY_GLOBAL.headersSelected[i] === "IPv4") othersOffset += 20;
      else if (MY_GLOBAL.headersSelected[i] === "IPv6") othersOffset += 40;
      else if (MY_GLOBAL.headersSelected[i] === "Dot1q") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
    }

    let temp1 = "";
    let temp2 = "";
    let sourcePortOffset = 0 + othersOffset;
    let sourcePortValue = "";
    let sourcePortMask = "ffff";
    let destinationPortOffset = 2 + othersOffset;
    let destinationPortValue = "";
    let destinationPortMask = "ffff";
    let ans = "";

    if (this.state.sourcePort !== "") {
      sourcePortValue = parseInt(this.state.sourcePort).toString(16);
      if (sourcePortValue.length === 1 || sourcePortValue.length === 2) {
        sourcePortOffset += 1;
        sourcePortMask = "ff";
        if (sourcePortValue.length === 1) {
          temp1 = "0";
        }
      } else if (sourcePortValue.length === 3) {
        temp1 = "0";
      }

      ans +=
        "Source Port: Offset " +
        sourcePortOffset +
        " Value 0x" +
        temp1 +
        sourcePortValue +
        " Mask 0x" +
        sourcePortMask +
        "\n";
    }

    if (this.state.destinationPort !== "") {
      destinationPortValue = parseInt(this.state.destinationPort).toString(16);
      if (
        destinationPortValue.length === 1 ||
        destinationPortValue.length === 2
      ) {
        destinationPortOffset += 1;
        destinationPortMask = "ff";
        if (destinationPortValue.length === 1) temp2 = "0";
      } else if (destinationPortValue.length === 3) {
        temp2 = "0";
      }

      ans +=
        "Destination Port: Offset " +
        destinationPortOffset +
        " Value 0x" +
        temp2 +
        destinationPortValue +
        " Mask 0x" +
        destinationPortMask +
        "\n";
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleUDPSubmit() {
    this.setState(
      {
        udpSubmit: false,
        emptyError: false,
        sourcePortError: false,
        destinationPortError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateUDPForm()) {
          this.calculateUDPTriplet();
          this.setState({
            udpSubmit: true,
          });
        }
      }
    );
  }

  render() {
    return (
      <React.Fragment>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridSourcePort">
                <Form.Label>
                  Source Port{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range = [0,65535] </Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="sourcePort"
                  placeholder="Enter Source Port"
                  value={this.state.sourcePort}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridDestinationPort">
                <Form.Label>
                  Destination Port{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range = [0,65535] </Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destinationPort"
                  placeholder="Enter Destination Port"
                  value={this.state.destinationPort}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            {/* Display custom error messages based on the
             * values of error state variables.
             */}
            {this.state.emptyError ? (
              <small>
                <Alert variant="danger">All the fields can't be empty</Alert>
              </small>
            ) : null}
            {this.state.sourcePortError ? (
              <small>
                <Alert variant="danger">Invalid Source Port</Alert>
              </small>
            ) : null}
            {this.state.destinationPortError ? (
              <small>
                <Alert variant="danger">Invalid Destination Port</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleUDPSubmit();
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.udpSubmit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default UDPForm;
