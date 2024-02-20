import React from "react";

function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="p-3 mt-auto">
            <p>Copyright ⓒ {year}</p>
        </footer>
    );
}

export default Footer;