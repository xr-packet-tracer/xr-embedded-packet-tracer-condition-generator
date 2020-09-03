/*
 *------------------------------------------------------------------
 * MplsForm.js
 *
 * Renders the form for MPLS protocol.
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

export class MplsForm extends Component {
  constructor(props) {
    super(props);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      mplsSubmit: false,
      label: "",
      tc: "",
      eos: "",
      ttl: "",
      emptyError: false,
      labelError: false,
      tcError: false,
      ttlError: false,
      tripletValue: "",
    };

    /*
     * Bind all the event handlers used in this component.
     */
    this.validateLabel = this.validateLabel.bind(this);
    this.validateTC = this.validateTC.bind(this);
    this.handleEos = this.handleEos.bind(this);
    this.validateTTL = this.validateTTL.bind(this);
    this.calculateMplsTriplet = this.calculateMplsTriplet.bind(this);
    this.validateMplsForm = this.validateMplsForm.bind(this);
    this.handleMplsSubmit = this.handleMplsSubmit.bind(this);
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
   * Handles EOS field of MPLS
   */
  handleEos(i) {
    this.setState({
      eos: i.toString(),
    });
  }

  /*
   * Validates Label field of MPLS.
   */
  validateLabel() {
    let val = parseInt(this.state.label);
    if (val >= 0 && val <= 1048575) return true;
    this.setState(
      {
        labelError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates TC field of MPLS.
   */
  validateTC() {
    let val = parseInt(this.state.tc);
    if (val >= 0 && val <= 7) return true;
    this.setState(
      {
        tcError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates TTL field of MPLS.
   */
  validateTTL() {
    let val = parseInt(this.state.ttl);
    if (val >= 1 && val <= 255) return true;
    this.setState(
      {
        ttlError: true,
      },
      () => {
        return false;
      }
    );
  }

  /*
   * Validates the entire MPLS form.
   */
  validateMplsForm() {
    let flag = 0;
    if (
      this.state.label === "" &&
      this.state.tc === "" &&
      this.state.eos === "" &&
      this.state.ttl === ""
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
      this.state.label === "" &&
      this.state.tc === "" &&
      this.state.ttl === ""
    ) {
      return true;
    }
    if (this.state.label !== "") {
      flag = 1;
      if (!this.validateLabel()) return false;
    }
    if (this.state.tc !== "") {
      flag = 1;
      if (!this.validateTC()) return false;
    }
    if (this.state.ttl !== "") {
      flag = 1;
      if (!this.validateTTL()) return false;
    }
    if (flag === 1) return true;
  }

  /*
   * Calculates MPLS triplets.
   */
  calculateMplsTriplet(index) {
    let othersOffset = 0;

    /*
     * Calculates the base offset of MPLS protocol from the
     * very start of the frame.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (MY_GLOBAL.headersSelected[i] === "Ethernet") othersOffset += 14;
      else if (MY_GLOBAL.headersSelected[i] === "MPLS" && i === index) {
        break;
      } else if (MY_GLOBAL.headersSelected[i] === "PW Control Word") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "PPPoE") {
        othersOffset += 12;
      } else if (MY_GLOBAL.headersSelected[i] === "Dot1q") {
        othersOffset += 4;
      } else if (MY_GLOBAL.headersSelected[i] === "SRv6")
        othersOffset += MY_GLOBAL.srv6Length[i];
      else {
        othersOffset += 4;
      }
    }

    let flag1 = 0;
    let labelOffset = 0 + othersOffset;
    let labelValue = "";
    let labelMask = "";
    let temp = "";
    let tcOffset = 2 + othersOffset;
    let eosOffset = 2 + othersOffset;
    let ttlOffset = 3 + othersOffset;
    let ttlValue = "";
    let ttlMask = "ff";
    let ans = "";

    if (this.state.label !== "") {
      //  only label
      if (this.state.tc === "" && this.state.eos === "") {
        flag1 = 1;
        let labelTemp = parseInt(this.state.label).toString(16);
        if (labelTemp.length === 1) {
          labelOffset += 2;
          labelValue = labelTemp;
          labelMask = "f";
        } else if (labelTemp.length === 3) {
          labelOffset += 1;
          labelValue = labelTemp;
          labelMask = "fff";
        } else if (labelTemp.length === 2) {
          labelOffset += 1;
          labelValue = "0" + labelTemp;
          labelMask = "0ff";
        } else if (labelTemp.length === 4) {
          labelOffset += 0;
          labelValue = "0" + labelTemp;
          labelMask = "0ffff";
        } else {
          labelOffset += 0;
          labelValue = labelTemp;
          labelMask = "fffff";
        }
      }
      //  label+tc or label+eos or label+tc+eos
      else if (this.state.eos === "") {
        let labelOffsetTemp = 0;
        let labelTemp =
          parseInt(this.state.label).toString(16) +
          parseInt(parseInt(this.state.tc).toString(2) + "0", 2).toString(16);
        if (labelTemp.length % 2 === 0) {
          labelOffsetTemp = (6 - labelTemp.length) / 2;
          labelValue = labelTemp;
        } else {
          labelOffsetTemp = (6 - labelTemp.length - 1) / 2;
          labelValue += "0" + labelTemp;
        }
        if (labelOffsetTemp === 0) {
          labelMask += "fffffe";
        } else if (labelOffsetTemp === 1) {
          labelMask += "fffe";
        } else {
          labelMask += "fe";
        }
        labelOffset += labelOffsetTemp;
      } else if (this.state.tc === "") {
        let labelOffsetTemp = 0;
        let labelTemp =
          parseInt(this.state.label).toString(16) + this.state.eos;
        if (labelTemp.length % 2 === 0) {
          labelOffsetTemp = (6 - labelTemp.length) / 2;
          labelValue = labelTemp;
        } else {
          labelOffsetTemp = (6 - labelTemp.length - 1) / 2;
          labelValue += "0" + labelTemp;
        }
        if (labelOffsetTemp === 0) {
          labelMask += "fffff1";
        } else if (labelOffsetTemp === 1) {
          labelMask += "fff1";
        } else {
          labelMask += "f1";
        }
        labelOffset += labelOffsetTemp;
      } else {
        let labelOffsetTemp = 0;
        let labelTemp =
          parseInt(this.state.label).toString(16) +
          parseInt(
            parseInt(this.state.tc).toString(2) + this.state.eos,
            2
          ).toString(16);
        if (labelTemp.length % 2 === 0) {
          labelOffsetTemp = (6 - labelTemp.length) / 2;
          labelValue = labelTemp;
        } else {
          labelOffsetTemp = (6 - labelTemp.length - 1) / 2;
          labelValue += "0" + labelTemp;
        }
        if (labelOffsetTemp === 0) {
          labelMask += "ffffff";
        } else if (labelOffsetTemp === 1) {
          labelMask += "ffff";
        } else {
          labelMask += "ff";
        }
        labelOffset += labelOffsetTemp;
      }
    } else if (this.state.tc !== "" && this.state.eos !== "") {
      labelValue =
        "0" +
        parseInt(
          parseInt(this.state.tc).toString(2) + this.state.eos,
          2
        ).toString(16);
      labelMask = "0f";
      labelOffset = tcOffset;
    } else if (this.state.tc !== "") {
      labelValue =
        "0" +
        parseInt(parseInt(this.state.tc).toString(2) + "0", 2).toString(16);
      labelMask = "0e";
      labelOffset = tcOffset;
    } else if (this.state.eos !== "") {
      labelValue = "0" + parseInt("000" + this.state.eos, 2).toString(16);
      labelMask = "01";
      labelOffset = eosOffset;
    }

    if (this.state.ttl !== "") {
      ttlValue = parseInt(this.state.ttl).toString(16);
      if (ttlValue.length === 1) temp = "0";
      if (flag1 === 1) {
        ans +=
          "MPLS: Offset " +
          labelOffset +
          " Value 0x" +
          labelValue +
          "0" +
          temp +
          ttlValue +
          " Mask 0x" +
          labelMask +
          "0" +
          ttlMask +
          "\n";
      } else if (
        this.state.label === "" &&
        this.state.tc === "" &&
        this.state.eos === ""
      ) {
        ans +=
          "MPLS: Offset " +
          ttlOffset +
          " Value 0x" +
          temp +
          ttlValue +
          " Mask 0x" +
          ttlMask +
          "\n";
      } else {
        ans +=
          "MPLS: Offset " +
          labelOffset +
          " Value 0x" +
          labelValue +
          temp +
          ttlValue +
          " Mask 0x" +
          labelMask +
          ttlMask +
          "\n";
      }
    } else {
      if (
        this.state.label !== "" &&
        this.state.tc === "" &&
        this.state.eos === ""
      ) {
        ans +=
          "MPLS: Offset " +
          labelOffset +
          " Value 0x" +
          labelValue +
          "0" +
          " Mask 0x" +
          labelMask +
          "0" +
          "\n";
      } else {
        ans +=
          "MPLS: Offset " +
          labelOffset +
          " Value 0x" +
          labelValue +
          " Mask 0x" +
          labelMask +
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
  handleMplsSubmit(index) {
    this.setState(
      {
        mplsSubmit: false,
        emptyError: false,
        labelError: false,
        tcError: false,
        ttlError: false,
        tripletValue: "",
      },
      () => {
        if (this.validateMplsForm()) {
          this.calculateMplsTriplet(index);
          this.setState({
            mplsSubmit: true,
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
              <Form.Group as={Col} controlId="formGridLabel">
                <Form.Label>
                  Label{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid Range: [0-1048575]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="label"
                  placeholder="Enter MPLS Label"
                  value={this.state.label}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTC">
                <Form.Label>
                  Traffic Class(TC){" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid Range: [0-7]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="tc"
                  placeholder="Enter MPLS TC"
                  value={this.state.tc}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} controlId="formGridEOS">
                <Form.Label>
                  EOS Bit{" "}
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>End of Stack(EOS) Bit </Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <br />
                <Form.Check
                  inline
                  label="0"
                  type="radio"
                  name="eosValue"
                  onClick={() => this.handleEos(0)}
                />
                <Form.Check
                  inline
                  label="1"
                  type="radio"
                  name="eosValue"
                  onClick={() => this.handleEos(1)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridTTL">
                <Form.Label>
                  Time-To-Live(TTL){" "}
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Valid range: [1-255]</Tooltip>}
                  >
                    <small style={{ color: "#5DADE2" }}>
                      <FaQuestion />
                    </small>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="ttl"
                  placeholder="Enter MPLS TTL"
                  value={this.state.ttl}
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
            {this.state.labelError ? (
              <small>
                <Alert variant="danger">Invalid MPLS Label</Alert>
              </small>
            ) : null}
            {this.state.tcError ? (
              <small>
                <Alert variant="danger">Invalid MPLS TC</Alert>
              </small>
            ) : null}
            {this.state.ttlError ? (
              <small>
                <Alert variant="danger">Invalid TTL value</Alert>
              </small>
            ) : null}

            <Button
              variant="success"
              onClick={() => {
                this.handleMplsSubmit(this.props.action);
                this.props.step3();
              }}
            >
              Submit
            </Button>
          </Form>
        </Card.Body>
        {/* Renders DisplayTriplets component in the Card footer. */}
        {this.state.mplsSubmit ? (
          <DisplayTriplets action={this.state.tripletValue} />
        ) : null}
      </React.Fragment>
    );
  }
}

export default MplsForm;
