/*
 *------------------------------------------------------------------
 * Content.js
 *
 * Renders the base component of the web application.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */

import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import AddHeader from "./AddHeader";
import NavHeader from "./NavHeader";
import NavFooter from "./NavFooter";
import Dot1qPlusMinus from "./Dot1qPlusMinus";
import Ipv6PlusMinus from "./Ipv6PlusMinus";
import MplsPlusMinus from "./MplsPlusMinus";
import PPPoEPlusMinus from "./PPPoEPlusMinus";
import PWPlusMinus from "./PWPlusMinus";
import TCPPlusMinus from "./TCPPlusMinus";
import EthernetPlusMinus from "./EthernetPlusMinus";
import Ipv4PlusMinus from "./Ipv4PlusMinus";
import UDPPlusMinus from "./UDPPlusMinus";
import SRv6PlusMinus from "./SRv6PlusMinus";
import EthernetForm from "./EthernetForm";
import Dot1qForm from "./Dot1qForm";
import Ipv4Form from "./Ipv4Form";
import Ipv6Form from "./Ipv6Form";
import MplsForm from "./MplsForm";
import SRv6Form from "./SRv6Form";
import TCPForm from "./TCPForm";
import UDPForm from "./UDPForm";
import "./Content.css";
import MY_GLOBAL from "./Globals";

class Content extends Component {
  constructor(props) {
    super(props);

    /*
     * Bind all the event handlers used in this component.
     */
    this.handleEthernetAdd = this.handleEthernetAdd.bind(this);
    this.handleEthernetMinus = this.handleEthernetMinus.bind(this);
    this.handleDot1qAdd = this.handleDot1qAdd.bind(this);
    this.handleDot1qMinus = this.handleDot1qMinus.bind(this);
    this.handleMplsAdd = this.handleMplsAdd.bind(this);
    this.handleMplsMinus = this.handleMplsMinus.bind(this);
    this.handlePWCWAdd = this.handlePWCWAdd.bind(this);
    this.handlePWCWMinus = this.handlePWCWMinus.bind(this);
    this.handlePPPoEAdd = this.handlePPPoEAdd.bind(this);
    this.handlePPPoEMinus = this.handlePPPoEMinus.bind(this);
    this.handleIpv4Add = this.handleIpv4Add.bind(this);
    this.handleIpv4Minus = this.handleIpv4Minus.bind(this);
    this.handleIpv6Add = this.handleIpv6Add.bind(this);
    this.handleIpv6Minus = this.handleIpv6Minus.bind(this);
    this.handleSRv6Add = this.handleSRv6Add.bind(this);
    this.handleSRv6Minus = this.handleSRv6Minus.bind(this);
    this.handleTCPAdd = this.handleTCPAdd.bind(this);
    this.handleTCPMinus = this.handleTCPMinus.bind(this);
    this.handleUDPAdd = this.handleUDPAdd.bind(this);
    this.handleUDPMinus = this.handleUDPMinus.bind(this);
    this.step3handler = this.step3handler.bind(this);

    /*
     * Initialize all the state variables used in this component.
     */
    this.state = {
      ethernetLinkClicked: 0,
      dot1qLinkClicked: 0,
      mplsLinkClicked: 0,
      pwcwLinkClicked: 0,
      pppoeLinkClicked: 0,
      ipv4LinkClicked: 0,
      ipv6LinkClicked: 0,
      srv6LinkClicked: 0,
      tcpLinkClicked: 0,
      udpLinkClicked: 0,
      headersCheckboxed: [],
      tripletDisplayed: 0,
    };
  }

  /*
   * Handles input change in any of the fields.
   */
  handleCheckbox = (i) => {
    this.setState((state) => {
      const headersCheckboxed = state.headersCheckboxed.map((item, j) => {
        if (j === i) {
          return !item;
        } else return item;
      });
      return {
        headersCheckboxed,
      };
    });
  };

  /*
   * Handles stepper information
   */
  step3handler() {
    this.setState({
      tripletDisplayed: 1,
    });
  }

