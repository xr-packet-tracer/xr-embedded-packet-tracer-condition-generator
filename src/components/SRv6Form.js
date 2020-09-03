/*
 *------------------------------------------------------------------
 * SRv6Form.js
 *
 * Renders the form for SRv6 protocol.
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
import DisplayTriplets from "./DisplayTriplets";
import MY_GLOBAL from "./Globals";

/*
 * Dictionary consisting of hexadecimal values for all the options available
 * in the Next Header field of SRv6 protocol.
 */
var srv6NextHeaderDictionary = {
  HOPOPT: "00",
  ICMP: "01",
  IGMP: "02",
  IPv4: "04",
  TCP: "06",
  UDP: "11",
  IPv6: "29",
  "IPv6-Route": "2b",
  "IPv6-Frag": "2c",
};

export class SRv6Form extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      srv6Submit: false,
      nextHeader: "Select",
      nextHeaderOther: "",
      hdrExtLen: "",
      routingType: false,
      segmentsLeft: "",
      flags: "",
      tag: "",
      emptyError: false,
      mandatoryError: false,
      nextHeaderOtherError: false,
      hdrExtLenError: false,
      segmentsLeftError: false,
      flagsError: false,
      tagError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.handleNextHeaderChange = this.handleNextHeaderChange.bind(this);
    this.handleRoutingType = this.handleRoutingType.bind(this);
    this.validateNextHeaderOther = this.validateNextHeaderOther.bind(this);
    this.validateHdrExtLen = this.validateHdrExtLen.bind(this);
    this.validateSegmentsLeft = this.validateSegmentsLeft.bind(this);
    this.validateFlags = this.validateFlags.bind(this);
    this.validateTag = this.validateTag.bind(this);
    this.calculateSRv6Triplet = this.calculateSRv6Triplet.bind(this);
    this.validateSRv6Form = this.validateSRv6Form.bind(this);
    this.validateSRv6FormLastOnStack = this.validateSRv6FormLastOnStack.bind(
      this
    );
    this.handleSRv6Submit = this.handleSRv6Submit.bind(this);
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
   * Handles change in Next Header field of SRv6.
   */
  handleNextHeaderChange(eventKey, event) {
    let options = [
      "Select",
      "HOPOPT",
      "ICMP",
      "IGMP",
      "IPv4",
      "TCP",
      "UDP",
      "IPv6",
      "IPv6-Route",
      "IPv6-Frag",
      "Others",
    ];
    this.setState({
      nextHeader: options[eventKey],
    });
  }

  /*
   * Handles change in Routing Type field of SRv6.
   */
  handleRoutingType() {
    this.setState((prevState) => ({
      routingType: !prevState.routingType,
    }));
  }

  /*
   * Validates Next Header field of SRv6.
   */
  validateNextHeaderOther() {
    let val = parseInt(this.state.nextHeaderOther);
    if (val >= 0 && val <= 255) return true;
    this.setState(
      {
        nextHeaderOtherError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates Header Extension field of SRv6.
   */
  validateHdrExtLen() {
    let val = parseInt(this.state.hdrExtLen);
    if (val >= 0 && val <= 255) return true;
    this.setState(
      {
        hdrExtLenError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates Segments Left field of SRv6.
   */
  validateSegmentsLeft() {
    let val = parseInt(this.state.segmentsLeft);
    if (val >= 0 && val <= 255) return true;
    this.setState(
      {
        segmentsLeftError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates Flags field of SRv6.
   */
  validateFlags() {
    let val = parseInt(this.state.flags);
    if (val >= 0 && val <= 255) return true;
    this.setState(
      {
        flagsError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates Tag field of SRv6.
   */
  validateTag() {
    let val = parseInt(this.state.tag);
    if (val >= 0 && val <= 65535) return true;
    this.setState(
      {
        tagError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the entire SRv6 form.
   */
  validateSRv6Form() {
    let flag1 = 0;
    let flag2 = 0;

    if (this.state.hdrExtLen === "") {
      flag1 = 1;
      this.setState(
        {
          mandatoryError: true,
        },
        () => {
          return false;
        }
      );
    }

    if (flag1 === 1) {
      return false;
    } else {
      flag2 = 1;
      if (!this.validateHdrExtLen()) return false;
    }

    if (this.state.nextHeader === "Others") {
      flag2 = 1;
      if (!this.validateNextHeaderOther()) return false;
    }

    if (this.state.segmentsLeft !== "") {
      flag2 = 1;
      if (!this.validateSegmentsLeft()) return false;
    }

    if (this.state.flags !== "") {
      flag2 = 1;
      if (!this.validateFlags()) return false;
    }

    if (this.state.tag !== "") {
      flag2 = 1;
      if (!this.validateTag()) return false;
    }

    if (flag2 === 1) return true;
  }

  validateSRv6FormLastOnStack() {
    let flag2 = 0;

    if (
      this.state.nextHeader === "Select" &&
      this.state.hdrExtLen === "" &&
      this.state.routingType === false &&
      this.state.segmentsLeft === "" &&
      this.state.flags === "" &&
      this.state.tag === ""
    ) {
      this.setState(
        {
          emptyError: true,
        },
        () => {
          return false;
        }
      );
    }

    if (
      this.state.nextHeader !== "Select" &&
      this.state.nextHeader !== "Others"
    ) {
      flag2 = 1;
    }

    if (this.state.nextHeader === "Others") {
      flag2 = 1;
      if (!this.validateNextHeaderOther()) return false;
    }

    if (this.state.hdrExtLen !== "") {
      flag2 = 1;
      if (!this.validateHdrExtLen()) return false;
    }

    if (this.state.segmentsLeft !== "") {
      flag2 = 1;
      if (!this.validateSegmentsLeft()) return false;
    }

    if (this.state.flags !== "") {
      flag2 = 1;
      if (!this.validateFlags()) return false;
    }

    if (this.state.tag !== "") {
      flag2 = 1;
      if (!this.validateTag()) return false;
    }

    if (this.state.routingType === true) {
      flag2 = 1;
    }

    if (flag2 === 1) return true;
  }

  /*
   * Calculates SRv6 triplets.
   */
  calculateSRv6Triplet(index) {
    let othersOffset = 0;

    /*
     * Calculates the base offset of SRv6 protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "SRv6" && i === index) break;
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

    if (index !== MY_GLOBAL.headersSelected.length - 1) {
      MY_GLOBAL.srv6Length[index] = this.state.hdrExtLen * 8 + 8;
    }

    let nextHeaderOffset = 0 + othersOffset;
    let nextHeaderValue = "";
    let nextHeaderMask = "ff";
    let hdrExtLenOffset = 1 + othersOffset;
    let hdrExtLenValue = "";
    let hdrExtLenMask = "ff";
    let routingTypeOffset = 2 + othersOffset;
    let routingTypeValue = "04";
    let routingTypeMask = "ff";
    let segmentsLeftOffset = 3 + othersOffset;
    let segmentsLeftValue = "";
    let segmentsLeftMask = "ff";
    let flagsOffset = 5 + othersOffset;
    let flagsValue = "";
    let flagsMask = "ff";
    let tagOffset = 6 + othersOffset;
    let tagValue = "";
    let tagMask = "ffff";
    let ans = "";

    if (this.state.nextHeader !== "Select") {
      if (this.state.nextHeader === "Others") {
        nextHeaderValue = parseInt(this.state.nextHeaderOther).toString(16);
        if (nextHeaderValue.length === 1) {
          nextHeaderValue = "0" + nextHeaderValue;
        }
      } else {
        nextHeaderValue = srv6NextHeaderDictionary[this.state.nextHeader];
      }
      ans +=
        "Next Header: Offset " +
        nextHeaderOffset +
        " Value 0x" +
        nextHeaderValue +
        " Mask 0x" +
        nextHeaderMask +
        "\n";
    }

    if (this.state.hdrExtLen !== "") {
      hdrExtLenValue = parseInt(this.state.hdrExtLen).toString(16);
      if (hdrExtLenValue.length === 1) {
        hdrExtLenValue = "0" + hdrExtLenValue;
      }
      ans +=
        "Header Ext Length: Offset " +
        hdrExtLenOffset +
        " Value 0x" +
        hdrExtLenValue +
        " Mask 0x" +
        hdrExtLenMask +
        "\n";
    }

    if (this.state.routingType === true) {
      ans +=
        "Routing Type: Offset " +
        routingTypeOffset +
        " Value 0x" +
        routingTypeValue +
        " Mask 0x" +
        routingTypeMask +
        "\n";
    }

    if (this.state.segmentsLeft !== "") {
      segmentsLeftValue = parseInt(this.state.segmentsLeft).toString(16);
      if (segmentsLeftValue.length === 1) {
        segmentsLeftValue = "0" + segmentsLeftValue;
      }
      ans +=
        "Segments Left: Offset " +
        segmentsLeftOffset +
        " Value 0x" +
        segmentsLeftValue +
        " Mask 0x" +
        segmentsLeftMask +
        "\n";
    }

    if (this.state.flags !== "") {
      flagsValue = parseInt(this.state.flags).toString(16);
      if (flagsValue.length === 1) {
        flagsValue = "0" + flagsValue;
      }
      ans +=
        "Flags: Offset " +
        flagsOffset +
        " Value 0x" +
        flagsValue +
        " Mask 0x" +
        flagsMask +
        "\n";
    }

    if (this.state.tag !== "") {
      tagValue = parseInt(this.state.tag).toString(16);
      if (tagValue.length === 1 || tagValue.length === 2) {
        if (tagValue.length === 1) {
          tagValue = "0" + tagValue;
        }
        tagOffset += 1;
        tagMask = "ff";
      } else {
        if (tagValue.length === 3) {
          tagValue = "0" + tagValue;
        }
      }
      ans +=
        "Tag: Offset " +
        tagOffset +
        " Value 0x" +
        tagValue +
        " Mask 0x" +
        tagMask +
        "\n";
    }

    this.setState({
      tripletValue: ans,
    });
  }

  /*
   * Handles click of Submit button
   */
  handleSRv6Submit(index) {
    this.setState(
      {
        srv6Submit: false,
        emptyError: false,
        mandatoryError: false,
        nextHeaderOtherError: false,
        hdrExtLenError: false,
        segmentsLeftError: false,
        flagsError: false,
        tagError: false,
        tripletValue: "",
      },
      () => {
        if (index === MY_GLOBAL.headersSelected.length - 1) {
          if (this.validateSRv6FormLastOnStack()) {
            this.calculateSRv6Triplet(index);
            this.setState({
              srv6Submit: true,
            });
          }
        } else {
          if (this.validateSRv6Form()) {
            this.calculateSRv6Triplet(index);
            this.setState({
              srv6Submit: true,
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
              <Form.Group as={Col} controlId="formGridNextHeader">
                <Form.Label>
                  Next Header{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                      <Tooltip>
                        Valid range of other header type: [0-255]{" "}
                      </Tooltip>
                    }
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
                    title={this.state.nextHeader}
                    onSelect={this.handleNextHeaderChange}
                  >
                    <DropdownItem eventKey="0">-- Select --</DropdownItem>
                    <Dropdown.Item eventKey="1">HOPOPT</Dropdown.Item>
                    <Dropdown.Item eventKey="2">ICMP</Dropdown.Item>
                    <Dropdown.Item eventKey="3">IGMP</Dropdown.Item>
                    <Dropdown.Item eventKey="4">IPv4</Dropdown.Item>
                    <Dropdown.Item eventKey="5">TCP</Dropdown.Item>
                    <Dropdown.Item eventKey="6">UDP</Dropdown.Item>
                    <Dropdown.Item eventKey="7">IPv6</Dropdown.Item>
                    <Dropdown.Item eventKey="8">IPv6-Route</Dropdown.Item>
                    <Dropdown.Item eventKey="9">IPv6-Frag</Dropdown.Item>
                    <Dropdown.Item eventKey="10">Others</Dropdown.Item>
                  </DropdownButton>
                  {this.state.nextHeader === "Others" ? (
                    <Form.Control
                      type="text"
                      name="nextHeaderOther"
                      placeholder="Enter Other type"
                      value={this.state.nextHeaderOther}
                      onChange={this.handleChange}
                    />
                  ) : (
                    <Form.Control disabled />
                  )}
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridHdrExtLen">
                <Form.Label>
                  Header Extension Length{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range: [0-255]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="hdrExtLen"
                  placeholder="Enter Hdr Ext Length"
                  value={this.state.hdrExtLen}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formGridRoutingTypeValue">
                <Form.Label>Routing Type </Form.Label>
                <Form.Check
                  type="switch"
                  id={this.props.action}
                  label=""
                  onClick={() => this.handleRoutingType()}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridSegmentsLeft">
                <Form.Label>
                  Segments Left{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range: [0-255]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="segmentsLeft"
                  placeholder="Enter Segments Left"
                  value={this.state.segmentsLeft}
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
                    overlay={<Tooltip>Valid range: [0-255]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="flags"
                  placeholder="Enter Flags"
                  value={this.state.flags}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTag">
                <Form.Label>
                  Tag{" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range: [0-65535]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tag"
                  placeholder="Enter Tag"
                  value={this.state.tag}
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
            {this.state.mandatoryError ? (
              <small>
                <Alert variant="danger">
                  Header Extension Length field is mandatory
                </Alert>
              </small>
            ) : null}
            {this.state.nextHeaderOtherError ? (
              <small>
                <Alert variant="danger">Invalid Next Header</Alert>
              </small>
            ) : null}
            {this.state.hdrExtLenError ? (
              <small>
                <Alert variant="danger">Invalid Header Extension length</Alert>
              </small>
            ) : null}
            {this.state.segmentsLeftError ? (
              <small>
                <Alert variant="danger">Invalid Segments Left</Alert>
              </small>
            ) : null}
            {this.state.flagsError ? (
              <small>
                <Alert variant="danger">Invalid Flags</Alert>
              </small>
            ) : null}
            {this.state.tagError ? (
              <small>
                <Alert variant="danger">Invalid Tag</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleSRv6Submit(this.props.action);
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.srv6Submit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default SRv6Form;
