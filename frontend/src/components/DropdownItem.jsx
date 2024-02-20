import React from "react";

function DropdownItem(props) {
    return (
        <option className="dropdown-item" value={props.title}>{props.title}
        </option>
    );
}

export default DropdownItem;