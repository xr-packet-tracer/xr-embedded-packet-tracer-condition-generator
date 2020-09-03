/*
 *------------------------------------------------------------------
 * EthernetForm.js
 *
 * Renders the form for Ethernet protocol.
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
  InputGroup,
  DropdownButton,
  Dropdown,
  DropdownItem,
  Tooltip,
  Alert,
} from "react-bootstrap";
import { FaQuestion } from "react-icons/fa";
import MY_GLOBAL from "./Globals";
import DisplayTriplets from "./DisplayTriplets";

/*
 * Dictionary consisting of hexadecimal values for all the options available
 * in the type field of Ethernet protocol.
 */
var ethernetTypeDictionary = {
  IPv4: "0x0800",
  IPv6: "0x86dd",
  "MPLS Unicast": "0x8847",
  "MPLS Multicast": "0x8848",
  ARP: "0x0806",
  Dot1q: "0x8100",
  "PPPoE Discovery": "0x8863",
  "PPPoE Session": "0x8864",
};

class EthernetForm extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      ethernetSubmit: false,
      dmac: "",
      smac: "",
      dmacMask: "",
      smacMask: "",
      type: "Select",
      otherType: "0x",
      dmacError: false,
      dmacMaskError: false,
      dmacMaskEmptyError: false,
      smacError: false,
      smacMaskError: false,
      smacMaskEmptyError: false,
      otherTypeError: false,
      emptyError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.validateDmac = this.validateDmac.bind(this);
    this.validateSmac = this.validateSmac.bind(this);
    this.validateDmacMask = this.validateDmacMask.bind(this);
    this.validateSmacMask = this.validateSmacMask.bind(this);
    this.validateOtherType = this.validateOtherType.bind(this);
    this.validateEthernetForm = this.validateEthernetForm.bind(this);
    this.handleEthernetSubmit = this.handleEthernetSubmit.bind(this);
    this.calculateEthernetTriplet = this.calculateEthernetTriplet.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
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
   * Validates DMAC field of Ethernet.
   */
  validateDmac() {
    let regex = /^[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}$/;
    if (regex.test(this.state.dmac.replace(/^\s+|\s+$/g, ""))) return true;
    this.setState(
      {
        dmacError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates SMAC field of Ethernet.
   */
  validateSmac() {
    let regex = /^[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}$/;
    if (regex.test(this.state.smac.replace(/^\s+|\s+$/g, ""))) return true;
    this.setState(
      {
        smacError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates DMAC Mask field of Ethernet.
   */
  validateDmacMask() {
    let regex = /^[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}$/;
    if (regex.test(this.state.dmacMask.replace(/^\s+|\s+$/g, ""))) {
      let mask = this.state.dmacMask.toString().replace(/^\s+|\s+$/g, "");
      let mask1 = mask.replace(/\./g, "");
      let mask2 = mask1.replace(/^0+/, "");
      let mask3 = mask2.replace(/0+$/, "");
      if (mask3.length <= 8) return true;
    }
    this.setState(
      {
        dmacMaskError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates SMAC Mask field of Ethernet.
   */
  validateSmacMask() {
    let regex = /^[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}\.[a-fA-F0-9]{4}$/;
    if (regex.test(this.state.smacMask.replace(/^\s+|\s+$/g, ""))) {
      let mask = this.state.smacMask.toString().replace(/^\s+|\s+$/g, "");
      let mask1 = mask.replace(/\./g, "");
      let mask2 = mask1.replace(/^0+/, "");
      let mask3 = mask2.replace(/0+$/, "");
      if (mask3.length <= 8) return true;
    }
    this.setState(
      {
        smacMaskError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Handles change in Type field of Ethernet.
   */
  handleTypeChange(eventKey, event) {
    let options = [
      "Select",
      "IPv4",
      "IPv6",
      "MPLS Unicast",
      "MPLS Multicast",
      "ARP",
      "Dot1q",
      "PPPoE Discovery",
      "PPPoE Session",
      "Others",
    ];
    this.setState({
      type: options[eventKey],
    });
  }

  /*
   * Validates Type field of Ethernet.
   */
  validateOtherType() {
    if (this.state.type !== "Others") {
      return true;
    }
    if (!isNaN(parseInt(this.state.otherType))) {
      return true;
    }
    this.setState(
      {
        otherTypeError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the entire Ethernet form.
   */
  validateEthernetForm() {
    if (
      (this.state.dmac === "" &&
        this.state.smac === "" &&
        this.state.type === "Select") ||
      (this.state.dmac === "" &&
        this.state.smac === "" &&
        this.state.type === "Others" &&
        this.state.otherType === "")
    ) {
      this.setState(
        {
          emptyError: true,
        },
        () => {
          return false;
        }
      );
    } else if (this.state.dmac !== "") {
      if (this.state.dmacMask === "") {
        this.setState(
          {
            dmacMaskEmptyError: true,
          },
          () => {
            return false;
          }
        );
      } else if (this.state.smac === "") {
        if (this.validateDmac() && this.validateDmacMask()) return true;
      } else if (this.state.smacMask !== "") {
        if (
          this.validateDmac() &&
          this.validateDmacMask() &&
          this.validateSmac() &&
          this.validateSmacMask()
        )
          return true;
        else return false;
      } else {
        this.setState(
          {
            smacMaskEmptyError: true,
          },
          () => {
            return false;
          }
        );
      }
    } else if (this.state.smac !== "") {
      if (this.state.smacMask === "") {
        this.setState(
          {
            smacMaskEmptyError: true,
          },
          () => {
            return false;
          }
        );
      } else if (this.validateSmac() && this.validateSmacMask()) return true;
      else return false;
    } else if (this.state.type !== "") return true;
    return false;
  }

  /*
   * Calculates Ethernet triplets.
   */
  calculateEthernetTriplet(index) {
    let othersOffset = 0;

    /*
     * Calculates the base offset of Ethernet protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "Ethernet" && i === index) break;
      else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
      else if (MY_GLOBAL.headersSelected[i] === "MPLS") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "PW Control Word") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "PPPoE") {
        othersOffset += 12;
      } else {
        othersOffset += 14;
      }
    }

    let dmacOffset = 0 + othersOffset;
    let dmacValue = "";
    let dmacMask = "";
    let smacOffset = 6 + othersOffset;
    let smacValue = "";
    let smacMask = "";
    let typeOffset = 12 + othersOffset;
    let typeValue = "";
    let typeMask = "";
    let ans = "";

    if (this.state.dmac !== "") {
      let dmacString1 = this.state.dmac
        .toString()
        .replace(/^\s+|\s+$/g, "")
        .replace(/\./g, "");
      let dmacString2 = this.state.dmacMask
        .toString()
        .replace(/^\s+|\s+$/g, "")
        .replace(/\./g, "");
      let dmacString3 = dmacString2.replace(/^0+/, "");
      let start = dmacString2.toString().length - dmacString3.toString().length;
      let dmacString4 =
        (dmacString2.toString().length - dmacString3.toString().length) / 2;
      dmacOffset += Math.floor(dmacString4);
      let dmacString5 = dmacString3.replace(/0+$/, "");
      let end = dmacString3.toString().length - dmacString5.toString().length;
      if (dmacString4 !== Math.floor(dmacString4)) {
        dmacMask += "0";
        start -= 1;
      }
      for (let i = start; i <= 11 - end; i++)
        dmacValue += dmacString1.charAt(i).toLowerCase();
      dmacMask += dmacString5;

      dmacValue = this.bitwiseAnd(dmacValue, dmacMask);
      ans +=
        "DMAC: Offset " +
        dmacOffset +
        " Value 0x" +
        dmacValue +
        " Mask 0x" +
        dmacMask +
        "\n";
    }
    if (this.state.smac !== "") {
      let smacString1 = this.state.smac
        .toString()
        .replace(/^\s+|\s+$/g, "")
        .replace(/\./g, "");
      let smacString2 = this.state.smacMask
        .toString()
        .replace(/^\s+|\s+$/g, "")
        .replace(/\./g, "");
      let smacString3 = smacString2.replace(/^0+/, "");
      let start = smacString2.toString().length - smacString3.toString().length;
      let smacString4 =
        (smacString2.toString().length - smacString3.toString().length) / 2;
      smacOffset += Math.floor(smacString4);
      let smacString5 = smacString3.replace(/0+$/, "");
      let end = smacString3.toString().length - smacString5.toString().length;
      if (smacString4 !== Math.floor(smacString4)) {
        smacMask += "0";
        start -= 1;
      }
      for (let i = start; i <= 11 - end; i++)
        smacValue += smacString1.charAt(i).toLowerCase();
      smacMask += smacString5;

      smacValue = this.bitwiseAnd(smacValue, smacMask);
      ans +=
        "SMAC: Offset " +
        smacOffset +
        " Value 0x" +
        smacValue +
        " Mask 0x" +
        smacMask +
        "\n";
    }

    if (this.state.type !== "Select") {
      if (this.state.type === "Others") {
        typeMask = "0xffff";
        ans +=
          " Type: Offset " +
          typeOffset +
          " Value " +
          this.state.otherType +
          " Mask " +
          typeMask +
          "\n";
      } else {
        typeValue = ethernetTypeDictionary[this.state.type];
        typeMask = "0xffff";
        ans +=
          " Type: Offset " +
          typeOffset +
          " Value " +
          typeValue +
          " Mask " +
          typeMask +
          "\n";
      }
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleEthernetSubmit(index) {
    this.setState(
      {
        ethernetSubmit: false,
        dmacError: false,
        dmacMaskError: false,
        dmacMaskEmptyError: false,
        smacError: false,
        smacMaskError: false,
        smacMaskEmptyError: false,
        otherTypeError: false,
        emptyError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateEthernetForm()) {
          if (this.validateOtherType()) {
            this.calculateEthernetTriplet(index);
            this.setState({
              ethernetSubmit: true,
            });
          }
        }
      }
    );
  }

  render(props) {
    return (
      <React.Fragment>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridDMAC">
                <Form.Label>
                  DMAC{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>Format to be followed: xxxx.xxxx.xxxx </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="dmac"
                  placeholder="Enter DMAC"
                  value={this.state.dmac}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridDMACMask">
                <Form.Label>
                  DMAC Mask{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Maximum 4 consecutive octets can be matched. Format to
                        be followed: xxxx.xxxx.xxxx{" "}
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
                  name="dmacMask"
                  placeholder="DMAC Mask"
                  value={this.state.dmacMask}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridSMAC">
                <Form.Label>
                  SMAC{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>Format to be followed: xxxx.xxxx.xxxx </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="smac"
                  placeholder="Enter SMAC"
                  value={this.state.smac}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridSMACMask">
                <Form.Label>
                  SMAC Mask{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Maximum 4 consecutive octets can be matched. Format to
                        be followed: xxxx.xxxx.xxxx{" "}
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
                  name="smacMask"
                  placeholder="SMAC Mask"
                  value={this.state.smacMask}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridType">
                <Form.Label>
                  Type{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        **Ethernet Type** Enter Other type in hexadecimal format{" "}
                      </Tooltip>
                    }
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTypeValue">
                <InputGroup>
                  <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title={this.state.type}
                    onSelect={this.handleTypeChange}
                  >
                    <DropdownItem eventKey="0">-- Select --</DropdownItem>
                    <Dropdown.Item eventKey="1">IPv4</Dropdown.Item>
                    <Dropdown.Item eventKey="2">IPv6</Dropdown.Item>
                    <Dropdown.Item eventKey="3">MPLS Unicast</Dropdown.Item>
                    <Dropdown.Item eventKey="4">MPLS Multicast</Dropdown.Item>
                    <Dropdown.Item eventKey="5">ARP</Dropdown.Item>
                    <Dropdown.Item eventKey="6">Dot1q</Dropdown.Item>
                    <Dropdown.Item eventKey="7">PPPoE Discovery</Dropdown.Item>
                    <Dropdown.Item eventKey="8">PPPoE Session</Dropdown.Item>
                    <Dropdown.Item eventKey="9">Others</Dropdown.Item>
                  </DropdownButton>
                  {this.state.type === "Others" ? (
                    <Form.Control
                      type="text"
                      name="otherType"
                      placeholder="Enter Other type"
                      value={this.state.otherType}
                      onChange={this.handleChange}
                    />
                  ) : (
                    <Form.Control disabled />
                  )}
                </InputGroup>
              </Form.Group>
            </Form.Row>
            {/* Display custom error messages based on the
             * values of error state variables.
             */}
            {this.state.dmacMaskEmptyError ? (
              <small>
                <Alert variant="danger">DMAC Mask can't be empty</Alert>
              </small>
            ) : null}
            {this.state.smacMaskEmptyError ? (
              <small>
                <Alert variant="danger">SMAC Mask can't be empty</Alert>
              </small>
            ) : null}
            {this.state.dmacError ? (
              <small>
                <Alert variant="danger">DMAC not in standard format</Alert>
              </small>
            ) : null}
            {this.state.smacError ? (
              <small>
                <Alert variant="danger">SMAC not in standard format</Alert>
              </small>
            ) : null}
            {this.state.dmacMaskError ? (
              <small>
                <Alert variant="danger">DMAC Mask not in standard format</Alert>
              </small>
            ) : null}
            {this.state.smacMaskError ? (
              <small>
                <Alert variant="danger">SMAC Mask not in standard format</Alert>
              </small>
            ) : null}
            {this.state.otherTypeError ? (
              <small>
                <Alert variant="danger">Type not in standard format</Alert>
              </small>
            ) : null}
            {this.state.emptyError ? (
              <small>
                <Alert variant="danger">All the fields can't be empty</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleEthernetSubmit(this.props.action);
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.ethernetSubmit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default EthernetForm;
