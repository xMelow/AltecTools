import {useState} from "react"
import {NavLink} from "react-router-dom"

const links = [
    {name: 'Home', path: '/'},
    {name: 'TSPL', path: '/tspl'},
    {name: 'Printers', path: '/printers'},
    {name: 'Automations', path: '/automations'}
]

export default function Navbar() {
    return (
        <nav className="">
            <ul className="flex gap-14">
                {links.map(link => (
                    <li
                        key={link.name}
                        className=""
                    >
                        <NavLink
                            className={({ isActive }) => isActive ? 'nav-link-active' : 'nav-link'}
                            to={link.path}
                        >
                            {link.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
