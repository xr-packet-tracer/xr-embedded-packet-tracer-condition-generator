/*
 *------------------------------------------------------------------
 * NavHeader.js
 * 
 * Renders the navigation header component.
 *
 * June 2020, Rohith Raj S
 *
 * Copyright (c) 2020-2023 by Cisco Systems, Inc.
 * All rights reserved.
 *------------------------------------------------------------------
 */


import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import ImageFile from "../static/logo.svg";

class NavHeader extends Component {
  render() {
    return (
      <React.Fragment>
        <div
          style={{
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <Navbar
            bg="dark"
            variant="dark"
            fixed="top"
            style={{ position: "relative" }}
          >
            <Navbar.Brand>
              <div style={{ fontSize: "120%" }}>
                <img
                  style={{ marginRight: "20px" }}
                  alt=""
                  src={ImageFile}
                  width="90vw"
                  height="45vh"
                  className="d-inline-block align-middle"
                />
                Packet Tracer Condition Generator
              </div>
            </Navbar.Brand>
          </Navbar>
        </div>
      </React.Fragment>
    );
  }
}

export default NavHeader;
