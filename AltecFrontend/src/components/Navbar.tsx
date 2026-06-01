import {NavLink} from "react-router-dom"

const links = [
    {
        name: 'Home', 
        path: '/'
    },
    {
        name: 'TSPL', 
        path: '/tspl'
    },
    {
        name: 'Printers', 
        path: '/printers'
    },
    {
        name: 'Automations', 
        path: '/automations'
    },
    {
        name: 'Tools', 
        path: "/tools",
        childeren: [
        {
            name: "Tspl preview",
            path: "/tspl-preview"
        },
        {
            name: "Inkt folie calculator",
            path: "/inkt-folie"
        }
        ]
    }
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
