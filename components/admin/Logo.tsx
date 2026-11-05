import React from "react";

/* Sign-in screen: mark, DECO-LAND wordmark and a small "Website admin" label. */
export const Logo = () => (
  <div className="deco-login-brand">
    <img src="/photos/Logo_Gold_noBg.png" alt="" width={72} height={72} className="deco-login-brand__mark" />
    <span className="deco-login-brand__name">DECO-LAND</span>
    <span className="deco-login-brand__label">Website admin</span>
  </div>
);

export default Logo;
