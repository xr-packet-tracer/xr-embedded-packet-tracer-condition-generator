/*
 *------------------------------------------------------------------
 * Ipv4Form.js
 *
 * Renders the form for IPv4 protocol.
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
  InputGroup,
  DropdownButton,
  Dropdown,
  Alert,
} from "react-bootstrap";
import { FaQuestion } from "react-icons/fa";
import DropdownItem from "react-bootstrap/DropdownItem";
import IPPrecedenceOptions from "./IPPrecedenceOptions";
import DSCPOptions from "./DSCPOptions";
import MY_GLOBAL from "./Globals";
import DisplayTriplets from "./DisplayTriplets";

export class Ipv4Form extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      ipv4Submit: false,
      selectedTos: "Select",
      protocol: "",
      sourceIP: "",
      sourceIPMask: "",
      destinationIP: "",
      destinationIPMask: "",
      tosIPPrecedenceValue: "0",
      tosDSCPValue: "0",
      emptyError: false,
      protocolError: false,
      sourceIPError: false,
      sourceIPMaskError: false,
      destinationIPError: false,
      destinationIPMaskError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.handleTosSelection = this.handleTosSelection.bind(this);
    this.handleTosIPPrecedenceValueChange = this.handleTosIPPrecedenceValueChange.bind(
      this
    );
    this.handleTosDSCPValueChange = this.handleTosDSCPValueChange.bind(this);
    this.validateProtocol = this.validateProtocol.bind(this);
    this.validateSourceIP = this.validateSourceIP.bind(this);
    this.validateSourceIPMask = this.validateSourceIPMask.bind(this);
    this.validateDestinationIP = this.validateDestinationIP.bind(this);
    this.validateDestinationIPMask = this.validateDestinationIPMask.bind(this);
    this.calculateIPv4Triplet = this.calculateIPv4Triplet.bind(this);
    this.validateIpv4Form = this.validateIpv4Form.bind(this);
    this.handleIpv4Submit = this.handleIpv4Submit.bind(this);
    this.bitwiseAnd = this.bitwiseAnd.bind(this);
  }

  /*
   * Performs bitwise AND operation.
   * Input: a, b
   * Output: ans <- a & b
   */
  bitwiseAnd(a, b) {
    let ans = "";
    for (let i = 0; i < a.length; i++) {
      let temp = parseInt("0x" + a.charAt(i)) & parseInt("0x" + b.charAt(i));
      if (temp >= 0 && temp <= 9) ans += temp;
      else if (temp === 10) ans += "a";
      else if (temp === 11) ans += "b";
      else if (temp === 12) ans += "c";
      else if (temp === 13) ans += "d";
      else if (temp === 14) ans += "e";
      else ans += "f";
    }
    return ans;
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
   * Handles change in selection of TOS field of IPv4
   */
  handleTosSelection(eventKey, event) {
    let options = ["Select", "IP Precedence", "DSCP"];
    this.setState({
      selectedTos: options[eventKey],
    });
  }

  /*
   * Handles change in IP Precedence option of the TOS field.
   */
  handleTosIPPrecedenceValueChange(e) {
    this.setState({
      tosIPPrecedenceValue: e.target.value,
    });
  }

  /*
   * Handles change in DSCP option of the TOS field.
   */
  handleTosDSCPValueChange(e) {
    this.setState({
      tosDSCPValue: e.target.value,
    });
  }

  /*
   * Vaidates Protocol field of IPv4.
   */
  validateProtocol() {
    let val = parseInt(this.state.protocol);
    if (val >= 0 && val <= 255) return true;
    this.setState(
      {
        protocolError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Vaidates Source IP field of IPv4.
   */
  validateSourceIP() {
    let regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    if (regex.test(this.state.sourceIP.replace(/^\s+|\s+$/g, ""))) {
      return true;
    }
    this.setState(
      {
        sourceIPError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Vaidates Source IP Mask field of IPv4.
   */
  validateSourceIPMask() {
    let regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    if (regex.test(this.state.sourceIPMask.replace(/^\s+|\s+$/g, ""))) {
      return true;
    }
    this.setState(
      {
        sourceIPMaskError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Vaidates Destination IP field of IPv4.
   */
  validateDestinationIP() {
    let regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    if (regex.test(this.state.destinationIP.replace(/^\s+|\s+$/g, ""))) {
      return true;
    }
    this.setState(
      {
        destinationIPError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Vaidates Destination IP Mask field of IPv4.
   */
  validateDestinationIPMask() {
    let regex = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    if (regex.test(this.state.destinationIPMask.replace(/^\s+|\s+$/g, ""))) {
      return true;
    }
    this.setState(
      {
        destinationIPMaskError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the entire IPv4 form.
   */
  validateIpv4Form() {
    let flag = 0;
    let error1 = 0;
    let error2 = 0;
    if (
      this.state.selectedTos === "Select" &&
      this.state.protocol === "" &&
      this.state.sourceIP === "" &&
      this.state.destinationIP === ""
    ) {
      this.setState(
        {
          emptyError: true,
        },
        () => {
          return false;
        }
      );
    } else if (
      this.state.protocol === "" &&
      this.state.sourceIP === "" &&
      this.state.destinationIP === ""
    ) {
      return true;
    }
    if (this.state.protocol !== "") {
      flag = 1;
      if (!this.validateProtocol()) return false;
    }
    if (this.state.sourceIP !== "") {
      if (this.state.sourceIPMask === "") {
        flag = 1;
        if (!this.validateSourceIP()) return false;
      } else {
        flag = 1;
        if (!this.validateSourceIP() || !this.validateSourceIPMask())
          return false;
      }
    }
    if (this.state.destinationIP !== "") {
      if (this.state.destinationIPMask === "") {
        flag = 1;
        if (!this.validateDestinationIP()) return false;
      } else {
        flag = 1;
        if (!this.validateDestinationIP() || !this.validateDestinationIPMask())
          return false;
      }
    }

    if (error1 === 1 || error2 === 1) return false;
    if (flag === 1) return true;
  }

  /*
   * Calculates IPv4 triplets.
   */
  calculateIPv4Triplet() {
    let othersOffset = 0;

    /*
     * Calculates the base offset of IPv4 protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "IPv4") break;
      else if (MY_GLOBAL.headersSelected[i] === "Ethernet") othersOffset += 14;
      else if (MY_GLOBAL.headersSelected[i] === "MPLS") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PW Control Word") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "PPPoE") {
        othersOffset += 12;
      } else if (MY_GLOBAL.headersSelected[i] === "Dot1q") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
    }

    let tosOffset = 1 + othersOffset;
    let tosValue = "";
    let tosMask = "ff";
    let temp1 = "";
    let temp2 = "";
    let protocolOffset = 9 + othersOffset;
    let protocolValue = "";
    let protocolMask = "ff";
    let sourceIPOffset = 12 + othersOffset;
    let sourceIPValue = "";
    let sourceIPMask = "";
    let destinationIPOffset = 16 + othersOffset;
    let destinationIPValue = "";
    let destinationIPMask = "";
    let ans = "";

    if (this.state.selectedTos !== "Select") {
      if (this.state.selectedTos === "IP Precedence") {
        tosValue = parseInt(this.state.tosIPPrecedenceValue).toString(16);
        ans += "IP Precedence: ";
      } else {
        tosValue = parseInt(this.state.tosDSCPValue).toString(16);
        ans += "DSCP: ";
      }
      if (tosValue.length === 1) temp1 = "0";
      ans +=
        "Offset " +
        tosOffset +
        " Value 0x" +
        temp1 +
        tosValue +
        " Mask 0x" +
        tosMask +
        "\n";
    }

    if (this.state.protocol !== "") {
      protocolValue = parseInt(this.state.protocol).toString(16);
      if (protocolValue.length === 1) temp2 = "0";
      ans +=
        "Protocol: Offset " +
        protocolOffset +
        " Value 0x" +
        temp2 +
        protocolValue +
        " Mask 0x" +
        protocolMask +
        "\n";
    }

    if (this.state.sourceIP !== "") {
      let sourceIPTemp1 = this.state.sourceIP
        .replace(/^\s+|\s+$/g, "")
        .split(".");
      let sourceIPTemp2;
      if (this.state.sourceIPMask !== "") {
        sourceIPTemp2 = this.state.sourceIPMask
          .replace(/^\s+|\s+$/g, "")
          .split(".");
      } else {
        sourceIPTemp2 = "255.255.255.255".split(".");
      }

      let i = 3;
      let count = 0;
      while (sourceIPTemp2[i] === "0") {
        count++;
        i--;
      }
      for (let j = 0; j < 4 - count; j++) {
        if (parseInt(sourceIPTemp1[j]).toString(16).length === 1) {
          sourceIPValue += "0";
        }
        sourceIPValue += parseInt(sourceIPTemp1[j]).toString(16);
        if (parseInt(sourceIPTemp2[j]).toString(16).length === 1) {
          sourceIPMask += "0";
        }
        sourceIPMask += parseInt(sourceIPTemp2[j]).toString(16);
      }

      sourceIPValue = this.bitwiseAnd(sourceIPValue, sourceIPMask);
      ans +=
        "Source IP: Offset " +
        sourceIPOffset +
        " Value 0x" +
        sourceIPValue +
        " Mask 0x" +
        sourceIPMask +
        "\n";
    }

    if (this.state.destinationIP !== "") {
      let destinationIPTemp1 = this.state.destinationIP
        .replace(/^\s+|\s+$/g, "")
        .split(".");
      let destinationIPTemp2;
      if (this.state.destinationIPMask !== "") {
        destinationIPTemp2 = this.state.destinationIPMask
          .replace(/^\s+|\s+$/g, "")
          .split(".");
      } else {
        destinationIPTemp2 = "255.255.255.255".split(".");
      }
      let i = 3;
      let count = 0;
      while (destinationIPTemp2[i] === "0") {
        count++;
        i--;
      }
      for (let j = 0; j < 4 - count; j++) {
        if (parseInt(destinationIPTemp1[j]).toString(16).length === 1) {
          destinationIPValue += "0";
        }
        destinationIPValue += parseInt(destinationIPTemp1[j]).toString(16);
        if (parseInt(destinationIPTemp2[j]).toString(16).length === 1) {
          destinationIPMask += "0";
        }
        destinationIPMask += parseInt(destinationIPTemp2[j]).toString(16);
      }

      destinationIPValue = this.bitwiseAnd(
        destinationIPValue,
        destinationIPMask
      );
      ans +=
        "Destination IP: Offset " +
        destinationIPOffset +
        " Value 0x" +
        destinationIPValue +
        " Mask 0x" +
        destinationIPMask +
        "\n";
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleIpv4Submit() {
    this.setState(
      {
        ipv4Submit: false,
        emptyError: false,
        protocolError: false,
        sourceIPError: false,
        sourceIPMaskError: false,
        destinationIPError: false,
        destinationIPMaskError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateIpv4Form()) {
          this.calculateIPv4Triplet();
          this.setState({
            ipv4Submit: true,
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
              <Form.Group as={Col} controlId="formGridToS">
                <Form.Label>
                  Type of Service{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>IP Precedence/DSCP</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <InputGroup>
                  <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={this.state.selectedTos}
                    onSelect={this.handleTosSelection}
                  >
                    <DropdownItem eventKey="0">-- Select --</DropdownItem>
                    <Dropdown.Item eventKey="1">IP Precedence</Dropdown.Item>
                    <Dropdown.Item eventKey="2">DSCP</Dropdown.Item>
                  </DropdownButton>
                  {this.state.selectedTos === "Select" ? (
                    <Form.Control disabled />
                  ) : this.state.selectedTos === "IP Precedence" ? (
                    <Form.Control
                      as="select"
                      onChange={this.handleTosIPPrecedenceValueChange}
                    >
                      <IPPrecedenceOptions />
                    </Form.Control>
                  ) : (
                    <Form.Control
                      as="select"
                      onChange={this.handleTosDSCPValueChange}
                    >
                      <DSCPOptions />
                    </Form.Control>
                  )}
                </InputGroup>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridProtocol">
                <Form.Label>
                  Protocol{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range = [0,255] </Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridProtocolValue">
                <Form.Control
                  type="text"
                  name="protocol"
                  placeholder="Enter Protocol number"
                  value={this.state.protocol}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridSourceIP">
                <Form.Label>
                  Source IP{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Format to be followed: x.x.x.x where x=[0,255]{" "}
                      </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="sourceIP"
                  placeholder="Enter Source IP"
                  value={this.state.sourceIP}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridSourceIPMask">
                <Form.Label>
                  Source IP Mask{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Format to be followed: x.x.x.x where x=[0,255]{" "}
                      </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="sourceIPMask"
                  placeholder="Source IP Mask"
                  value={this.state.sourceIPMask}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridDestinationIP">
                <Form.Label>
                  Destination IP{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Format to be followed: x.x.x.x where x=[0,255]
                      </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destinationIP"
                  placeholder="Enter Destination IP"
                  value={this.state.destinationIP}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridDestinationIPMask">
                <Form.Label>
                  Destination IP Mask{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Format to be followed: x.x.x.x where x=[0,255]{" "}
                      </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="destinationIPMask"
                  placeholder="Destination IP Mask"
                  value={this.state.destinationIPMask}
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
            {this.state.protocolError ? (
              <small>
                <Alert variant="danger">Invalid Protocol Number</Alert>
              </small>
            ) : null}
            {this.state.sourceIPError ? (
              <small>
                <Alert variant="danger">Invalid Source IP</Alert>
              </small>
            ) : null}
            {this.state.sourceIPMaskError ? (
              <small>
                <Alert variant="danger">Invalid Source IP Mask</Alert>
              </small>
            ) : null}
            {this.state.destinationIPError ? (
              <small>
                <Alert variant="danger">Invalid Destination IP</Alert>
              </small>
            ) : null}
            {this.state.destinationIPMaskError ? (
              <small>
                <Alert variant="danger">Invalid Destination IP Mask</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleIpv4Submit();
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.ipv4Submit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Ipv4Form;
