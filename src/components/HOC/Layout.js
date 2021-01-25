import React from 'react';
import {NavLink} from "react-router-dom";
import {Router} from "./Router";

export const Layout = () => {
  return (
      <div className={'Layout'}>
          <div className="Layout__nav">
              <div className="Layout__nav_logo">
                  <h1>Mazaev0950</h1>
              </div>
              <div className="Layout__nav_menu">
                  <ul>
                      <li>
                          <NavLink to={'/'} exact>
                              Main page
                          </NavLink>
                      </li>
                      <li>
                          <NavLink to={'/info'}>
                              Information
                          </NavLink>
                      </li>
                  </ul>
              </div>
          </div>
          <div className="Layout__content">
              <Router />
          </div>
      </div>
  )
};