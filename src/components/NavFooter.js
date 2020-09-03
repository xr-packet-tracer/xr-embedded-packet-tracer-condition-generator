/*
 *------------------------------------------------------------------
 * NavFooter.js
 * 
 * Renders the navigation footer component.
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

class NavFooter extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark" style={{ position: "relative" }}>
          <Navbar.Brand>
            <div>
              <small>Copyright &copy; 2020 Cisco</small>
              <img
                style={{ right: "0", position: "absolute" }}
                alt=""
                src={ImageFile}
                width="100vw"
                height="35vh"
                className="d-inline-block align-middle"
              />
            </div>
          </Navbar.Brand>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default NavFooter;
