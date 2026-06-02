import { NavLink } from "react-router-dom"
import NavLinkDropdown from "./NavbarLinkDropdown"

const links = [
    {
        name: 'Home', 
        path: '/'
    },
    {
        name: 'Tools', 
        path: "/tools",
        children: [
            {
                name: "Tspl preview",
                path: "/tools/tspl-preview"
            },
            {
                name: "Inkt folie calculator",
                path: "/tools/ink-calculator"
            }
        ]
    },
    {
        name: 'Printers', 
        path: '/printers'
    },
    {
        name: 'Automations',
        path: '/automations'
    },
]

export default function Navbar() {
    return (
        <nav className="">
            <ul className="flex gap-14">
                {links.map(link => (
                    link.children
                    ? <NavLinkDropdown key={link.name} link={link} />
                    : <li
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
