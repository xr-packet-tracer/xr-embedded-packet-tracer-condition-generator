/*
 *------------------------------------------------------------------
 * Dot1qForm.js
 *
 * Renders the form for Dot1q protocol.
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
 * in the type field of Dot1q protocol.
 */
var typeDictionary = {
  IPv4: "0800",
  IPv6: "86dd",
  "MPLS Unicast": "8847",
  "MPLS Multicast": "8848",
  ARP: "0806",
  Dot1q: "8100",
  "PPPoE Discovery": "8863",
  "PPPoE Session": "8864",
};

export class Dot1qForm extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      dot1qSubmit: false,
      pcp: "",
      vid: "",
      type: "Select",
      otherType: "0x",
      emptyError: false,
      pcpError: false,
      vidError: false,
      otherTypeError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.validatePcp = this.validatePcp.bind(this);
    this.validateVid = this.validateVid.bind(this);
    this.validateOtherType = this.validateOtherType.bind(this);
    this.calculateDot1qTriplet = this.calculateDot1qTriplet.bind(this);
    this.validateDot1qForm = this.validateDot1qForm.bind(this);
    this.handleDot1qSubmit = this.handleDot1qSubmit.bind(this);
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
   * Handles changes in the type field.
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
   * Validates PCP field of Dot1q.
   */
  validatePcp() {
    let val = parseInt(this.state.pcp);
    if (val >= 0 && val <= 7) return true;
    this.setState(
      {
        pcpError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates VLAN ID field of Dot1q.
   */
  validateVid() {
    let val = parseInt(this.state.vid);
    if (val >= 1 && val <= 4094) return true;
    this.setState(
      {
        vidError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the Type field of Dot1q.
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
   * Validates the entire Dot1q form.
   */
  validateDot1qForm() {
    let flag = 0;
    if (
      (this.state.type === "Select" &&
        this.state.pcp === "" &&
        this.state.vid === "") ||
      (this.state.type === "Others" &&
        this.state.otherType === "" &&
        this.state.pcp === "" &&
        this.state.vid === "")
    ) {
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

    if (this.state.pcp !== "") {
      flag = 1;
      if (!this.validatePcp()) return false;
    }
    if (this.state.vid !== "") {
      flag = 1;
      if (!this.validateVid()) return false;
    }
    if (
      this.state.type !== "Select" &&
      !(this.state.type === "Others" && this.state.otherType === "")
    ) {
      flag = 1;
    }
    if (flag === 1) return true;
  }

  /*
   * Calculates Dot1q triplets.
   */
  calculateDot1qTriplet(index) {
    let othersOffset = 0;

    /*
     * Calculates the base offset of Dot1q protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "Dot1q" && i === index) break;
      else if (MY_GLOBAL.headersSelected[i] === "Dot1q") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "Ethernet") othersOffset += 14;
      else if (MY_GLOBAL.headersSelected[i] === "MPLS") othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PW Control Word")
        othersOffset += 4;
      else if (MY_GLOBAL.headersSelected[i] === "PPPoE") othersOffset += 12;
      else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
    }

    let tciOffset = 0 + othersOffset;
    let tciValue = "";
    let tciValueTemp = "";
    let tciMask = "";
    let typeOffset = 2 + othersOffset;
    let typeValue = "";
    let typeMask = "ffff";
    let ans = "";
    let flag = 0;

    if (this.state.pcp !== "" && this.state.vid !== "") {
      let temp1 = parseInt(this.state.pcp).toString(2) + "0";
      let temp2 = parseInt(this.state.vid).toString(2);
      for (let i = 0; i < 12 - temp2.length; i++) temp1 += "0";
      temp1 += temp2;
      tciValue = parseInt(temp1, 2).toString(16);
      tciMask = "efff";
    } else if (this.state.pcp !== "") {
      tciValue = parseInt(
        parseInt(this.state.pcp).toString(2) + "0",
        2
      ).toString(16);
      tciMask = "e";
    } else if (this.state.vid !== "") {
      tciValueTemp = parseInt(this.state.vid).toString(16);
      if (tciValueTemp.length === 1 || tciValueTemp.length === 2) {
        tciOffset += 1;
        flag = 1;
        if (tciValueTemp.length === 1) {
          tciValue = "0" + tciValueTemp;
          tciMask = "0f";
        } else {
          tciValue = tciValueTemp;
          tciMask = "ff";
        }
      } else {
        tciValue = "0" + tciValueTemp;
        tciMask = "0fff";
      }
    }

    if (this.state.type !== "Select") {
      if (this.state.type === "Others") {
        if (this.state.pcp !== "" || this.state.vid !== "") {
          if (flag === 1 || tciMask.length === 4) {
            ans +=
              " Dot1q: Offset " +
              tciOffset +
              " Value 0x" +
              tciValue +
              this.state.otherType.substr(2, this.state.type.length) +
              " Mask 0x" +
              tciMask +
              "ffff" +
              "\n";
          } else {
            ans +=
              " Dot1q: Offset " +
              tciOffset +
              " Value 0x" +
              tciValue +
              "000" +
              this.state.otherType.substr(2, this.state.type.length) +
              " Mask 0x" +
              tciMask +
              "000" +
              "ffff" +
              "\n";
          }
        } else {
          typeValue = this.state.otherType.substr(2, this.state.type.length);
          typeMask = "0xffff";
          ans +=
            " Dot1q: Offset " +
            typeOffset +
            " Value 0x" +
            typeValue +
            " Mask " +
            typeMask +
            "\n";
        }
      } else {
        if (this.state.pcp !== "" || this.state.vid !== "") {
          if (flag === 1 || tciMask.length === 4) {
            ans +=
              " Dot1q: Offset " +
              tciOffset +
              " Value 0x" +
              tciValue +
              typeDictionary[this.state.type] +
              " Mask 0x" +
              tciMask +
              "ffff" +
              "\n";
          } else {
            ans +=
              " Dot1q: Offset " +
              tciOffset +
              " Value 0x" +
              tciValue +
              "000" +
              typeDictionary[this.state.type] +
              " Mask 0x" +
              tciMask +
              "000" +
              "ffff" +
              "\n";
          }
        } else {
          typeValue = typeDictionary[this.state.type];
          typeMask = "0xffff";
          ans +=
            " Dot1q: Offset " +
            typeOffset +
            " Value 0x" +
            typeValue +
            " Mask " +
            typeMask +
            "\n";
        }
      }
    } else {
      if (this.state.pcp !== "" && this.state.vid === "") {
        ans +=
          " Dot1q: Offset " +
          tciOffset +
          " Value 0x" +
          tciValue +
          "0" +
          " Mask 0x" +
          tciMask +
          "0" +
          "\n";
      } else {
        ans +=
          " Dot1q: Offset " +
          tciOffset +
          " Value 0x" +
          tciValue +
          " Mask 0x" +
          tciMask +
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
  handleDot1qSubmit(index) {
    this.setState(
      {
        dot1qSubmit: false,
        emptyError: false,
        pcpError: false,
        vidError: false,
        otherTypeError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateDot1qForm()) {
          if (this.validateOtherType()) {
            this.calculateDot1qTriplet(index);
            this.setState({
              dot1qSubmit: true,
            });
          }
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
              <Form.Group as={Col} controlId="formGridPcp">
                <Form.Label>
                  PCP{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range:[0-7] </Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="pcp"
                  placeholder="Enter PCP Value"
                  value={this.state.pcp}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridVid">
                <Form.Label>
                  VLAN ID{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range: [1-4094]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="vid"
                  placeholder="Enter VLAN ID"
                  value={this.state.vid}
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
                        **Type** Enter Other type in hexadecimal format{" "}
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
            {this.state.emptyError ? (
              <small>
                <Alert variant="danger">All the fields can't be empty</Alert>
              </small>
            ) : null}
            {this.state.pcpError ? (
              <small>
                <Alert variant="danger">Invalid PCP value</Alert>
              </small>
            ) : null}
            {this.state.vidError ? (
              <small>
                <Alert variant="danger">Invalid VLAN ID</Alert>
              </small>
            ) : null}
            {this.state.otherTypeError ? (
              <small>
                <Alert variant="danger">Type not in standard format</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleDot1qSubmit(this.props.action);
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.dot1qSubmit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default Dot1qForm;
