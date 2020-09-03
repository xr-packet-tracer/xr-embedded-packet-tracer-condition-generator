/*
 *------------------------------------------------------------------
 * TCPForm.js
 *
 * Renders the form for TCP protocol.
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

export class TCPForm extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      tcpSubmit: false,
      sourcePort: "",
      destinationPort: "",
      ack: 0,
      psh: 0,
      rst: 0,
      syn: 0,
      fin: 0,
      emptyError: false,
      sourcePortError: false,
      destinationPortError: false,
      flagError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.validateSourcePort = this.validateSourcePort.bind(this);
    this.validateDestinationPort = this.validateDestinationPort.bind(this);
    this.handleAck = this.handleAck.bind(this);
    this.handlePsh = this.handlePsh.bind(this);
    this.handleRst = this.handleRst.bind(this);
    this.handleSyn = this.handleSyn.bind(this);
    this.handleFin = this.handleFin.bind(this);
    this.calculateTCPTriplet = this.calculateTCPTriplet.bind(this);
    this.validateTCPForm = this.validateTCPForm.bind(this);
    this.handleTCPSubmit = this.handleTCPSubmit.bind(this);
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
   * Handles ACK flag of TCP.
   */
  handleAck() {
    if (this.state.ack === 0) {
      this.setState({
        ack: 1,
      });
    } else {
      this.setState({
        ack: 0,
      });
    }
  }

  /*
   * Handles PSH flag of TCP.
   */
  handlePsh() {
    if (this.state.psh === 0) {
      this.setState({
        psh: 1,
      });
    } else {
      this.setState({
        psh: 0,
      });
    }
  }

  /*
   * Handles RST flag of TCP.
   */
  handleRst() {
    if (this.state.rst === 0) {
      this.setState({
        rst: 1,
      });
    } else {
      this.setState({
        rst: 0,
      });
    }
  }

  /*
   * Handles SYN flag of TCP.
   */
  handleSyn() {
    if (this.state.syn === 0) {
      this.setState({
        syn: 1,
      });
    } else {
      this.setState({
        syn: 0,
      });
    }
  }

  /*
   * Handles FIN flag of TCP.
   */
  handleFin() {
    if (this.state.fin === 0) {
      this.setState({
        fin: 1,
      });
    } else {
      this.setState({
        fin: 0,
      });
    }
  }

  /*
   * Validates Source Port field of TCP.
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
   * Validates Destination Port field of TCP.
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
   * Validates the entire TCP form.
   */
  validateTCPForm() {
    let flag = 0;
    let error1 = 0,
      error2 = 0;
    if (
      this.state.sourcePort === "" &&
      this.state.destinationPort === "" &&
      this.state.ack === 0 &&
      this.state.psh === 0 &&
      this.state.rst === 0 &&
      this.state.syn === 0 &&
      this.state.fin === 0
    ) {
      error1 = 1;
      this.setState(
        {
          emptyError: true,
        },
        () => {
          return false;
        }
      );
    } else if (
      (this.state.syn === 1 && this.state.fin === 1) ||
      (this.state.syn === 1 && this.state.rst === 1) ||
      (this.state.syn === 1 && this.state.psh === 1) ||
      (this.state.fin === 1 && this.state.rst === 1)
    ) {
      error2 = 1;
      this.setState({
        flagError: true,
      });
    }

    if (error1 === 1 || error2 === 1) return false;

    if (this.state.sourcePort === "" && this.state.destinationPort === "")
      return true;

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
   * Calculates TCP triplets.
   */
  calculateTCPTriplet() {
    let othersOffset = 0;

    /*
     * Calculates the base offset of TCP protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "TCP") break;
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
    let temp3 = "";
    let sourcePortOffset = 0 + othersOffset;
    let sourcePortValue = "";
    let sourcePortMask = "ffff";
    let destinationPortOffset = 2 + othersOffset;
    let destinationPortValue = "";
    let destinationPortMask = "ffff";
    let flagOffset = 13 + othersOffset;
    let flagValue = "";
    let flagMask = "";
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

    if (
      this.state.ack === 1 ||
      this.state.psh === 1 ||
      this.state.rst === 1 ||
      this.state.syn === 1 ||
      this.state.fin === 1
    ) {
      flagValue += parseInt(
        "000" +
          this.state.ack.toString() +
          this.state.psh.toString() +
          this.state.rst.toString() +
          this.state.syn.toString() +
          this.state.fin.toString(),
        2
      ).toString(16);

      if (flagValue.length === 1) temp3 = "0";

      flagMask += flagValue;

      ans +=
        "Flags: Offset " +
        flagOffset +
        " Value 0x" +
        temp3 +
        flagValue +
        " Mask 0x" +
        temp3 +
        flagMask +
        "\n";
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleTCPSubmit() {
    this.setState(
      {
        tcpSubmit: false,
        emptyError: false,
        sourcePortError: false,
        destinationPortError: false,
        flagError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateTCPForm()) {
          this.calculateTCPTriplet();
          this.setState({
            tcpSubmit: true,
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
            <Form.Row>
              <Form.Group as={Col} controlId="formGridFlags">
                <Form.Label>
                  Flags{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>TCP Flags</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridFlags">
                <Form.Check
                  inline
                  label="ACK"
                  id="ACK"
                  type="checkbox"
                  name="ACK"
                  onClick={this.handleAck}
                />
                <Form.Check
                  inline
                  label="PSH"
                  id="PSH"
                  type="checkbox"
                  name="PSH"
                  onClick={this.handlePsh}
                />
                <Form.Check
                  inline
                  label="RST"
                  id="RST"
                  type="checkbox"
                  name="RST"
                  onClick={this.handleRst}
                />
                <Form.Check
                  inline
                  label="SYN"
                  id="SYN"
                  type="checkbox"
                  name="SYN"
                  onClick={this.handleSyn}
                />
                <Form.Check
                  inline
                  label="FIN"
                  id="FIN"
                  type="checkbox"
                  name="FIN"
                  onClick={this.handleFin}
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
            {this.state.flagError ? (
              <small>
                <Alert variant="danger">
                  Infeasible combination of flags selected
                </Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleTCPSubmit();
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.tcpSubmit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default TCPForm;