  /*
   * Handles clicks on + button of Ethernet
   */
  handleEthernetAdd() {
    if (this.state.ethernetLinkClicked >= 0) {
      MY_GLOBAL.headersSelected.push("Ethernet");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        ethernetLinkClicked: prev.ethernetLinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of Ethernet
   */
  handleEthernetMinus() {
    if (this.state.ethernetLinkClicked > 0) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("Ethernet"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        ethernetLinkClicked: prev.ethernetLinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of Dot1q
   */
  handleDot1qAdd() {
    if (this.state.dot1qLinkClicked >= 0) {
      MY_GLOBAL.headersSelected.push("Dot1q");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        dot1qLinkClicked: prev.dot1qLinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of Dot1q
   */
  handleDot1qMinus() {
    if (this.state.dot1qLinkClicked > 0) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("Dot1q"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        dot1qLinkClicked: prev.dot1qLinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of MPLS
   */
  handleMplsAdd() {
    if (this.state.mplsLinkClicked >= 0) {
      MY_GLOBAL.headersSelected.push("MPLS");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        mplsLinkClicked: prev.mplsLinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of MPLS
   */
  handleMplsMinus() {
    if (this.state.mplsLinkClicked > 0) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("MPLS"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        mplsLinkClicked: prev.mplsLinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of PW Control Word
   */
  handlePWCWAdd() {
    if (this.state.pwcwLinkClicked >= 0) {
      MY_GLOBAL.headersSelected.push("PW Control Word");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        pwcwLinkClicked: prev.pwcwLinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of PW Control Word
   */
  handlePWCWMinus() {
    if (this.state.pwcwLinkClicked > 0) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("PW Control Word"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        pwcwLinkClicked: prev.pwcwLinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of PPPoE
   */
  handlePPPoEAdd() {
    if (this.state.pppoeLinkClicked >= 0) {
      MY_GLOBAL.headersSelected.push("PPPoE");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        pppoeLinkClicked: prev.pppoeLinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of PPPoE
   */
  handlePPPoEMinus() {
    if (this.state.pppoeLinkClicked > 0) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("PPPoE"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        pppoeLinkClicked: prev.pppoeLinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of IPv4
   */
  handleIpv4Add() {
    if (this.state.ipv4LinkClicked === 0) {
      MY_GLOBAL.headersSelected.push("IPv4");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        ipv4LinkClicked: 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of IPv4
   */
  handleIpv4Minus() {
    if (this.state.ipv4LinkClicked === 1) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.indexOf("IPv4"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState({
        headersCheckboxed: tempArray,
        ipv4LinkClicked: 0,
      });
    }
  }

  /*
   * Handles clicks on + button of IPv6
   */
  handleIpv6Add() {
    if (this.state.ipv6LinkClicked === 0) {
      MY_GLOBAL.headersSelected.push("IPv6");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        ipv6LinkClicked: 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of IPv6
   */
  handleIpv6Minus() {
    if (this.state.ipv6LinkClicked === 1) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.indexOf("IPv6"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState({
        headersCheckboxed: tempArray,
        ipv6LinkClicked: 0,
      });
    }
  }

  /*
   * Handles clicks on + button of SRv6
   */
  handleSRv6Add() {
    if (this.state.srv6LinkClicked >= 0) {
      let temp = MY_GLOBAL.headersSelected.length;
      MY_GLOBAL.srv6Length[temp] = 0;
      MY_GLOBAL.headersSelected.push("SRv6");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        srv6LinkClicked: prev.srv6LinkClicked + 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of SRv6
   */
  handleSRv6Minus() {
    if (this.state.srv6LinkClicked > 0) {
      let temp = MY_GLOBAL.headersSelected.lastIndexOf("SRv6");
      delete MY_GLOBAL.srv6Length[temp];
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.lastIndexOf("SRv6"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState((prev) => ({
        headersCheckboxed: tempArray,
        srv6LinkClicked: prev.srv6LinkClicked - 1,
      }));
    }
  }

  /*
   * Handles clicks on + button of TCP
   */
  handleTCPAdd() {
    if (this.state.tcpLinkClicked === 0) {
      MY_GLOBAL.headersSelected.push("TCP");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        tcpLinkClicked: 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of TCP
   */
  handleTCPMinus() {
    if (this.state.tcpLinkClicked === 1) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.indexOf("TCP"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState({
        headersCheckboxed: tempArray,
        tcpLinkClicked: 0,
      });
    }
  }

  /*
   * Handles clicks on + button of UDP
   */
  handleUDPAdd() {
    if (this.state.udpLinkClicked === 0) {
      MY_GLOBAL.headersSelected.push("UDP");
      this.setState((prev) => ({
        headersCheckboxed: [...prev.headersCheckboxed, false],
        udpLinkClicked: 1,
      }));
    }
  }

  /*
   * Handles clicks on - button of UDP
   */
  handleUDPMinus() {
    if (this.state.udpLinkClicked === 1) {
      MY_GLOBAL.headersSelected.splice(
        MY_GLOBAL.headersSelected.indexOf("UDP"),
        1
      );
      let tempArray = [...this.state.headersCheckboxed];
      tempArray.splice(tempArray.length - 1, 1);
      this.setState({
        headersCheckboxed: tempArray,
        udpLinkClicked: 0,
      });
    }
  }

  render() {
    /*
     * Store AddHeader component of each protocol
     * chosen for designing the frame in an array.
     */
    var rows = [];
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      rows.push(
        <AddHeader
          key={i}
          valueForEventKey={i}
          name={MY_GLOBAL.headersSelected[i]}
          action={
            MY_GLOBAL.headersSelected[i] !== "PPPoE" &&
            MY_GLOBAL.headersSelected[i] !== "PW Control Word"
              ? this.handleCheckbox
              : null
          }
        />
      );
    }

    /*
     * Store the cards of each protocol
     * chosen for packet tracing in an array.
     */
    var checkboxedCards = [];
    /*
     * Iterate over each element in the global frame
     * and check if it's checkbox is checked.
     * If yes, push it's corresponding form component to the end of the
     * checkboxedCards array.
     */
    for (let i = 0; i < MY_GLOBAL.headersSelected.length; i++) {
      if (this.state.headersCheckboxed[i] === true) {
        checkboxedCards.push(
          <div>
            <div
              style={{
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              }}
            >
              <Card border="primary" bg="light" key={i}>
                <Card.Header as="h4">
                  {MY_GLOBAL.headersSelected[i]}
                </Card.Header>
                {MY_GLOBAL.headersSelected[i] === "Ethernet" ? (
                  <EthernetForm action={i} step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "Dot1q" ? (
                  <Dot1qForm action={i} step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "MPLS" ? (
                  <MplsForm action={i} step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "IPv4" ? (
                  <Ipv4Form step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "IPv6" ? (
                  <Ipv6Form step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "SRv6" ? (
                  <SRv6Form action={i} step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "TCP" ? (
                  <TCPForm step3={this.step3handler} />
                ) : MY_GLOBAL.headersSelected[i] === "UDP" ? (
                  <UDPForm step3={this.step3handler} />
                ) : null}
              </Card>
            </div>
            <br />
          </div>
        );
      }
    }

    return (
      <React.Fragment>
        <header>
          <NavHeader />
        </header>
        <br />
        <main>
          <Container fluid>
            <Row>
              <div className="container">
                <ul className="progressbar">
                  {MY_GLOBAL.headersSelected.length === 0 ? (
                    <li>design frame header</li>
                  ) : (
                    <li className="active">design frame header</li>
                  )}
                  {this.state.headersCheckboxed.indexOf(true) === -1 ? (
                    <li>checkbox necessary protocol headers</li>
                  ) : (
                    <li className="active">
                      checkbox necessary protocol headers
                    </li>
                  )}
                  {this.state.tripletDisplayed === 0 ||
                  this.state.headersCheckboxed.indexOf(true) === -1 ? (
                    <li>generate offset/value/mask</li>
                  ) : (
                    <li className="active">generate offset/value/mask</li>
                  )}
                </ul>
              </div>
            </Row>
            <Row>
              <Col md={3}>
                <Row
                  style={{
                    height: "85vh",
                    overflow: "auto",
                    display: "block",
                  }}
                >
                  <table style={{ width: "75%", margin: "0 auto" }}>
                    <tbody>
                      <br />
                      <Dot1qPlusMinus
                        minusAction={this.handleDot1qMinus}
                        plusAction={this.handleDot1qAdd}
                      />
                      <EthernetPlusMinus
                        minusAction={this.handleEthernetMinus}
                        plusAction={this.handleEthernetAdd}
                      />
                      <Ipv4PlusMinus
                        minusAction={this.handleIpv4Minus}
                        plusAction={this.handleIpv4Add}
                      />
                      <Ipv6PlusMinus
                        minusAction={this.handleIpv6Minus}
                        plusAction={this.handleIpv6Add}
                      />
                      <MplsPlusMinus
                        minusAction={this.handleMplsMinus}
                        plusAction={this.handleMplsAdd}
                      />
                      <PPPoEPlusMinus
                        minusAction={this.handlePPPoEMinus}
                        plusAction={this.handlePPPoEAdd}
                      />
                      <PWPlusMinus
                        minusAction={this.handlePWCWMinus}
                        plusAction={this.handlePWCWAdd}
                      />
                      <SRv6PlusMinus
                        minusAction={this.handleSRv6Minus}
                        plusAction={this.handleSRv6Add}
                      />
                      <TCPPlusMinus
                        minusAction={this.handleTCPMinus}
                        plusAction={this.handleTCPAdd}
                      />
                      <UDPPlusMinus
                        minusAction={this.handleUDPMinus}
                        plusAction={this.handleUDPAdd}
                      />
                    </tbody>
                  </table>
                </Row>
              </Col>
              <Col md={3}>
                <Row
                  style={{
                    height: "85vh",
                    overflow: "auto",
                    display: "block",
                  }}
                >
                  <table style={{ width: "75%", margin: "0 auto" }}>
                    <tbody>
                      <br />
                      {rows}
                    </tbody>
                  </table>
                </Row>
              </Col>
              <Col md={6}>
                <Row
                  style={{
                    height: "85vh",
                    overflow: "auto",
                    display: "block",
                  }}
                >
                  <div style={{ width: "95%", margin: "0 auto" }}>
                    <br />
                    {checkboxedCards}
                  </div>
                </Row>
              </Col>
            </Row>
          </Container>
        </main>
        <footer>
          <NavFooter />
        </footer>
      </React.Fragment>
    );
  }
}

export default Content;
