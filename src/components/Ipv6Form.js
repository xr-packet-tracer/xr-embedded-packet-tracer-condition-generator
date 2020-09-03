/*
 *------------------------------------------------------------------
 * Ipv6Form.js
 *
 * Renders the form for IPv6 protocol.
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
import { Address6 } from "ip-address/ip-address";
import MY_GLOBAL from "./Globals";
import DisplayTriplets from "./DisplayTriplets";

export class Ipv6Form extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      ipv6Submit: false,
      selectedTos: "Select",
      sourceIP: "",
      sourceIPMask: "",
      destinationIP: "",
      destinationIPMask: "",
      tosIPPrecedenceValue: "0",
      tosDSCPValue: "0",
      emptyError: false,
      sourceIPError: false,
      sourceIPMaskError: false,
      sourceIPMaskEmptyError: false,
      destinationIPError: false,
      destinationIPMaskError: false,
      destinationIPMaskEmptyError: false,
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
    this.validateSourceIP = this.validateSourceIP.bind(this);
    this.validateSourceIPMask = this.validateSourceIPMask.bind(this);
    this.validateDestinationIP = this.validateDestinationIP.bind(this);
    this.validateDestinationIPMask = this.validateDestinationIPMask.bind(this);
    this.calculateIPv6Triplet = this.calculateIPv6Triplet.bind(this);
    this.validateIpv6Form = this.validateIpv6Form.bind(this);
    this.handleIpv6Submit = this.handleIpv6Submit.bind(this);
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
   * Handles change in selection of TOS field of IPv6
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
   * Validates Source IP field of IPv6.
   */
  validateSourceIP() {
    var address = new Address6(this.state.sourceIP.replace(/^\s+|\s+$/g, ""));
    if (address.isValid()) return true;
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
   * Validates Source IP Mask field of IPv6.
   */
  validateSourceIPMask() {
    var address = new Address6(
      this.state.sourceIPMask.replace(/^\s+|\s+$/g, "")
    );
    if (address.isValid()) {
      let mask1 = address.canonicalForm();
      let mask2 = mask1.replace(/:/g, "");
      let mask3 = mask2.replace(/^0+/, "");
      let mask4 = mask3.replace(/0+$/, "");
      if (mask4.length <= 24) return true;
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
   * Validates Destination IP field of IPv6.
   */
  validateDestinationIP() {
    var address = new Address6(
      this.state.destinationIP.replace(/^\s+|\s+$/g, "")
    );
    if (address.isValid()) return true;
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
   * Validates Destination IP Mask field of IPv6.
   */
  validateDestinationIPMask() {
    var address = new Address6(
      this.state.destinationIPMask.replace(/^\s+|\s+$/g, "")
    );
    if (address.isValid()) {
      let mask1 = address.canonicalForm();
      let mask2 = mask1.replace(/:/g, "");
      let mask3 = mask2.replace(/^0+/, "");
      let mask4 = mask3.replace(/0+$/, "");
      if (mask4.length <= 24) return true;
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
   * Validates the entire IPv6 form.
   */
  validateIpv6Form() {
    let flag = 0;
    let error1 = 0;
    let error2 = 0;
    if (
      this.state.selectedTos === "Select" &&
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
    } else if (this.state.sourceIP === "" && this.state.destinationIP === "") {
      return true;
    }

    if (this.state.sourceIP !== "") {
      if (this.state.sourceIPMask === "") {
        error1 = 1;
        this.setState({
          sourceIPMaskEmptyError: true,
        });
      } else {
        flag = 1;
        if (!this.validateSourceIP() || !this.validateSourceIPMask())
          return false;
      }
    }
    if (this.state.destinationIP !== "") {
      if (this.state.destinationIPMask === "") {
        error2 = 1;
        this.setState({
          destinationIPMaskEmptyError: true,
        });
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
   * Calculates IPv6 triplets.
   */
  calculateIPv6Triplet() {
    let othersOffset = 0;

    /*
     * Calculates the base offset of IPv6 protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "IPv6") break;
      else if (MY_GLOBAL.headersSelected[i] === "Ethernet") othersOffset += 14;
      else if (MY_GLOBAL.headersSelected[i] === "MPLS") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PW Control Word") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "PPPoE") {
        othersOffset += 12;
      } else if (MY_GLOBAL.headersSelected[i] === "IPv4") {
        othersOffset += 20;
      } else if (MY_GLOBAL.headersSelected[i] === "Dot1q") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
    }

    let tosOffset = 0 + othersOffset;
    let tosValue = "";
    let tosMask = "ff";
    let temp1 = "";
    let sourceIPOffset = 8 + othersOffset;
    let sourceIPValue = "";
    let sourceIPValueTemp = [];
    let sourceIPMask = "";
    let sourceIPMaskTemp = [];
    let destinationIPOffset = 24 + othersOffset;
    let destinationIPValue = "";
    let destinationIPValueTemp = [];
    let destinationIPMask = "";
    let destinationIPMaskTemp = [];
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
        "0" +
        temp1 +
        tosValue +
        "0" +
        " Mask 0x" +
        "0" +
        tosMask +
        "0" +
        "\n";
    }

    if (this.state.sourceIP !== "") {
      let sourceIPTemp1 = new Address6(
        this.state.sourceIP.replace(/^\s+|\s+$/g, "")
      );
      let sourceIPTemp2 = sourceIPTemp1.canonicalForm().replace(/:/g, "");
      let sourceIPTemp3 = new Address6(
        this.state.sourceIPMask.replace(/^\s+|\s+$/g, "")
      );
      let sourceIPTemp4 = sourceIPTemp3.canonicalForm().replace(/:/g, "");
      let sourceIPTemp5 = sourceIPTemp4.replace(/^0+/, "");
      let start = sourceIPTemp4.length - sourceIPTemp5.length;
      let sourceIPTemp6 = start / 2;
      sourceIPOffset += Math.floor(sourceIPTemp6);
      let sourceIPTemp7 = sourceIPTemp5.replace(/0+$/, "");
      if (sourceIPTemp6 !== Math.floor(sourceIPTemp6)) {
        start -= 1;
        sourceIPTemp7 = "0" + sourceIPTemp7;
      }

      sourceIPValueTemp = sourceIPTemp2
        .substr(start, sourceIPTemp7.length)
        .match(/.{1,8}/g);
      sourceIPMaskTemp = sourceIPTemp7.match(/.{1,8}/g);

      for (let i = 0; i < sourceIPValueTemp.length; i++) {
        sourceIPValue += sourceIPValueTemp[i];
        sourceIPMask += sourceIPMaskTemp[i];
        sourceIPValue = this.bitwiseAnd(sourceIPValue, sourceIPMask);
        ans +=
          "Source IP: Offset " +
          (sourceIPOffset + i * 4) +
          " Value 0x" +
          sourceIPValue +
          " Mask 0x" +
          sourceIPMask +
          "\n";
        sourceIPValue = "";
        sourceIPMask = "";
      }
    }

    if (this.state.destinationIP !== "") {
      let destinationIPTemp1 = new Address6(
        this.state.destinationIP.replace(/^\s+|\s+$/g, "")
      );
      let destinationIPTemp2 = destinationIPTemp1
        .canonicalForm()
        .replace(/:/g, "");
      let destinationIPTemp3 = new Address6(
        this.state.destinationIPMask.replace(/^\s+|\s+$/g, "")
      );
      let destinationIPTemp4 = destinationIPTemp3
        .canonicalForm()
        .replace(/:/g, "");
      let destinationIPTemp5 = destinationIPTemp4.replace(/^0+/, "");
      let start = destinationIPTemp4.length - destinationIPTemp5.length;
      let destinationIPTemp6 = start / 2;
      destinationIPOffset += Math.floor(destinationIPTemp6);
      let destinationIPTemp7 = destinationIPTemp5.replace(/0+$/, "");
      if (destinationIPTemp6 !== Math.floor(destinationIPTemp6)) {
        start -= 1;
        destinationIPTemp7 = "0" + destinationIPTemp7;
      }

      destinationIPValueTemp = destinationIPTemp2
        .substr(start, destinationIPTemp7.length)
        .match(/.{1,8}/g);
      destinationIPMaskTemp = destinationIPTemp7.match(/.{1,8}/g);

      for (let i = 0; i < destinationIPValueTemp.length; i++) {
        destinationIPValue += destinationIPValueTemp[i];
        destinationIPMask += destinationIPMaskTemp[i];
        destinationIPValue = this.bitwiseAnd(
          destinationIPValue,
          destinationIPMask
        );
        ans +=
          "Destination IP: Offset " +
          (destinationIPOffset + i * 4) +
          " Value 0x" +
          destinationIPValue +
          " Mask 0x" +
          destinationIPMask +
          "\n";
        destinationIPValue = "";
        destinationIPMask = "";
      }
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleIpv6Submit() {
    this.setState(
      {
        ipv6Submit: false,
        emptyError: false,
        sourceIPError: false,
        sourceIPMaskError: false,
        sourceIPMaskEmptyError: false,
        destinationIPError: false,
        destinationIPMaskError: false,
        destinationIPMaskEmptyError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateIpv6Form()) {
          this.calculateIPv6Triplet();
          this.setState({
            ipv6Submit: true,
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
              <Form.Group as={Col} controlId="formGridSourceIP">
                <Form.Label>
                  Source IP{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Format to be followed: x:x:x:x:x:x:x:x where
                        x=0000...ffff{" "}
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
                        Maximum 12 octets can be matched. Format to be followed:
                        x:x:x:x:x:x:x:x where x=0000...ffff{" "}
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
                        Format to be followed: x:x:x:x:x:x:x:x where
                        x=0000...ffff
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
                        Maximum 12 octets can be matched. Format to be followed:
                        x:x:x:x:x:x:x:x where x=0000...ffff{" "}
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
            {this.state.sourceIPMaskEmptyError ? (
              <small>
                <Alert variant="danger">Source IP Mask can't be empty</Alert>
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
            {this.state.destinationIPMaskEmptyError ? (
              <small>
                <Alert variant="danger">
                  Destination IP Mask can't be empty
                </Alert>
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
                this.handleIpv6Submit();
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.ipv6Submit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Ipv6Form;
