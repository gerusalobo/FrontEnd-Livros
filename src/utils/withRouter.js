// src/utils/withRouter.js
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import React from 'react';

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let navigate = useNavigate();
    let location = useLocation();
    let params = useParams();
    return (
      <Component
        {...props}
        navigate={navigate}
        location={location}
        params={params}
      />
    );
  }

  return ComponentWithRouterProp;
}
