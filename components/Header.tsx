import React from 'react';

const Header = () => {
    return (
        <header>
            <div className="logo">
                <img src="https://i.imgur.com/R7iU4ao.png" alt="Logo" />
            </div>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;