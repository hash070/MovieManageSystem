import React from 'react';
import {NavLink} from "react-router-dom";

function IndexNav(props) {
    return (
        <div>
            <NavLink to={props.path}>点击跳转到{props.name}</NavLink>
        </div>
    );
}

export default IndexNav;